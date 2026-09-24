import { BlockConfig, ChickenType, LevelData, SandeepConfig } from '../types/game';

export class LevelGenerator {
  // Ground reference in game coordinate space
  public static readonly GROUND_Y = 520;
  public static readonly FORTRESS_START_X = 620;

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
        // LEVEL 1: The Wooden Shack (Tutorial) - Spacious for 2x Sandeep pig
        return {
          id: 1,
          name: "Sandeep's Wood Shack",
          subtitle: "Pull back the slingshot and let it fly!",
          chickens: ['red', 'red', 'red'],
          blocks: [
            // Left pillar
            { id: 'b1', x: fx + 50, y: gy - 65, width: 24, height: 130, material: 'wood' },
            // Right pillar
            { id: 'b2', x: fx + 210, y: gy - 65, width: 24, height: 130, material: 'wood' },
            // Cross beam sitting flush on pillars
            { id: 'b3', x: fx + 130, y: gy - 140, width: 190, height: 20, material: 'wood' },
            // Top roof block
            { id: 'b4', x: fx + 130, y: gy - 165, width: 80, height: 26, material: 'wood' },
          ],
          pigs: [
            // 2x size pig (radius 50 = diameter 100px)
            { id: 'p1', x: fx + 130, y: gy - 50, type: 'standard', radius: 50, health: 70, maxHealth: 70 },
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
            { id: 'b1', x: fx + 40, y: gy - 65, width: 22, height: 130, material: 'ice' },
            { id: 'b2', x: fx + 180, y: gy - 65, width: 22, height: 130, material: 'ice' },
            { id: 'b3', x: fx + 110, y: gy - 140, width: 165, height: 20, material: 'ice' },
            // Tower 2 (Wood)
            { id: 'b4', x: fx + 230, y: gy - 65, width: 22, height: 130, material: 'wood' },
            { id: 'b5', x: fx + 370, y: gy - 65, width: 22, height: 130, material: 'wood' },
            { id: 'b6', x: fx + 300, y: gy - 140, width: 165, height: 20, material: 'wood' },
          ],
          pigs: [
            // 2x size pigs
            { id: 'p1', x: fx + 110, y: gy - 48, type: 'standard', radius: 48, health: 70, maxHealth: 70 },
            { id: 'p2', x: fx + 300, y: gy - 48, type: 'standard', radius: 48, health: 70, maxHealth: 70 },
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
            { id: 'b1', x: fx + 50, y: gy - 65, width: 30, height: 130, material: 'stone' },
            { id: 'b2', x: fx + 210, y: gy - 65, width: 30, height: 130, material: 'stone' },
            { id: 'b3', x: fx + 130, y: gy - 140, width: 195, height: 24, material: 'stone' },
            // Upper wood deck
            { id: 'b4', x: fx + 80, y: gy - 195, width: 22, height: 90, material: 'wood' },
            { id: 'b5', x: fx + 180, y: gy - 195, width: 22, height: 90, material: 'wood' },
            { id: 'b6', x: fx + 130, y: gy - 250, width: 130, height: 20, material: 'wood' },
          ],
          pigs: [
            // 2x Helmet Pig (radius 52)
            { id: 'p1', x: fx + 130, y: gy - 52, type: 'helmet', radius: 52, health: 120, maxHealth: 120 },
            // 2x Small Pig (radius 38)
            { id: 'p2', x: fx + 130, y: gy - 188, type: 'small', radius: 38, health: 50, maxHealth: 50 },
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
            // Outer stone pillars
            { id: 'b1', x: fx + 40, y: gy - 65, width: 26, height: 130, material: 'stone' },
            { id: 'b2', x: fx + 220, y: gy - 65, width: 26, height: 130, material: 'stone' },
            // TNT foundation resting on ground between pillars
            { id: 'b3', x: fx + 130, y: gy - 24, width: 48, height: 48, material: 'tnt' },
            // Middle stone pillar standing on TNT
            { id: 'b4', x: fx + 130, y: gy - 88, width: 24, height: 80, material: 'stone' },
            // Wooden roof deck
            { id: 'b5', x: fx + 130, y: gy - 140, width: 215, height: 20, material: 'wood' },
            // Top wooden frame
            { id: 'b6', x: fx + 80, y: gy - 195, width: 20, height: 90, material: 'wood' },
            { id: 'b7', x: fx + 180, y: gy - 195, width: 20, height: 90, material: 'wood' },
            { id: 'b8', x: fx + 130, y: gy - 248, width: 130, height: 20, material: 'wood' },
            // Side wooden shed
            { id: 'b9', x: fx + 310, y: gy - 60, width: 24, height: 120, material: 'wood' },
            { id: 'b10', x: fx + 265, y: gy - 130, width: 110, height: 20, material: 'wood' },
          ],
          pigs: [
            { id: 'p1', x: fx + 130, y: gy - 190, type: 'standard', radius: 48, health: 70, maxHealth: 70 },
            { id: 'p2', x: fx + 265, y: gy - 48, type: 'standard', radius: 48, health: 70, maxHealth: 70 },
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
            { id: 'b1', x: fx + 40, y: gy - 60, width: 24, height: 120, material: 'wood' },
            { id: 'b2', x: fx + 200, y: gy - 60, width: 24, height: 120, material: 'wood' },
            { id: 'b3', x: fx + 120, y: gy - 130, width: 195, height: 20, material: 'stone' },
            // Floor 2
            { id: 'b4', x: fx + 45, y: gy - 195, width: 22, height: 110, material: 'ice' },
            { id: 'b5', x: fx + 195, y: gy - 195, width: 22, height: 110, material: 'ice' },
            { id: 'b6', x: fx + 120, y: gy - 260, width: 185, height: 20, material: 'wood' },
            // Floor 3
            { id: 'b7', x: fx + 50, y: gy - 315, width: 20, height: 90, material: 'wood' },
            { id: 'b8', x: fx + 190, y: gy - 315, width: 20, height: 90, material: 'wood' },
            { id: 'b9', x: fx + 120, y: gy - 370, width: 170, height: 20, material: 'wood' },
          ],
          pigs: [
            { id: 'p1', x: fx + 120, y: gy - 48, type: 'standard', radius: 48, health: 70, maxHealth: 70 },
            { id: 'p2', x: fx + 120, y: gy - 188, type: 'standard', radius: 46, health: 70, maxHealth: 70 },
            { id: 'p3', x: fx + 120, y: gy - 318, type: 'helmet', radius: 48, health: 120, maxHealth: 120 },
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
            { id: 'b1', x: fx + 40, y: gy - 75, width: 30, height: 150, material: 'stone' },
            { id: 'b2', x: fx + 140, y: gy - 25, width: 50, height: 50, material: 'tnt' },
            { id: 'b3', x: fx + 240, y: gy - 75, width: 30, height: 150, material: 'stone' },
            { id: 'b4', x: fx + 140, y: gy - 160, width: 240, height: 22, material: 'ice' },
            { id: 'b5', x: fx + 140, y: gy - 190, width: 150, height: 22, material: 'wood' },
          ],
          pigs: [
            { id: 'p1', x: fx + 90, y: gy - 50, type: 'helmet', radius: 50, health: 120, maxHealth: 120 },
            { id: 'p2', x: fx + 190, y: gy - 50, type: 'helmet', radius: 50, health: 120, maxHealth: 120 },
            { id: 'p3', x: fx + 140, y: gy - 220, type: 'standard', radius: 46, health: 70, maxHealth: 70 },
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
            { id: 'b1', x: fx + 30, y: gy - 65, width: 22, height: 130, material: 'ice' },
            { id: 'b2', x: fx + 170, y: gy - 65, width: 22, height: 130, material: 'ice' },
            { id: 'b3', x: fx + 100, y: gy - 140, width: 170, height: 20, material: 'ice' },
            // Right fort
            { id: 'b4', x: fx + 240, y: gy - 65, width: 26, height: 130, material: 'stone' },
            { id: 'b5', x: fx + 380, y: gy - 65, width: 26, height: 130, material: 'stone' },
            { id: 'b6', x: fx + 310, y: gy - 140, width: 170, height: 24, material: 'stone' },
          ],
          pigs: [
            { id: 'p1', x: fx + 100, y: gy - 48, type: 'standard', radius: 48, health: 70, maxHealth: 70 },
            { id: 'p2', x: fx + 310, y: gy - 52, type: 'helmet', radius: 52, health: 120, maxHealth: 120 },
            { id: 'p3', x: fx + 205, y: gy - 38, type: 'small', radius: 38, health: 50, maxHealth: 50 },
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
            // Bottom tier (3 wide chambers)
            { id: 'b1', x: fx + 30, y: gy - 65, width: 28, height: 130, material: 'stone' },
            { id: 'b2', x: fx + 180, y: gy - 65, width: 28, height: 130, material: 'wood' },
            { id: 'b3', x: fx + 330, y: gy - 65, width: 28, height: 130, material: 'stone' },
            { id: 'b4', x: fx + 180, y: gy - 140, width: 335, height: 24, material: 'stone' },
            // Middle tier
            { id: 'b5', x: fx + 105, y: gy - 200, width: 24, height: 95, material: 'stone' },
            { id: 'b6', x: fx + 255, y: gy - 200, width: 24, height: 95, material: 'stone' },
            { id: 'b7', x: fx + 180, y: gy - 258, width: 185, height: 22, material: 'wood' },
            // Top roof
            { id: 'b8', x: fx + 180, y: gy - 295, width: 45, height: 50, material: 'wood' },
          ],
          pigs: [
            { id: 'p1', x: fx + 105, y: gy - 50, type: 'standard', radius: 50, health: 70, maxHealth: 70 },
            { id: 'p2', x: fx + 255, y: gy - 50, type: 'standard', radius: 50, health: 70, maxHealth: 70 },
            { id: 'p3', x: fx + 180, y: gy - 200, type: 'helmet', radius: 50, health: 120, maxHealth: 120 },
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
            { id: 'b1', x: fx + 40, y: gy - 65, width: 24, height: 130, material: 'wood' },
            { id: 'b2', x: fx + 200, y: gy - 65, width: 24, height: 130, material: 'ice' },
            { id: 'b3', x: fx + 120, y: gy - 140, width: 195, height: 22, material: 'wood' },
            // Stopper wedges for boulder
            { id: 'b4a', x: fx + 75, y: gy - 165, width: 20, height: 25, material: 'wood' },
            { id: 'b4b', x: fx + 165, y: gy - 165, width: 20, height: 25, material: 'wood' },
            // Rolling stone ball on top safely nestled
            { id: 'b4', x: fx + 120, y: gy - 180, width: 65, height: 65, material: 'stone', isCircle: true },
            // Second building
            { id: 'b5', x: fx + 280, y: gy - 25, width: 48, height: 48, material: 'tnt' },
            { id: 'b6', x: fx + 280, y: gy - 85, width: 24, height: 70, material: 'wood' },
            { id: 'b7', x: fx + 380, y: gy - 65, width: 24, height: 130, material: 'wood' },
            { id: 'b8', x: fx + 330, y: gy - 140, width: 130, height: 20, material: 'wood' },
          ],
          pigs: [
            { id: 'p1', x: fx + 120, y: gy - 52, type: 'helmet', radius: 52, health: 120, maxHealth: 120 },
            { id: 'p2', x: fx + 330, y: gy - 48, type: 'standard', radius: 48, health: 70, maxHealth: 70 },
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
            // Stronghold perimeter (3 wide chambers)
            { id: 'b1', x: fx + 30, y: gy - 75, width: 30, height: 150, material: 'stone' },
            { id: 'b2', x: fx + 150, y: gy - 25, width: 50, height: 50, material: 'tnt' },
            { id: 'b3', x: fx + 270, y: gy - 75, width: 30, height: 150, material: 'stone' },
            { id: 'b4', x: fx + 390, y: gy - 75, width: 30, height: 150, material: 'stone' },
            // Floor 1 solid ceiling
            { id: 'b5', x: fx + 210, y: gy - 160, width: 400, height: 24, material: 'stone' },
            // Royal Throne Room (Elevated center)
            { id: 'b6', x: fx + 130, y: gy - 225, width: 24, height: 105, material: 'wood' },
            { id: 'b7', x: fx + 290, y: gy - 225, width: 24, height: 105, material: 'wood' },
            { id: 'b8', x: fx + 210, y: gy - 290, width: 200, height: 24, material: 'stone' },
            // Crown canopy battlements
            { id: 'b9', x: fx + 150, y: gy - 315, width: 26, height: 26, material: 'stone' },
            { id: 'b10', x: fx + 270, y: gy - 315, width: 26, height: 26, material: 'stone' },
          ],
          pigs: [
            // Guards (Helmet pigs, radius 52)
            { id: 'p1', x: fx + 80, y: gy - 52, type: 'helmet', radius: 52, health: 130, maxHealth: 130 },
            { id: 'p2', x: fx + 330, y: gy - 52, type: 'helmet', radius: 52, health: 130, maxHealth: 130 },
            // KING SANDEEP (Majestic 2x size: radius 68 = 136px diameter!)
            { id: 'p3', x: fx + 210, y: gy - 238, type: 'king', radius: 68, health: 260, maxHealth: 260 },
          ],
          starScores: [55000, 80000, 105000],
        };
    }
  }

  // Infinite Procedural Level Generator for Level 11, 12, ... 10,000+!
  // Guaranteed rock-solid physics stability: no collapsing on spawn!
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

    // Scale tier count with level (2 to 3 tiers)
    const tierCount = Math.min(3, 2 + Math.floor((levelNum - 10) / 10));
    // Number of bays/rooms: 2 or 3
    const bays = 2 + (levelNum % 2);
    const pillarsCount = bays + 1; // 3 or 4 pillars
    const materials: ('wood' | 'ice' | 'stone')[] = ['wood', 'ice', 'stone'];

    // Tower spacing: 150-175px (generous room for 2x size pigs)
    const baySpacing = 150 + Math.floor(rnd() * 25);
    const colWidth = 28;
    const beamHeight = 22;

    let currentFloorY = gy;
    let blockIdCounter = 1;
    let pigIdCounter = 1;

    for (let tier = 0; tier < tierCount; tier++) {
      // Column height: 115-135px (ample headspace above 2x pigs)
      const colHeight = 115 + Math.floor(rnd() * 20);
      const tierMat = materials[Math.floor(rnd() * materials.length)];
      const colY = currentFloorY - colHeight / 2;

      // Vertical columns
      for (let c = 0; c < pillarsCount; c++) {
        const colX = fx + c * baySpacing;
        blocks.push({
          id: `pb_${blockIdCounter++}`,
          x: colX,
          y: colY,
          width: colWidth,
          height: colHeight,
          material: tierMat,
        });
      }

      // Horizontal continuous slab resting FLUSH on top of columns
      const totalSpan = (pillarsCount - 1) * baySpacing + colWidth + 30;
      const slabX = fx + ((pillarsCount - 1) * baySpacing) / 2;
      const slabY = currentFloorY - colHeight - beamHeight / 2;
      const beamMat = materials[Math.floor(rnd() * materials.length)];

      blocks.push({
        id: `pb_${blockIdCounter++}`,
        x: slabX,
        y: slabY,
        width: totalSpan,
        height: beamHeight,
        material: beamMat,
      });

      // Place pigs & occasional TNT safely inside the rooms of this tier
      for (let b = 0; b < bays; b++) {
        const roomCenterX = fx + b * baySpacing + baySpacing / 2;

        // Occasional TNT crate on floor beside pig (tier 0 or 1)
        if (tier === 0 && b === 0 && rnd() > 0.6) {
          blocks.push({
            id: `pb_${blockIdCounter++}`,
            x: roomCenterX + 45,
            y: currentFloorY - 24,
            width: 46,
            height: 46,
            material: 'tnt',
          });
        }

        // Determine if pig spawns in this chamber
        if (rnd() > 0.25 || tier === 0 || pigs.length === 0) {
          const isBoss = tier === tierCount - 1 && b === Math.floor(bays / 2) && levelNum % 5 === 0;
          const pigType = isBoss
            ? 'king'
            : rnd() > 0.65
            ? 'helmet'
            : rnd() > 0.3
            ? 'standard'
            : 'small';

          // 2x pig sizes!
          const radius = pigType === 'king' ? 66 : pigType === 'helmet' ? 52 : pigType === 'small' ? 38 : 48;
          const hp = pigType === 'king' ? 240 : pigType === 'helmet' ? 120 : pigType === 'small' ? 50 : 75;

          pigs.push({
            id: `pp_${pigIdCounter++}`,
            x: roomCenterX,
            y: currentFloorY - radius,
            type: pigType,
            radius,
            health: hp,
            maxHealth: hp,
          });
        }
      }

      // Floor for next tier sits directly on top of this beam
      currentFloorY = slabY - beamHeight / 2;
    }

    // Ensure at least 2 pigs exist
    if (pigs.length < 2) {
      pigs.push({
        id: `pp_${pigIdCounter++}`,
        x: fx + baySpacing,
        y: gy - 48,
        type: 'standard',
        radius: 48,
        health: 75,
        maxHealth: 75,
      });
    }

    // Stable Roof Ornament / Battlements on top
    const topSlabX = fx + ((pillarsCount - 1) * baySpacing) / 2;
    const topSlabWidth = (pillarsCount - 1) * baySpacing + colWidth + 30;

    // Left and right battlements
    blocks.push({
      id: `pb_${blockIdCounter++}`,
      x: topSlabX - topSlabWidth / 2 + 18,
      y: currentFloorY - 15,
      width: 28,
      height: 30,
      material: 'stone',
    });
    blocks.push({
      id: `pb_${blockIdCounter++}`,
      x: topSlabX + topSlabWidth / 2 - 18,
      y: currentFloorY - 15,
      width: 28,
      height: 30,
      material: 'stone',
    });

    // Optional center boulder or decorative pediment
    if (rnd() > 0.5) {
      blocks.push({
        id: `pb_${blockIdCounter++}`,
        x: topSlabX,
        y: currentFloorY - 26,
        width: 52,
        height: 52,
        material: 'stone',
        isCircle: true,
      });
      // Side stoppers so the boulder doesn't roll until hit
      blocks.push({
        id: `pb_${blockIdCounter++}`,
        x: topSlabX - 36,
        y: currentFloorY - 14,
        width: 18,
        height: 24,
        material: 'wood',
      });
      blocks.push({
        id: `pb_${blockIdCounter++}`,
        x: topSlabX + 36,
        y: currentFloorY - 14,
        width: 18,
        height: 24,
        material: 'wood',
      });
    }

    // Dynamic chicken roster tailored to the challenge
    const allChickenTypes: ChickenType[] = ['red', 'chuck', 'blues', 'bomb', 'matilda'];
    const chickenCount = Math.min(6, Math.max(3, pigs.length + 1));
    const chickens: ChickenType[] = [];

    // Always start with a versatile bird
    chickens.push('red');
    for (let i = 1; i < chickenCount; i++) {
      const pick = allChickenTypes[Math.floor(rnd() * allChickenTypes.length)];
      chickens.push(pick);
    }

    // Compute star score targets
    const baseScore = blocks.length * 800 + pigs.length * 6000;
    const oneStar = Math.floor(baseScore * 0.6);
    const twoStar = Math.floor(baseScore * 1.05 + (chickens.length - 1) * 7500);
    const threeStar = Math.floor(baseScore * 1.45 + (chickens.length - 1) * 10500);

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
