import Matter from 'matter-js';
import { soundManager } from '../audio/soundManager';
import { BlockConfig, ChickenType, FloatingText, LevelData, Particle, SandeepConfig } from '../types/game';
import { CharacterRenderer } from './characterRenderer';

export interface GameEngineCallbacks {
  onScoreUpdate: (score: number) => void;
  onPigsUpdate: (remaining: number, total: number) => void;
  onChickensUpdate: (remaining: number, total: number) => void;
  onLevelComplete: (stars: number, score: number, unusedChickens: number) => void;
  onLevelFailed: (score: number) => void;
  onFloatingText: (text: string, x: number, y: number, color?: string) => void;
}

export class PhysicsGameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private callbacks: GameEngineCallbacks;

  // Matter.js components
  private engine: Matter.Engine;
  private world: Matter.World;
  private runner: number | null = null;

  // Level data & state
  private currentLevel: LevelData | null = null;
  private chickensQueue: ChickenType[] = [];
  private totalChickensCount: number = 0;
  private currentChickenType: ChickenType | null = null;
  private activeChickenBody: Matter.Body | null = null;
  private extraChickenBodies: Matter.Body[] = []; // For The Blues split
  private pigBodies: Map<string, { body: Matter.Body; config: SandeepConfig }> = new Map();
  private blockBodies: Map<string, { body: Matter.Body; config: BlockConfig; health: number; maxHealth: number }> = new Map();

  // Slingshot
  public readonly SLING_X = 180;
  public readonly SLING_Y = 400;
  public readonly MAX_PULL = 100;
  private isPulling: boolean = false;
  private pullPos = { x: 180, y: 400 };
  private canLaunch: boolean = true;
  private chickenInFlight: boolean = false;
  private chickenAbilityUsed: boolean = false;
  private launchTime: number = 0;
  private settleTimer: number | null = null;
  private isSettlingPhase: boolean = true;
  private settlePhaseTimer: number | null = null;

  // Score
  private currentScore: number = 0;
  private totalPigsCount: number = 0;

  // Visual effects
  private particles: Particle[] = [];
  private floatingTexts: FloatingText[] = [];
  private trajectoryDots: { x: number; y: number; alpha: number }[] = [];
  private lastFlightTrails: { x: number; y: number }[] = [];

  // Camera viewport
  private cameraX: number = 0;
  private cameraY: number = 0;
  private cameraZoom: number = 1;
  private targetCameraX: number = 0;
  private targetCameraZoom: number = 1;

  // Clouds & ambient scenery
  private clouds: { x: number; y: number; speed: number; size: number }[] = [];

  constructor(canvas: HTMLCanvasElement, callbacks: GameEngineCallbacks) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.callbacks = callbacks;

    // Initialize Matter.js
    this.engine = Matter.Engine.create({
      gravity: { x: 0, y: 1.0, scale: 0.0018 },
    });
    this.world = this.engine.world;

    this.initScenery();
    this.setupCollisionEvents();
  }

  private initScenery() {
    this.clouds = [
      { x: -300, y: 70, speed: 0.2, size: 70 },
      { x: 100, y: 60, speed: 0.22, size: 60 },
      { x: 480, y: 110, speed: 0.15, size: 85 },
      { x: 880, y: 50, speed: 0.25, size: 70 },
      { x: 1280, y: 90, speed: 0.18, size: 90 },
      { x: 1680, y: 70, speed: 0.22, size: 65 },
      { x: 2100, y: 85, speed: 0.19, size: 80 },
      { x: 2550, y: 60, speed: 0.24, size: 75 },
    ];
  }

  // Load and setup a level
  public loadLevel(level: LevelData) {
    this.currentLevel = level;
    this.resetWorld();

    // Settle phase prevents micro-settling physics from damaging pigs or collapsing structures at spawn
    this.isSettlingPhase = true;
    if (this.settlePhaseTimer) {
      window.clearTimeout(this.settlePhaseTimer);
    }
    this.settlePhaseTimer = window.setTimeout(() => {
      this.isSettlingPhase = false;
    }, 1400);

    this.chickensQueue = [...level.chickens];
    this.totalChickensCount = level.chickens.length;
    this.totalPigsCount = level.pigs.length;
    this.currentScore = 0;
    this.trajectoryDots = [];
    this.lastFlightTrails = [];

    this.callbacks.onScoreUpdate(0);
    this.callbacks.onPigsUpdate(this.totalPigsCount, this.totalPigsCount);
    this.callbacks.onChickensUpdate(this.totalChickensCount, this.totalChickensCount);

    // Build Ground and Boundaries
    this.buildBoundaries();

    // Spawn Blocks
    level.blocks.forEach((b) => {
      this.spawnBlock(b);
    });

    // Spawn Sandeep Pigs
    level.pigs.forEach((p) => {
      this.spawnPig(p);
    });

    // Load first chicken onto slingshot
    this.loadNextChicken();

    // Reset camera
    this.cameraX = 0;
    this.targetCameraX = 0;
    this.cameraZoom = 1;
    this.targetCameraZoom = 1;
  }

  private resetWorld() {
    if (this.settleTimer) {
      window.clearTimeout(this.settleTimer);
      this.settleTimer = null;
    }
    if (this.settlePhaseTimer) {
      window.clearTimeout(this.settlePhaseTimer);
      this.settlePhaseTimer = null;
    }
    Matter.World.clear(this.world, false);
    this.pigBodies.clear();
    this.blockBodies.clear();
    this.activeChickenBody = null;
    this.extraChickenBodies = [];
    this.particles = [];
    this.floatingTexts = [];
    this.chickenInFlight = false;
    this.chickenAbilityUsed = false;
    this.isPulling = false;
    this.pullPos = { x: this.SLING_X, y: this.SLING_Y };
  }

  private buildBoundaries() {
    const groundY = 520;
    const ground = Matter.Bodies.rectangle(1200, groundY + 100, 4400, 200, {
      isStatic: true,
      friction: 0.9,
      label: 'ground',
    });

    const leftWall = Matter.Bodies.rectangle(-600, 300, 100, 1200, {
      isStatic: true,
      label: 'wall',
    });

    const rightWall = Matter.Bodies.rectangle(2600, 300, 100, 1200, {
      isStatic: true,
      label: 'wall',
    });

    Matter.World.add(this.world, [ground, leftWall, rightWall]);
  }

  private spawnBlock(config: BlockConfig) {
    let body: Matter.Body;
    const opts: Matter.IChamferableBodyDefinition = {
      // Sturdy friction so pillars don't slide or collapse from micro-vibrations
      friction: config.material === 'ice' ? 0.15 : config.material === 'wood' ? 0.85 : 0.98,
      frictionStatic: config.material === 'ice' ? 0.3 : config.material === 'wood' ? 0.95 : 1.2,
      restitution: config.material === 'ice' ? 0.12 : 0.01,
      density: config.material === 'stone' ? 0.006 : config.material === 'wood' ? 0.003 : 0.0018,
      label: `block_${config.material}_${config.id}`,
    };

    if (config.isCircle) {
      body = Matter.Bodies.circle(config.x, config.y, config.width / 2, opts);
    } else {
      body = Matter.Bodies.rectangle(config.x, config.y, config.width, config.height, opts);
    }

    if (config.angle) {
      Matter.Body.setAngle(body, config.angle);
    }

    const maxHp = config.material === 'stone' ? 320 : config.material === 'wood' ? 160 : config.material === 'ice' ? 80 : 40;

    this.blockBodies.set(config.id, {
      body,
      config,
      health: maxHp,
      maxHealth: maxHp,
    });

    Matter.World.add(this.world, body);
  }

  private spawnPig(config: SandeepConfig) {
    const body = Matter.Bodies.circle(config.x, config.y, config.radius, {
      friction: 0.5,
      restitution: 0.25,
      density: 0.0016,
      label: `pig_${config.id}`,
    });

    this.pigBodies.set(config.id, {
      body,
      config: { ...config },
    });

    Matter.World.add(this.world, body);
  }

  private loadNextChicken() {
    if (this.chickensQueue.length === 0) {
      this.currentChickenType = null;
      this.canLaunch = false;
      this.checkLevelOutcome();
      return;
    }

    this.currentChickenType = this.chickensQueue.shift()!;
    this.canLaunch = true;
    this.chickenInFlight = false;
    this.chickenAbilityUsed = false;
    this.activeChickenBody = null;
    this.extraChickenBodies = [];
    this.pullPos = { x: this.SLING_X, y: this.SLING_Y };

    this.callbacks.onChickensUpdate(this.chickensQueue.length + 1, this.totalChickensCount);

    // Camera refocus on slingshot
    this.targetCameraX = 0;
    this.targetCameraZoom = 1;
  }

  // Handle Collisions and Damage Calculation
  private setupCollisionEvents() {
    Matter.Events.on(this.engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        this.handleCollisionPair(pair.bodyA, pair.bodyB);
      });
    });
  }

  private handleCollisionPair(bodyA: Matter.Body, bodyB: Matter.Body) {
    const vA = bodyA.velocity;
    const vB = bodyB.velocity;
    const relSpeed = Math.hypot(vA.x - vB.x, vA.y - vB.y);

    if (relSpeed < 1.2) return;

    // Check Pigs
    this.checkPigDamage(bodyA, bodyB, relSpeed);
    this.checkPigDamage(bodyB, bodyA, relSpeed);

    // Check Blocks
    this.checkBlockDamage(bodyA, bodyB, relSpeed);
    this.checkBlockDamage(bodyB, bodyA, relSpeed);
  }

  private checkPigDamage(target: Matter.Body, attacker: Matter.Body, relSpeed: number) {
    // Settle phase protects pigs from passive physics settling at spawn
    if (this.isSettlingPhase) return;

    const isChicken = attacker.label.startsWith('chicken_') || attacker.label.startsWith('matilda_egg');

    // For non-chicken bodies (falling blocks/nudges), require high impact speed
    if (!isChicken && relSpeed < 4.8) return;
    if (isChicken && relSpeed < 1.4) return;

    for (const [id, pigData] of this.pigBodies.entries()) {
      if (pigData.body === target) {
        const massBonus = Math.min(3, attacker.mass);
        const damage = isChicken
          ? Math.round(relSpeed * 12 * massBonus)
          : Math.round((relSpeed - 3.5) * 8 * massBonus);

        if (damage <= 0) return;

        pigData.config.health -= damage;
        soundManager.playSandeepHurt();

        // Spawn sweat / stars
        this.spawnImpactParticles(target.position.x, target.position.y, '#75d61f', 4);

        if (pigData.config.health <= 0) {
          this.popSandeep(id, pigData);
        }
        break;
      }
    }
  }

  private checkBlockDamage(target: Matter.Body, attacker: Matter.Body, relSpeed: number) {
    if (this.isSettlingPhase) return;

    const isChicken = attacker.label.startsWith('chicken_') || attacker.label.startsWith('matilda_egg');
    // Only substantial impacts damage blocks:
    // Non-chicken collisions (tumbling blocks) require high speed (>= 6.0) to eliminate runaway domino collapses
    if (!isChicken && relSpeed < 6.0) return;
    if (isChicken && relSpeed < 1.4) return;

    for (const [id, blockData] of this.blockBodies.entries()) {
      if (blockData.body === target) {
        const mat = blockData.config.material;

        // Multiplier based on attacker type
        let attackerBonus = 1;
        if (attacker.label.startsWith('chicken_blues') && mat === 'ice') {
          attackerBonus = 3.5;
        } else if (attacker.label.startsWith('chicken_chuck') && mat === 'wood') {
          attackerBonus = 3.2;
        } else if (attacker.label.startsWith('chicken_bomb') && mat === 'stone') {
          attackerBonus = 4.0;
        }

        const damage = isChicken
          ? Math.round(relSpeed * 8.5 * attackerBonus)
          : Math.round((relSpeed - 4.5) * 4.0);

        if (damage <= 0) return;
        blockData.health -= damage;

        // Play impact sound & particles
        soundManager.playHit(mat, Math.min(2, relSpeed / 5));
        const pColor = mat === 'wood' ? '#b07d48' : mat === 'ice' ? '#99e0ff' : mat === 'stone' ? '#8a949e' : '#dc2626';
        this.spawnImpactParticles(target.position.x, target.position.y, pColor, 3);

        // Check TNT trigger
        if (mat === 'tnt' && (relSpeed > 3.2 || blockData.health <= 0)) {
          this.detonateTNT(target.position.x, target.position.y, id);
        } else if (blockData.health <= 0) {
          this.destroyBlock(id, blockData);
        }
        break;
      }
    }
  }

  private destroyBlock(id: string, blockData: { body: Matter.Body; config: BlockConfig }) {
    const pos = blockData.body.position;
    const pts = blockData.config.material === 'stone' ? 200 : blockData.config.material === 'wood' ? 120 : 80;

    this.addScore(pts, pos.x, pos.y, pts > 150 ? '#fde047' : '#ffffff');
    this.spawnImpactParticles(pos.x, pos.y, '#d1d5db', 8);

    Matter.World.remove(this.world, blockData.body);
    this.blockBodies.delete(id);
  }

  private popSandeep(id: string, pigData: { body: Matter.Body; config: SandeepConfig }) {
    const pos = pigData.body.position;
    soundManager.playSandeepPop();

    // Floating +3000 score
    const pts = 3000;
    this.addScore(pts, pos.x, pos.y, '#4ade80');

    // Pop particles
    this.spawnImpactParticles(pos.x, pos.y, '#65c918', 14);
    this.spawnImpactParticles(pos.x, pos.y, '#ffffff', 8, 'smoke');

    Matter.World.remove(this.world, pigData.body);
    this.pigBodies.delete(id);

    this.callbacks.onPigsUpdate(this.pigBodies.size, this.totalPigsCount);

    if (this.pigBodies.size === 0) {
      // Victory imminent! Settle quickly
      this.scheduleSettleCheck(1200);
    }
  }

  // TNT Detonation Shockwave
  private detonateTNT(x: number, y: number, tntId: string) {
    soundManager.playExplosion(true);

    // Remove the TNT body
    const tnt = this.blockBodies.get(tntId);
    if (tnt) {
      Matter.World.remove(this.world, tnt.body);
      this.blockBodies.delete(tntId);
    }

    this.addScore(500, x, y, '#ef4444');
    this.spawnImpactParticles(x, y, '#ff5500', 25, 'spark');
    this.spawnImpactParticles(x, y, '#4b5563', 15, 'smoke');

    // Massive radial physics blast force applied to all nearby bodies
    const blastRadius = 220;
    const blastForce = 0.055;

    const allBodies = Matter.Composite.allBodies(this.world);
    allBodies.forEach((body) => {
      if (body.isStatic) return;
      const dx = body.position.x - x;
      const dy = body.position.y - y;
      const dist = Math.hypot(dx, dy);

      if (dist < blastRadius && dist > 1) {
        const falloff = 1 - dist / blastRadius;
        const forceMag = blastForce * falloff;
        const fx = (dx / dist) * forceMag;
        const fy = (dy / dist) * forceMag - 0.015; // upward lift

        Matter.Body.applyForce(body, body.position, { x: fx, y: fy });

        // Heavy damage to pigs caught in blast
        this.pigBodies.forEach((pig, pId) => {
          if (pig.body === body) {
            pig.config.health -= Math.round(150 * falloff);
            if (pig.config.health <= 0) {
              this.popSandeep(pId, pig);
            }
          }
        });

        // Damage to blocks
        this.blockBodies.forEach((block, bId) => {
          if (block.body === body) {
            block.health -= Math.round(100 * falloff);
            if (block.health <= 0) {
              this.destroyBlock(bId, block);
            }
          }
        });
      }
    });
  }

  private addScore(pts: number, x: number, y: number, color: string = '#ffffff') {
    this.currentScore += pts;
    this.callbacks.onScoreUpdate(this.currentScore);

    this.floatingTexts.push({
      id: Math.random().toString(),
      text: `+${pts}`,
      x,
      y,
      color,
      size: pts >= 5000 ? 26 : pts >= 1000 ? 22 : 18,
      opacity: 1,
      vy: -1.6,
      life: 0,
      maxLife: 45,
    });
  }

  // Chicken Launch & Abilities
  public startPull(x: number, y: number): boolean {
    if (!this.canLaunch || this.chickenInFlight || !this.currentChickenType) return false;

    // Instantly terminate settling phase upon user interaction
    this.isSettlingPhase = false;
    if (this.settlePhaseTimer) {
      window.clearTimeout(this.settlePhaseTimer);
      this.settlePhaseTimer = null;
    }

    // Convert screen coordinates to world coordinates considering camera transform!
    const worldX = x / this.cameraZoom + this.cameraX;
    const worldY = y / this.cameraZoom + this.cameraY;

    // Check if clicked/touched close to slingshot in world space
    const dist = Math.hypot(worldX - this.SLING_X, worldY - this.SLING_Y);
    if (dist < 105) {
      this.isPulling = true;
      this.updatePull(x, y);
      return true;
    }
    return false;
  }

  public updatePull(x: number, y: number) {
    if (!this.isPulling) return;

    // Convert screen coordinates to world coordinates
    const worldX = x / this.cameraZoom + this.cameraX;
    const worldY = y / this.cameraZoom + this.cameraY;

    let dx = worldX - this.SLING_X;
    let dy = worldY - this.SLING_Y;
    const dist = Math.hypot(dx, dy);

    // Limit to pulling backwards / within max radius
    if (dist > this.MAX_PULL) {
      dx = (dx / dist) * this.MAX_PULL;
      dy = (dy / dist) * this.MAX_PULL;
    }

    this.pullPos = {
      x: this.SLING_X + dx,
      y: this.SLING_Y + dy,
    };

    soundManager.playStretch(dist / this.MAX_PULL);
    this.computeTrajectoryDots();
  }

  public releasePull() {
    if (!this.isPulling || !this.currentChickenType) return;
    this.isPulling = false;

    const dx = this.SLING_X - this.pullPos.x;
    const dy = this.SLING_Y - this.pullPos.y;
    const pullDist = Math.hypot(dx, dy);

    // If released too close to center, cancel shot
    if (pullDist < 12) {
      this.pullPos = { x: this.SLING_X, y: this.SLING_Y };
      this.trajectoryDots = [];
      return;
    }

    // Launch Chicken
    this.launchChicken(dx, dy, pullDist);
  }

  private launchChicken(dx: number, dy: number, pullDist: number) {
    this.canLaunch = false;
    this.chickenInFlight = true;
    this.chickenAbilityUsed = false;
    this.launchTime = Date.now();
    this.lastFlightTrails = [];

    // Bigger, impactful bird sizes for prominent visibility
    const radius =
      this.currentChickenType === 'blues'
        ? 34
        : this.currentChickenType === 'bomb'
        ? 54
        : this.currentChickenType === 'matilda'
        ? 48
        : this.currentChickenType === 'chuck'
        ? 44
        : 46;

    const density =
      this.currentChickenType === 'bomb'
        ? 0.0055
        : this.currentChickenType === 'matilda'
        ? 0.0035
        : this.currentChickenType === 'red'
        ? 0.0032
        : this.currentChickenType === 'chuck'
        ? 0.0028
        : 0.0024;

    const chickenBody = Matter.Bodies.circle(this.pullPos.x, this.pullPos.y, radius, {
      friction: 0.4,
      restitution: 0.35,
      density,
      label: `chicken_${this.currentChickenType}_${Date.now()}`,
    });

    const speedMultiplier = 0.22;
    const vx = dx * speedMultiplier;
    const vy = dy * speedMultiplier;

    Matter.World.add(this.world, chickenBody);
    Matter.Body.setVelocity(chickenBody, { x: vx, y: vy });

    this.activeChickenBody = chickenBody;
    soundManager.playLaunch();

    // Schedule turn settle check
    this.scheduleSettleCheck(4500);
  }

  // Tap anywhere in flight to trigger special bird abilities
  public triggerAbility() {
    if (!this.chickenInFlight || this.chickenAbilityUsed || !this.activeChickenBody || !this.currentChickenType) return;

    this.chickenAbilityUsed = true;
    const vel = this.activeChickenBody.velocity;
    const pos = this.activeChickenBody.position;

    switch (this.currentChickenType) {
      case 'chuck': {
        // Speed boost dash
        soundManager.playSpeedBoost();
        Matter.Body.setVelocity(this.activeChickenBody, {
          x: vel.x * 2.3,
          y: vel.y * 1.4 - 2,
        });
        this.spawnImpactParticles(pos.x, pos.y, '#f59e0b', 14, 'spark');
        break;
      }
      case 'blues': {
        // The Blues triple split
        soundManager.playSplit();
        const curAngle = Math.atan2(vel.y, vel.x);
        const speed = Math.hypot(vel.x, vel.y);

        // Bird 2 (angled up 18 deg)
        const angleUp = curAngle - 0.28;
        const b2 = Matter.Bodies.circle(pos.x, pos.y - 24, 26, {
          friction: 0.3,
          density: 0.0024,
          label: `chicken_blues_split_1`,
        });
        Matter.World.add(this.world, b2);
        Matter.Body.setVelocity(b2, {
          x: Math.cos(angleUp) * speed,
          y: Math.sin(angleUp) * speed,
        });
        this.extraChickenBodies.push(b2);

        // Bird 3 (angled down 18 deg)
        const angleDown = curAngle + 0.28;
        const b3 = Matter.Bodies.circle(pos.x, pos.y + 24, 26, {
          friction: 0.3,
          density: 0.0024,
          label: `chicken_blues_split_2`,
        });
        Matter.World.add(this.world, b3);
        Matter.Body.setVelocity(b3, {
          x: Math.cos(angleDown) * speed,
          y: Math.sin(angleDown) * speed,
        });
        this.extraChickenBodies.push(b3);

        this.spawnImpactParticles(pos.x, pos.y, '#38bdf8', 12, 'feather');
        break;
      }
      case 'bomb': {
        // Instant shockwave detonation
        this.detonateBombChicken();
        break;
      }
      case 'matilda': {
        // Drop high explosive egg bomb downwards
        soundManager.playExplosion(false);
        // Matilda rockets upward
        Matter.Body.setVelocity(this.activeChickenBody, {
          x: vel.x * 0.8,
          y: -12,
        });

        // Egg projectile falling straight down
        const egg = Matter.Bodies.circle(pos.x, pos.y + 24, 24, {
          density: 0.008,
          friction: 0.8,
          label: `matilda_egg`,
        });
        Matter.World.add(this.world, egg);
        Matter.Body.setVelocity(egg, { x: vel.x * 0.2, y: 16 });
        this.extraChickenBodies.push(egg);

        this.spawnImpactParticles(pos.x, pos.y, '#ffffff', 10, 'smoke');
        break;
      }
      case 'red':
      default: {
        // Red battle cry
        soundManager.playBirdVoice();
        this.spawnImpactParticles(pos.x, pos.y, '#ef4444', 6, 'feather');
        break;
      }
    }
  }

  private detonateBombChicken() {
    if (!this.activeChickenBody) return;
    const pos = this.activeChickenBody.position;
    soundManager.playExplosion(true);

    this.spawnImpactParticles(pos.x, pos.y, '#ff4400', 20, 'spark');
    this.spawnImpactParticles(pos.x, pos.y, '#1f2937', 15, 'smoke');

    // Blast impulse
    const blastRadius = 240;
    const blastForce = 0.06;
    const allBodies = Matter.Composite.allBodies(this.world);

    allBodies.forEach((body) => {
      if (body.isStatic || body === this.activeChickenBody) return;
      const dx = body.position.x - pos.x;
      const dy = body.position.y - pos.y;
      const dist = Math.hypot(dx, dy);

      if (dist < blastRadius && dist > 1) {
        const falloff = 1 - dist / blastRadius;
        const fx = (dx / dist) * blastForce * falloff;
        const fy = (dy / dist) * blastForce * falloff - 0.02;

        Matter.Body.applyForce(body, body.position, { x: fx, y: fy });

        // Damage pigs
        this.pigBodies.forEach((pig, id) => {
          if (pig.body === body) {
            pig.config.health -= Math.round(180 * falloff);
            if (pig.config.health <= 0) this.popSandeep(id, pig);
          }
        });

        // Damage blocks
        this.blockBodies.forEach((block, id) => {
          if (block.body === body) {
            block.health -= Math.round(140 * falloff);
            if (block.health <= 0) this.destroyBlock(id, block);
          }
        });
      }
    });

    Matter.World.remove(this.world, this.activeChickenBody);
    this.activeChickenBody = null;
    this.scheduleSettleCheck(1500);
  }

  private computeTrajectoryDots() {
    this.trajectoryDots = [];
    const dx = this.SLING_X - this.pullPos.x;
    const dy = this.SLING_Y - this.pullPos.y;
    const speedMultiplier = 0.22;
    let vx = dx * speedMultiplier;
    let vy = dy * speedMultiplier;

    let simX = this.pullPos.x;
    let simY = this.pullPos.y;
    const gravity = 0.38;

    for (let step = 0; step < 26; step++) {
      simX += vx * 1.5;
      simY += vy * 1.5;
      vy += gravity * 1.5;

      if (simY > 520) break;

      this.trajectoryDots.push({
        x: simX,
        y: simY,
        alpha: Math.max(0.15, 1 - step / 28),
      });
    }
  }

  // Turn settle check
  private scheduleSettleCheck(delayMs: number) {
    if (this.settleTimer) {
      window.clearTimeout(this.settleTimer);
    }
    this.settleTimer = window.setTimeout(() => {
      this.checkTurnSettled();
    }, delayMs);
  }

  private checkTurnSettled() {
    if (!this.chickenInFlight) return;

    // Check if chicken or fortress is still moving fast
    let isMovingFast = false;
    if (this.activeChickenBody) {
      const speed = Math.hypot(this.activeChickenBody.velocity.x, this.activeChickenBody.velocity.y);
      if (speed > 0.8 && Date.now() - this.launchTime < 8000) {
        isMovingFast = true;
      }
    }

    if (isMovingFast) {
      this.scheduleSettleCheck(800);
      return;
    }

    // Turn is settled!
    this.chickenInFlight = false;
    if (this.activeChickenBody) {
      // Disappear puff
      this.spawnImpactParticles(this.activeChickenBody.position.x, this.activeChickenBody.position.y, '#ffffff', 6, 'smoke');
      Matter.World.remove(this.world, this.activeChickenBody);
      this.activeChickenBody = null;
    }
    this.extraChickenBodies.forEach((b) => Matter.World.remove(this.world, b));
    this.extraChickenBodies = [];

    // Check win/loss
    if (this.pigBodies.size === 0) {
      this.finishLevelVictory();
    } else if (this.chickensQueue.length === 0) {
      // No more chickens and pigs are still alive
      this.callbacks.onLevelFailed(this.currentScore);
      soundManager.playDefeat();
    } else {
      // Load next chicken
      setTimeout(() => {
        this.loadNextChicken();
      }, 700);
    }
  }

  private checkLevelOutcome() {
    if (this.pigBodies.size === 0) {
      this.finishLevelVictory();
    } else {
      this.callbacks.onLevelFailed(this.currentScore);
      soundManager.playDefeat();
    }
  }

  private finishLevelVictory() {
    // Bonus 5,000 points per unused chicken
    const unusedChickens = this.chickensQueue.length;
    const bonus = unusedChickens * 5000;
    this.currentScore += bonus;
    this.callbacks.onScoreUpdate(this.currentScore);

    // Calculate stars
    const targets = this.currentLevel?.starScores || [20000, 35000, 50000];
    let stars = 1;
    if (this.currentScore >= targets[2]) stars = 3;
    else if (this.currentScore >= targets[1]) stars = 2;

    soundManager.playVictory();
    this.callbacks.onLevelComplete(stars, this.currentScore, unusedChickens);
  }

  // Particle Generation
  private spawnImpactParticles(
    x: number,
    y: number,
    color: string,
    count: number,
    shape: 'square' | 'circle' | 'feather' | 'smoke' | 'spark' = 'square'
  ) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: shape === 'smoke' ? 12 + Math.random() * 12 : 3 + Math.random() * 5,
        color,
        alpha: 1,
        decay: 0.02 + Math.random() * 0.03,
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.2,
        shape,
      });
    }
  }

  // Update Game Loop
  public update(dt: number) {
    Matter.Engine.update(this.engine, 1000 / 60);

    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.shape === 'smoke' ? -0.05 : 0.15; // Smoke rises, debris falls
      p.rotation += p.vRot;
      p.alpha -= p.decay;
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Update Floating Texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy;
      ft.life++;
      ft.opacity = 1 - ft.life / ft.maxLife;
      if (ft.life >= ft.maxLife) {
        this.floatingTexts.splice(i, 1);
      }
    }

    // Update Clouds
    this.clouds.forEach((c) => {
      c.x += c.speed;
      if (c.x > 3200) c.x = -600;
    });

    // Trail recording for active chicken
    if (this.activeChickenBody && this.chickenInFlight) {
      const pos = this.activeChickenBody.position;
      if (this.lastFlightTrails.length === 0 || Math.hypot(pos.x - this.lastFlightTrails[this.lastFlightTrails.length - 1].x, pos.y - this.lastFlightTrails[this.lastFlightTrails.length - 1].y) > 20) {
        this.lastFlightTrails.push({ x: pos.x, y: pos.y });
      }

      // Smooth camera follow
      this.targetCameraX = Math.max(0, Math.min(pos.x - 380, 800));
      this.targetCameraZoom = pos.x > 500 ? 0.88 : 1.0;
    } else if (this.isPulling) {
      // While pulling slingshot, always center back on slingshot
      this.targetCameraX = 0;
      this.targetCameraZoom = 1.0;
    }

    // Camera Lerp
    this.cameraX += (this.targetCameraX - this.cameraX) * 0.08;
    this.cameraZoom += (this.targetCameraZoom - this.cameraZoom) * 0.08;
  }

  // Manual Landscape Camera Panning & Scrolling
  public panCamera(deltaX: number) {
    if (this.chickenInFlight || this.isPulling) return;
    this.targetCameraX = Math.max(0, Math.min(850, this.targetCameraX + deltaX));
    this.cameraX = this.targetCameraX; // Direct 1:1 finger tracking for zero lag
  }

  public resetCameraToSling() {
    this.targetCameraX = 0;
    this.targetCameraZoom = 1.0;
  }

  public toggleCameraPan() {
    if (this.chickenInFlight || this.isPulling) return;
    if (this.targetCameraX > 250) {
      this.targetCameraX = 0;
    } else {
      this.targetCameraX = 650;
    }
  }

  public isCameraAtFortress(): boolean {
    return this.targetCameraX > 250;
  }

  // Main Render Frame
  public render() {
    const { ctx, canvas } = this;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    ctx.save();
    // Camera Transform
    ctx.scale(this.cameraZoom, this.cameraZoom);
    ctx.translate(-this.cameraX, 0);

    // 1. SKY & CLOUDS
    this.drawSkyAndScenery(w, h);

    // 2. PREVIOUS FLIGHT TRAILS (Authentic Angry Birds dotted trail)
    this.drawFlightTrails();

    // 3. TRAJECTORY PREDICTION (When pulling slingshot)
    this.drawTrajectory();

    // 4. BACK SLINGSHOT BAND
    this.drawSlingshotBack();

    // 5. CHICKEN ON SLINGSHOT (If pulling or waiting)
    this.drawSlingshotChicken();

    // 6. FRONT SLINGSHOT FORK & FRONT BAND
    this.drawSlingshotFront();

    // 7. CHICKENS QUEUE WAITING ON THE GROUND
    this.drawChickenQueue();

    // 8. DESTRUCTIBLE BLOCKS
    this.drawBlocks();

    // 9. SANDEEP PIGS
    this.drawPigs();

    // 10. ACTIVE FLYING CHICKEN & EXTRAS
    this.drawActiveChickens();

    // 11. PARTICLES & EXPLOSIONS
    this.drawParticles();

    // 12. FLOATING SCORE POPUPS
    this.drawFloatingTexts();

    ctx.restore();
  }

  // Draw Scenery (Sky, Mountains, Rolling Hills, Textured Ground)
  private drawSkyAndScenery(w: number, h: number) {
    const ctx = this.ctx;
    const left = -1000;
    const right = 3400;
    const span = right - left;

    // Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 520);
    skyGrad.addColorStop(0, '#56ccf2');
    skyGrad.addColorStop(0.6, '#a8e6cf');
    skyGrad.addColorStop(1, '#dcedc1');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(left, 0, span, 520);

    // Fluffy cartoon clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    this.clouds.forEach((c) => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.size * 0.45, 0, Math.PI * 2);
      ctx.arc(c.x + c.size * 0.35, c.y - c.size * 0.15, c.size * 0.55, 0, Math.PI * 2);
      ctx.arc(c.x + c.size * 0.75, c.y, c.size * 0.42, 0, Math.PI * 2);
      ctx.fill();
    });

    // Distant soft blue mountains
    ctx.fillStyle = '#81c784';
    ctx.beginPath();
    ctx.moveTo(left, 520);
    for (let mx = left; mx <= right; mx += 340) {
      ctx.lineTo(mx + 170, 340 + (Math.abs(mx) % 680 === 0 ? -30 : 20));
      ctx.lineTo(mx + 340, 520);
    }
    ctx.closePath();
    ctx.fill();

    // Rolling green hills
    ctx.fillStyle = '#66bb6a';
    ctx.beginPath();
    ctx.moveTo(left, 520);
    for (let hx = left; hx <= right; hx += 400) {
      ctx.bezierCurveTo(hx + 100, 430, hx + 300, 440, hx + 400, 520);
    }
    ctx.closePath();
    ctx.fill();

    // Lush Grassy Ground
    const groundGrad = ctx.createLinearGradient(0, 520, 0, h + 200);
    groundGrad.addColorStop(0, '#558b2f');
    groundGrad.addColorStop(0.08, '#689f38');
    groundGrad.addColorStop(0.18, '#8d6e63');
    groundGrad.addColorStop(1, '#5d4037');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(left, 520, span, h + 200 - 520);

    // Grassy border line on top
    ctx.fillStyle = '#7cb342';
    ctx.fillRect(left, 520, span, 8);
  }

  // Flight Trails (Dotted trajectory line left behind)
  private drawFlightTrails() {
    if (this.lastFlightTrails.length < 2) return;
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    this.lastFlightTrails.forEach((pt) => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // Trajectory Prediction Dots
  private drawTrajectory() {
    if (!this.isPulling || this.trajectoryDots.length === 0) return;
    const ctx = this.ctx;
    this.trajectoryDots.forEach((dot) => {
      ctx.fillStyle = `rgba(255, 255, 255, ${dot.alpha})`;
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // Slingshot Back Band
  private drawSlingshotBack() {
    const ctx = this.ctx;
    const forkLeftX = this.SLING_X - 22;
    const forkY = this.SLING_Y - 36;

    if (this.isPulling) {
      ctx.strokeStyle = '#3e2723';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(forkLeftX, forkY);
      ctx.lineTo(this.pullPos.x, this.pullPos.y);
      ctx.stroke();
    }
  }

  // Chicken on Slingshot
  private drawSlingshotChicken() {
    if (!this.currentChickenType || this.chickenInFlight) return;
    const ctx = this.ctx;
    const r =
      this.currentChickenType === 'blues'
        ? 34
        : this.currentChickenType === 'bomb'
        ? 54
        : this.currentChickenType === 'matilda'
        ? 48
        : this.currentChickenType === 'chuck'
        ? 44
        : 46;

    const angle = this.isPulling ? Math.atan2(this.SLING_Y - this.pullPos.y, this.SLING_X - this.pullPos.x) : 0;

    CharacterRenderer.drawChicken(ctx, this.currentChickenType, this.pullPos.x, this.pullPos.y, r, angle, false);

    // Leather pouch around bird
    if (this.isPulling) {
      ctx.fillStyle = '#4e342e';
      ctx.beginPath();
      ctx.arc(this.pullPos.x - 10, this.pullPos.y, r * 1.02, Math.PI * 0.5, Math.PI * 1.5);
      ctx.fill();
    }
  }

  // Slingshot Front Fork & Front Band
  private drawSlingshotFront() {
    const ctx = this.ctx;
    const sx = this.SLING_X;
    const sy = this.SLING_Y;

    // Front rubber band
    if (this.isPulling) {
      const forkRightX = sx + 22;
      const forkY = sy - 36;
      ctx.strokeStyle = '#2d1810';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(forkRightX, forkY);
      ctx.lineTo(this.pullPos.x, this.pullPos.y);
      ctx.stroke();
    }

    // Wooden Slingshot Post & Branches
    ctx.fillStyle = '#8d5b28';
    ctx.strokeStyle = '#5a3814';
    ctx.lineWidth = 3;

    // Main column
    ctx.beginPath();
    ctx.roundRect(sx - 14, sy - 10, 28, 135, 7);
    ctx.fill();
    ctx.stroke();

    // Left branch
    ctx.beginPath();
    ctx.moveTo(sx - 12, sy);
    ctx.lineTo(sx - 28, sy - 40);
    ctx.lineTo(sx - 14, sy - 40);
    ctx.lineTo(sx, sy - 5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right branch
    ctx.beginPath();
    ctx.moveTo(sx + 12, sy);
    ctx.lineTo(sx + 28, sy - 40);
    ctx.lineTo(sx + 14, sy - 40);
    ctx.lineTo(sx, sy - 5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Wood grain detail
    ctx.strokeStyle = '#6d431c';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sx - 5, sy + 15);
    ctx.lineTo(sx + 5, sy + 70);
    ctx.stroke();
  }

  // Draw Remaining Chickens waiting in line on the ground
  private drawChickenQueue() {
    const ctx = this.ctx;
    const startX = this.SLING_X - 60;
    const groundY = 516;

    this.chickensQueue.forEach((type, idx) => {
      const qx = startX - idx * 58;
      const r = type === 'blues' ? 26 : type === 'bomb' ? 40 : type === 'matilda' ? 36 : type === 'chuck' ? 32 : 34;
      CharacterRenderer.drawChicken(ctx, type, qx, groundY - r, r, 0, false);
    });
  }

  // Draw Blocks
  private drawBlocks() {
    const ctx = this.ctx;
    this.blockBodies.forEach((block) => {
      const pos = block.body.position;
      const angle = block.body.angle;
      const healthRatio = block.health / block.maxHealth;

      CharacterRenderer.drawBlock(
        ctx,
        block.config.material,
        pos.x,
        pos.y,
        block.config.width,
        block.config.height,
        angle,
        healthRatio,
        block.config.isCircle
      );
    });
  }

  // Draw Sandeep Pigs
  private drawPigs() {
    const ctx = this.ctx;

    // Determine nearest flying chicken or pull pos for eye-tracking & panic
    let lookTargetX = this.SLING_X;
    let lookTargetY = this.SLING_Y;
    let isChickenFlyingNear = false;

    if (this.activeChickenBody) {
      lookTargetX = this.activeChickenBody.position.x;
      lookTargetY = this.activeChickenBody.position.y;
    } else if (this.isPulling) {
      lookTargetX = this.pullPos.x;
      lookTargetY = this.pullPos.y;
    }

    this.pigBodies.forEach((pig) => {
      const pos = pig.body.position;
      const angle = pig.body.angle;
      const healthRatio = pig.config.health / pig.config.maxHealth;

      const distToChicken = Math.hypot(pos.x - lookTargetX, pos.y - lookTargetY);
      isChickenFlyingNear = this.chickenInFlight && distToChicken < 340;

      CharacterRenderer.drawSandeep(ctx, pos.x, pos.y, pig.config.radius, angle, {
        type: pig.config.type,
        healthRatio,
        isPanicked: isChickenFlyingNear,
        eyeTargetX: lookTargetX,
        eyeTargetY: lookTargetY,
      });
    });
  }

  // Draw In-Flight Active Chickens
  private drawActiveChickens() {
    const ctx = this.ctx;

    // Extra chickens (The Blues split or Matilda egg)
    this.extraChickenBodies.forEach((body) => {
      const pos = body.position;
      const angle = body.angle;
      if (body.label.includes('egg')) {
        // Matilda egg bomb (bigger and clearer)
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(angle);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(0, 0, 13, 18, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#94a3b8';
        ctx.stroke();
        ctx.restore();
      } else {
        // Split blue bird
        CharacterRenderer.drawChicken(ctx, 'blues', pos.x, pos.y, 18, angle, false);
      }
    });

    // Primary active chicken
    if (this.activeChickenBody && this.currentChickenType) {
      const pos = this.activeChickenBody.position;
      const angle = this.activeChickenBody.angle;
      const r =
        this.currentChickenType === 'blues'
          ? 22
          : this.currentChickenType === 'bomb'
          ? 38
          : this.currentChickenType === 'matilda'
          ? 34
          : this.currentChickenType === 'chuck'
          ? 30
          : 32;

      CharacterRenderer.drawChicken(ctx, this.currentChickenType, pos.x, pos.y, r, angle, this.chickenAbilityUsed);
    }
  }

  // Draw Particles
  private drawParticles() {
    const ctx = this.ctx;
    this.particles.forEach((p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;

      if (p.shape === 'circle' || p.shape === 'smoke') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'feather') {
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.4, p.size, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      }
      ctx.restore();
    });
  }

  // Draw Floating Score Texts
  private drawFloatingTexts() {
    const ctx = this.ctx;
    this.floatingTexts.forEach((ft) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.opacity);
      ctx.fillStyle = ft.color;
      ctx.font = `bold ${ft.size}px 'Luckiest Guy', Impact, sans-serif`;
      ctx.textAlign = 'center';
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = '#000000';
      ctx.strokeText(ft.text, ft.x, ft.y);
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    });
  }

  // Destroy / Cleanup
  public destroy() {
    if (this.runner) {
      cancelAnimationFrame(this.runner);
      this.runner = null;
    }
    if (this.settleTimer) {
      clearTimeout(this.settleTimer);
      this.settleTimer = null;
    }
    Matter.World.clear(this.world, false);
    Matter.Engine.clear(this.engine);
  }
}
