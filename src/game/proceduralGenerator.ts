import { BlockConfig, ChickenType, LevelData, SandeepConfig } from '../types/game';

export class LevelGenerator {
  // Ground reference in game coordinate space
  public static readonly GROUND_Y = 520;
  public static readonly FORTRESS_START_X = 640;

  // Handcrafted starter levels
  public static getLevel(levelNumber: number): LevelData {
    if (levelNumber <= 10) {
      return this.getHandcraftedLevel(levelNumber);
    }
    return this.generateProceduralLevel(levelNumber);
  }

  private static getHandcraftedLevel(num: number): LevelData {
    const gy = this.GROUND_Y;
    const fx = this.FORTRESS_START_X;

    switch (num) {
      case 1:
        // LEVEL 1: The Wooden Shack (Tutorial)
        return {
          id: 1,
          name: "Sandeep's Wood Shack",
          subtitle: "Pull back the slingshot and let it fly!",
          chickens: ['red', 'red', 'red'],
          blocks: [
            // Left pillar
            { id: 'b1', x: fx + 80, y: gy - 50, width: 20, height: 100, material: 'wood' },
            // Right pillar
            { id: 'b2', x: fx + 180, y: gy - 50, width: 20, height: 100, material: 'wood' },
            // Cross beam
            { id: 'b3', x: fx + 130, y: gy - 110, width: 140, height: 20, material: 'wood' },
            // Top roof block
            { id: 'b4', x: fx + 130, y: gy - 130, width: 60, height: 20, material: 'wood' },
          ],
          pigs: [
            { id: 'p1', x: fx + 130, y: gy - 28, type: 'standard', radius: 26, health: 50, maxHealth: 50 },
          ],
          starScores: [15000, 24000, 32000],
        };

      case 2:
        // LEVEL 2: The Glass Towers (Introduces Chuck & Blues)
        return {
          id: 2,
          name: "Glass Citadel",
          subtitle: "Ice shatters easily against speedy chickens!",
          chickens: ['blues', 'chuck', 'red'],
          blocks: [
            // Tower 1 (Ice)
            { id: 'b1', x: fx + 60, y: gy - 60, width: 18, height: 120, material: 'ice' },
            { id: 'b2', x: fx + 120, y: gy - 60, width: 18, height: 120, material: 'ice' },
            { id: 'b3', x: fx + 90, y: gy - 130, width: 90, height: 18, material: 'ice' },
            // Tower 2 (Wood)
            { id: 'b4', x: fx + 180, y: gy - 60, width: 18, height: 120, material: 'wood' },
            { id: 'b5', x: fx + 240, y: gy - 60, width: 18, height: 120, material: 'wood' },
            { id: 'b6', x: fx + 210, y: gy - 130, width: 90, height: 18, material: 'wood' },
          ],
          pigs: [
            { id: 'p1', x: fx + 90, y: gy - 26, type: 'standard', radius: 24, health: 50, maxHealth: 50 },
            { id: 'p2', x: fx + 210, y: gy - 26, type: 'standard', radius: 24, health: 50, maxHealth: 50 },
          ],
          starScores: [20000, 32000, 42000],
        };

      case 3:
        // LEVEL 3: Stone Bunker (Introduces Bomb)
        return {
          id: 3,
          name: "Stone Stronghold",
          subtitle: "Tap Bomb Chicken in flight to trigger shockwaves!",
          chickens: ['bomb', 'chuck', 'red', 'red'],
          blocks: [
            // Heavy stone base
            { id: 'b1', x: fx + 70, y: gy - 50, width: 30, height: 100, material: 'stone' },
            { id: 'b2', x: fx + 190, y: gy - 50, width: 30, height: 100, material: 'stone' },
            { id: 'b3', x: fx + 130, y: gy - 110, width: 160, height: 25, material: 'stone' },
            // Upper wood deck
            { id: 'b4', x: fx + 100, y: gy - 150, width: 20, height: 60, material: 'wood' },
            { id: 'b5', x: fx + 160, y: gy - 150, width: 20, height: 60, material: 'wood' },
            { id: 'b6', x: fx + 130, y: gy - 190, width: 90, height: 20, material: 'wood' },
          ],
          pigs: [
            { id: 'p1', x: fx + 130, y: gy - 28, type: 'helmet', radius: 26, health: 80, maxHealth: 80 },
            { id: 'p2', x: fx + 130, y: gy - 145, type: 'small', radius: 20, health: 40, maxHealth: 40 },
          ],
          starScores: [24000, 38000, 50000],
        };

      case 4:
        // LEVEL 4: TNT Domino (Chain reaction!)
        return {
          id: 4,
          name: "Explosive Warehouse",
          subtitle: "Target the TNT crates to bring the house down!",
          chickens: ['chuck', 'bomb', 'red'],
          blocks: [
            // TNT foundation
            { id: 'b1', x: fx + 80, y: gy - 25, width: 45, height: 45, material: 'tnt' },
            { id: 'b2', x: fx + 180, y: gy - 25, width: 45, height: 45, material: 'tnt' },
            // Middle stone pillar
            { id: 'b3', x: fx + 130, y: gy - 50, width: 25, height: 100, material: 'stone' },
            // Long wooden bridge over TNT
            { id: 'b4', x: fx + 130, y: gy - 95, width: 200, height: 20, material: 'wood' },
            // Top wooden frame
            { id: 'b5', x: fx + 90, y: gy - 140, width: 18, height: 70, material: 'wood' },
            { id: 'b6', x: fx + 170, y: gy - 140, width: 18, height: 70, material: 'wood' },
            { id: 'b7', x: fx + 130, y: gy - 185, width: 110, height: 18, material: 'wood' },
          ],
          pigs: [
            { id: 'p1', x: fx + 130, y: gy - 130, type: 'standard', radius: 26, health: 50, maxHealth: 50 },
            { id: 'p2', x: fx + 220, y: gy - 26, type: 'standard', radius: 24, health: 50, maxHealth: 50 },
          ],
          starScores: [28000, 42000, 56000],
        };

      case 5:
        // LEVEL 5: The High Rise Skyscraper
        return {
          id: 5,
          name: "Sandeep High-Rise",
          subtitle: "Aim for the base columns to trigger total collapse!",
          chickens: ['red', 'chuck', 'bomb', 'blues'],
          blocks: [
            // Floor 1
            { id: 'b1', x: fx + 80, y: gy - 40, width: 20, height: 80, material: 'wood' },
            { id: 'b2', x: fx + 150, y: gy - 40, width: 20, height: 80, material: 'wood' },
            { id: 'b3', x: fx + 115, y: gy - 90, width: 110, height: 18, material: 'stone' },
            // Floor 2
            { id: 'b4', x: fx + 80, y: gy - 135, width: 18, height: 70, material: 'ice' },
            { id: 'b5', x: fx + 150, y: gy - 135, width: 18, height: 70, material: 'ice' },
            { id: 'b6', x: fx + 115, y: gy - 180, width: 110, height: 18, material: 'wood' },
            // Floor 3
            { id: 'b7', x: fx + 80, y: gy - 220, width: 16, height: 60, material: 'wood' },
            { id: 'b8', x: fx + 150, y: gy - 220, width: 16, height: 60, material: 'wood' },
            { id: 'b9', x: fx + 115, y: gy - 260, width: 100, height: 18, material: 'wood' },
          ],
          pigs: [
            { id: 'p1', x: fx + 115, y: gy - 28, type: 'standard', radius: 25, health: 50, maxHealth: 50 },
            { id: 'p2', x: fx + 115, y: gy - 120, type: 'standard', radius: 22, health: 50, maxHealth: 50 },
            { id: 'p3', x: fx + 115, y: gy - 285, type: 'helmet', radius: 24, health: 70, maxHealth: 70 },
          ],
          starScores: [32000, 48000, 62000],
        };

      case 6:
        // LEVEL 6: Introduces Matilda (Egg Bomber)
        return {
          id: 6,
          name: "Bunker Drop",
          subtitle: "Tap Matilda in flight to drop high-explosive eggs!",
          chickens: ['matilda', 'chuck', 'bomb', 'red'],
          blocks: [
            // Deep bunker trench
            { id: 'b1', x: fx + 50, y: gy - 60, width: 30, height: 120, material: 'stone' },
            { id: 'b2', x: fx + 130, y: gy - 20, width: 40, height: 40, material: 'tnt' },
            { id: 'b3', x: fx + 210, y: gy - 60, width: 30, height: 120, material: 'stone' },
            { id: 'b4', x: fx + 130, y: gy - 130, width: 180, height: 20, material: 'ice' },
            { id: 'b5', x: fx + 130, y: gy - 160, width: 120, height: 20, material: 'wood' },
          ],
          pigs: [
            { id: 'p1', x: fx + 90, y: gy - 28, type: 'helmet', radius: 26, health: 80, maxHealth: 80 },
            { id: 'p2', x: fx + 170, y: gy - 28, type: 'helmet', radius: 26, health: 80, maxHealth: 80 },
            { id: 'p3', x: fx + 130, y: gy - 185, type: 'standard', radius: 22, health: 50, maxHealth: 50 },
          ],
          starScores: [35000, 52000, 68000],
        };

      case 7:
        // LEVEL 7: Twin Forts
        return {
          id: 7,
          name: "Twin Fortresses",
          subtitle: "Divide and conquer both Sandeep encampments!",
          chickens: ['chuck', 'blues', 'bomb', 'red'],
          blocks: [
            // Left fort
            { id: 'b1', x: fx + 40, y: gy - 50, width: 20, height: 100, material: 'ice' },
            { id: 'b2', x: fx + 110, y: gy - 50, width: 20, height: 100, material: 'ice' },
            { id: 'b3', x: fx + 75, y: gy - 110, width: 100, height: 20, material: 'ice' },
            // Right fort
            { id: 'b4', x: fx + 200, y: gy - 50, width: 25, height: 100, material: 'stone' },
            { id: 'b5', x: fx + 280, y: gy - 50, width: 25, height: 100, material: 'stone' },
            { id: 'b6', x: fx + 240, y: gy - 110, width: 110, height: 22, material: 'stone' },
          ],
          pigs: [
            { id: 'p1', x: fx + 75, y: gy - 26, type: 'standard', radius: 24, health: 50, maxHealth: 50 },
            { id: 'p2', x: fx + 240, y: gy - 28, type: 'helmet', radius: 26, health: 80, maxHealth: 80 },
            { id: 'p3', x: fx + 160, y: gy - 22, type: 'small', radius: 18, health: 35, maxHealth: 35 },
          ],
          starScores: [38000, 56000, 72000],
        };

      case 8:
        // LEVEL 8: The Great Stone Pyramid
        return {
          id: 8,
          name: "The Pyramid Vault",
          subtitle: "Dense stone requires concentrated heavy bombardment!",
          chickens: ['bomb', 'bomb', 'chuck', 'red'],
          blocks: [
            // Bottom tier
            { id: 'b1', x: fx + 40, y: gy - 35, width: 25, height: 70, material: 'stone' },
            { id: 'b2', x: fx + 120, y: gy - 35, width: 25, height: 70, material: 'wood' },
            { id: 'b3', x: fx + 200, y: gy - 35, width: 25, height: 70, material: 'stone' },
            { id: 'b4', x: fx + 120, y: gy - 80, width: 195, height: 20, material: 'stone' },
            // Middle tier
            { id: 'b5', x: fx + 80, y: gy - 120, width: 20, height: 60, material: 'stone' },
            { id: 'b6', x: fx + 160, y: gy - 120, width: 20, height: 60, material: 'stone' },
            { id: 'b7', x: fx + 120, y: gy - 160, width: 120, height: 20, material: 'wood' },
            // Top roof
            { id: 'b8', x: fx + 120, y: gy - 195, width: 25, height: 50, material: 'wood' },
          ],
          pigs: [
            { id: 'p1', x: fx + 80, y: gy - 26, type: 'standard', radius: 25, health: 50, maxHealth: 50 },
            { id: 'p2', x: fx + 160, y: gy - 26, type: 'standard', radius: 25, health: 50, maxHealth: 50 },
            { id: 'p3', x: fx + 120, y: gy - 110, type: 'helmet', radius: 26, health: 80, maxHealth: 80 },
          ],
          starScores: [42000, 60000, 78000],
        };

      case 9:
        // LEVEL 9: Rolling Danger
        return {
          id: 9,
          name: "Rolling Calamity",
          subtitle: "Dislodge heavy stone boulders to crush defenses below!",
          chickens: ['chuck', 'blues', 'bomb', 'red'],
          blocks: [
            { id: 'b1', x: fx + 60, y: gy - 55, width: 22, height: 110, material: 'wood' },
            { id: 'b2', x: fx + 150, y: gy - 55, width: 22, height: 110, material: 'ice' },
            { id: 'b3', x: fx + 105, y: gy - 120, width: 140, height: 20, material: 'wood' },
            // Rolling stone ball on top
            { id: 'b4', x: fx + 80, y: gy - 155, width: 50, height: 50, material: 'stone', isCircle: true },
            // Second level
            { id: 'b5', x: fx + 210, y: gy - 35, width: 40, height: 40, material: 'tnt' },
            { id: 'b6', x: fx + 210, y: gy - 80, width: 20, height: 50, material: 'wood' },
          ],
          pigs: [
            { id: 'p1', x: fx + 105, y: gy - 28, type: 'helmet', radius: 26, health: 80, maxHealth: 80 },
            { id: 'p2', x: fx + 105, y: gy - 150, type: 'standard', radius: 24, health: 50, maxHealth: 50 },
            { id: 'p3', x: fx + 210, y: gy - 120, type: 'standard', radius: 22, health: 50, maxHealth: 50 },
          ],
          starScores: [45000, 65000, 85000],
        };

      case 10:
      default:
        // LEVEL 10: King Sandeep's Throne
        return {
          id: 10,
          name: "King Sandeep's Citadel",
          subtitle: "Dethrone King Sandeep and his elite royal guard!",
          chickens: ['bomb', 'chuck', 'matilda', 'red', 'blues'],
          blocks: [
            // Stronghold perimeter
            { id: 'b1', x: fx + 40, y: gy - 60, width: 28, height: 120, material: 'stone' },
            { id: 'b2', x: fx + 120, y: gy - 25, width: 45, height: 45, material: 'tnt' },
            { id: 'b3', x: fx + 200, y: gy - 60, width: 28, height: 120, material: 'stone' },
            { id: 'b4', x: fx + 280, y: gy - 60, width: 28, height: 120, material: 'stone' },
            // Floor 1 ceiling
            { id: 'b5', x: fx + 120, y: gy - 130, width: 170, height: 22, material: 'stone' },
            { id: 'b6', x: fx + 240, y: gy - 130, width: 100, height: 22, material: 'wood' },
            // Royal Throne Room
            { id: 'b7', x: fx + 80, y: gy - 180, width: 20, height: 80, material: 'wood' },
            { id: 'b8', x: fx + 160, y: gy - 180, width: 20, height: 80, material: 'wood' },
            { id: 'b9', x: fx + 120, y: gy - 230, width: 120, height: 20, material: 'stone' },
            // Crown canopy
            { id: 'b10', x: fx + 120, y: gy - 260, width: 45, height: 45, material: 'stone', isCircle: true },
          ],
          pigs: [
            { id: 'p1', x: fx + 80, y: gy - 28, type: 'helmet', radius: 26, health: 90, maxHealth: 90 },
            { id: 'p2', x: fx + 240, y: gy - 28, type: 'helmet', radius: 26, health: 90, maxHealth: 90 },
            { id: 'p3', x: fx + 120, y: gy - 165, type: 'king', radius: 34, health: 180, maxHealth: 180 },
          ],
          starScores: [55000, 80000, 105000],
        };
    }
  }

  // Infinite Procedural Level Generator for Level 11, 12, ... 10,000+!
  public static generateProceduralLevel(levelNum: number): LevelData {
    const gy = this.GROUND_Y;
    const fx = this.FORTRESS_START_X;

    // Pseudo-random deterministic seed based on levelNum
    let seed = levelNum * 9301 + 49297;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const blocks: BlockConfig[] = [];
    const pigs: SandeepConfig[] = [];

    // Scale complexity with level
    const tierCount = Math.min(4, 2 + Math.floor((levelNum - 10) / 6));
    const towers = 2 + (levelNum % 2); // 2 or 3 towers
    const materials: ('wood' | 'ice' | 'stone')[] = ['wood', 'ice', 'stone'];

    let currentY = gy;
    let blockIdCounter = 1;
    let pigIdCounter = 1;

    // Tower spacing
    const towerSpacing = 85 + Math.floor(rnd() * 30);
    const towerPillars = towers + 1;

    for (let tier = 0; tier < tierCount; tier++) {
      const colHeight = 70 + Math.floor(rnd() * 40);
      const colWidth = 18 + Math.floor(rnd() * 10);
      const tierMat = materials[Math.floor(rnd() * materials.length)];

      const colY = currentY - colHeight / 2;

      // Vertical columns
      for (let c = 0; c < towerPillars; c++) {
        const colX = fx + c * towerSpacing;

        // Occasional TNT crate at ground level
        if (tier === 0 && c === 1 && rnd() > 0.4) {
          blocks.push({
            id: `pb_${blockIdCounter++}`,
            x: colX,
            y: currentY - 22,
            width: 44,
            height: 44,
            material: 'tnt',
          });
        } else {
          blocks.push({
            id: `pb_${blockIdCounter++}`,
            x: colX,
            y: colY,
            width: colWidth,
            height: colHeight,
            material: tierMat,
          });
        }
      }

      // Horizontal cross beams / ceilings
      const beamY = currentY - colHeight - 10;
      const beamW = towerSpacing + 20;
      const beamMat = materials[Math.floor(rnd() * materials.length)];

      for (let b = 0; b < towerPillars - 1; b++) {
        const beamX = fx + b * towerSpacing + towerSpacing / 2;
        blocks.push({
          id: `pb_${blockIdCounter++}`,
          x: beamX,
          y: beamY,
          width: beamW,
          height: 18,
          material: beamMat,
        });

        // Place a Sandeep pig inside this chamber!
        if (rnd() > 0.3 || tier === 0) {
          const pigType =
            tier === tierCount - 1 && b === Math.floor((towerPillars - 1) / 2) && levelNum % 5 === 0
              ? 'king'
              : rnd() > 0.6
              ? 'helmet'
              : rnd() > 0.3
              ? 'standard'
              : 'small';

          const radius = pigType === 'king' ? 32 : pigType === 'small' ? 20 : 25;
          const hp = pigType === 'king' ? 160 : pigType === 'helmet' ? 85 : 50;

          pigs.push({
            id: `pp_${pigIdCounter++}`,
            x: beamX,
            y: currentY - radius - 2,
            type: pigType,
            radius,
            health: hp,
            maxHealth: hp,
          });
        }
      }

      currentY -= colHeight + 20;
    }

    // Ensure at least 2 pigs exist
    if (pigs.length === 0) {
      pigs.push({
        id: `pp_${pigIdCounter++}`,
        x: fx + towerSpacing,
        y: gy - 26,
        type: 'standard',
        radius: 25,
        health: 50,
        maxHealth: 50,
      });
    }

    // Top roof ornament or boulder
    if (rnd() > 0.5) {
      blocks.push({
        id: `pb_${blockIdCounter++}`,
        x: fx + (towerPillars - 1) * (towerSpacing / 2),
        y: currentY - 24,
        width: 48,
        height: 48,
        material: 'stone',
        isCircle: true,
      });
    }

    // Dynamic chicken roster tailored to the challenge
    const allChickenTypes: ChickenType[] = ['red', 'chuck', 'blues', 'bomb', 'matilda'];
    const chickenCount = Math.min(6, 3 + Math.floor(pigs.length * 0.7));
    const chickens: ChickenType[] = [];

    // Always start with a versatile bird
    chickens.push('red');
    for (let i = 1; i < chickenCount; i++) {
      const pick = allChickenTypes[Math.floor(rnd() * allChickenTypes.length)];
      chickens.push(pick);
    }

    // Compute star score targets
    const baseScore = blocks.length * 750 + pigs.length * 5000;
    const oneStar = Math.floor(baseScore * 0.6);
    const twoStar = Math.floor(baseScore * 1.1 + (chickens.length - 1) * 7000);
    const threeStar = Math.floor(baseScore * 1.5 + (chickens.length - 1) * 10000);

    const levelTitles = [
      'The Sandeep Fortress',
      'Bastion of Sandeep',
      'Emerald Outpost',
      'Sandeep Timberland',
      'Granite Citadel',
      'The High Bunker',
      'Sandeep Stronghold',
      'Fortress of Clucks',
    ];
    const name = `${levelTitles[levelNum % levelTitles.length]} #${levelNum}`;

    return {
      id: levelNum,
      name,
      subtitle: `Autogenerated Physics Arena - ${pigs.length} Sandeeps Defending`,
      chickens,
      blocks,
      pigs,
      starScores: [oneStar, twoStar, threeStar],
    };
  }
}
