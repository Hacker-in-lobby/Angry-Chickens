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
  // Engineered with architectural stability: sturdy footers, independent bay lintels,
  // and modular multi-tower designs so a single attack never causes a domino collapse.
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
    let blockIdCounter = 1;
    let pigIdCounter = 1;

    // 4 Distinct Architectural Archetypes
    const archetype = levelNum % 4;

    if (archetype === 0) {
      // ARCHETYPE 0: Twin Fortresses (Two separate towers with gap in between)
      // Destroying Tower 1 NEVER destroys Tower 2!
      const towerWidth = 150;
      const towerGap = 90;
      const colWidth = 34;
      const beamHeight = 26;

      for (let t = 0; t < 2; t++) {
        const tfx = fx + t * (towerWidth + towerGap);
        const mat = t === 0 ? 'wood' : 'stone';
        const colHeight = 120;

        // Ground stone footers
        blocks.push({
          id: `pb_${blockIdCounter++}`,
          x: tfx,
          y: gy - 18,
          width: 44,
          height: 36,
          material: 'stone',
        });
        blocks.push({
          id: `pb_${blockIdCounter++}`,
          x: tfx + towerWidth,
          y: gy - 18,
          width: 44,
          height: 36,
          material: 'stone',
        });

        // Vertical columns resting on footers
        blocks.push({
          id: `pb_${blockIdCounter++}`,
          x: tfx,
          y: gy - 36 - colHeight / 2,
          width: colWidth,
          height: colHeight,
          material: mat,
        });
        blocks.push({
          id: `pb_${blockIdCounter++}`,
          x: tfx + towerWidth,
          y: gy - 36 - colHeight / 2,
          width: colWidth,
          height: colHeight,
          material: mat,
        });

        // Independent Lintel Beam for this tower
        const lintelY = gy - 36 - colHeight - beamHeight / 2;
        blocks.push({
          id: `pb_${blockIdCounter++}`,
          x: tfx + towerWidth / 2,
          y: lintelY,
          width: towerWidth + colWidth + 16,
          height: beamHeight,
          material: mat,
        });

        // Tower pig inside ground room
        const pigType = t === 0 ? 'standard' : rnd() > 0.5 ? 'helmet' : 'standard';
        const radius = pigType === 'helmet' ? 52 : 48;
        const hp = pigType === 'helmet' ? 120 : 75;
        pigs.push({
          id: `pp_${pigIdCounter++}`,
          x: tfx + towerWidth / 2,
          y: gy - radius,
          type: pigType,
          radius,
          health: hp,
          maxHealth: hp,
        });

        // Second floor on top of Tower 2 or occasionally Tower 1
        if (t === 1 || rnd() > 0.5) {
          const topColHeight = 90;
          const topColWidth = 28;
          const topFloorY = lintelY - beamHeight / 2;

          blocks.push({
            id: `pb_${blockIdCounter++}`,
            x: tfx + 20,
            y: topFloorY - topColHeight / 2,
            width: topColWidth,
            height: topColHeight,
            material: 'wood',
          });
          blocks.push({
            id: `pb_${blockIdCounter++}`,
            x: tfx + towerWidth - 20,
            y: topFloorY - topColHeight / 2,
            width: topColWidth,
            height: topColHeight,
            material: 'wood',
          });
          blocks.push({
            id: `pb_${blockIdCounter++}`,
            x: tfx + towerWidth / 2,
            y: topFloorY - topColHeight - 12,
            width: towerWidth - 10,
            height: 22,
            material: 'wood',
          });

          // Top balcony pig
          pigs.push({
            id: `pp_${pigIdCounter++}`,
            x: tfx + towerWidth / 2,
            y: topFloorY - 38,
            type: 'small',
            radius: 38,
            health: 50,
            maxHealth: 50,
          });
        }
      }
    } else if (archetype === 1) {
      // ARCHETYPE 1: Step Pyramid Bastion (Wide, inherently stable ground floor with independent bay beams)
      const baySpacing = 160;
      const colWidth = 36;
      const beamHeight = 24;
      const colHeight = 120;

      // 3 Ground Bays (4 pillars)
      const pillarsCount = 4;

      // 1. Stone footers for each pillar
      for (let c = 0; c < pillarsCount; c++) {
        const colX = fx + c * baySpacing;
        blocks.push({
          id: `pb_${blockIdCounter++}`,
          x: colX,
          y: gy - 18,
          width: 46,
          height: 36,
          material: 'stone',
        });
      }

      // 2. Pillars standing on footers
      for (let c = 0; c < pillarsCount; c++) {
        const colX = fx + c * baySpacing;
        blocks.push({
          id: `pb_${blockIdCounter++}`,
          x: colX,
          y: gy - 36 - colHeight / 2,
          width: colWidth,
          height: colHeight,
          material: c === 0 || c === 3 ? 'stone' : 'wood',
        });
      }

      // 3. INDEPENDENT lintels per bay (Each bay has its own beam, so destroying one bay leaves others intact!)
      const ceilingY = gy - 36 - colHeight - beamHeight / 2;
      for (let b = 0; b < 3; b++) {
        const bayCenterX = fx + b * baySpacing + baySpacing / 2;
        blocks.push({
          id: `pb_${blockIdCounter++}`,
          x: bayCenterX,
          y: ceilingY,
          width: baySpacing + colWidth - 4,
          height: beamHeight,
          material: 'wood',
        });

        // Pigs in room 0 and room 2
        if (b === 0 || b === 2) {
          const pType = b === 0 ? 'standard' : 'helmet';
          const r = pType === 'helmet' ? 52 : 48;
          pigs.push({
            id: `pp_${pigIdCounter++}`,
            x: bayCenterX,
            y: gy - r,
            type: pType,
            radius: r,
            health: pType === 'helmet' ? 120 : 75,
            maxHealth: pType === 'helmet' ? 120 : 75,
          });
        }
      }

      // 4. Center Upper Room (Floor 2)
      const f2FloorY = ceilingY - beamHeight / 2;
      const f2ColHeight = 95;
      const f2LeftX = fx + baySpacing;
      const f2RightX = fx + 2 * baySpacing;

      blocks.push({
        id: `pb_${blockIdCounter++}`,
        x: f2LeftX,
        y: f2FloorY - f2ColHeight / 2,
        width: 30,
        height: f2ColHeight,
        material: 'wood',
      });
      blocks.push({
        id: `pb_${blockIdCounter++}`,
        x: f2RightX,
        y: f2FloorY - f2ColHeight / 2,
        width: 30,
        height: f2ColHeight,
        material: 'wood',
      });
      blocks.push({
        id: `pb_${blockIdCounter++}`,
        x: (f2LeftX + f2RightX) / 2,
        y: f2FloorY - f2ColHeight - 12,
        width: baySpacing + 26,
        height: 22,
        material: 'stone',
      });

      // Upper Boss Pig / King
      const isBossLvl = levelNum % 5 === 0;
      const topPigType = isBossLvl ? 'king' : 'helmet';
      const topRadius = isBossLvl ? 66 : 52;
      pigs.push({
        id: `pp_${pigIdCounter++}`,
        x: (f2LeftX + f2RightX) / 2,
        y: f2FloorY - topRadius,
        type: topPigType,
        radius: topRadius,
        health: isBossLvl ? 240 : 120,
        maxHealth: isBossLvl ? 240 : 120,
      });
    } else if (archetype === 2) {
      // ARCHETYPE 2: Reinforced Heavy Stone Bunker with Side Ice Shed
      const bunkerWidth = 200;
      const shedWidth = 140;
      const colHeight = 125;

      // Bunker Footers
      blocks.push({ id: `pb_${blockIdCounter++}`, x: fx, y: gy - 20, width: 48, height: 40, material: 'stone' });
      blocks.push({ id: `pb_${blockIdCounter++}`, x: fx + bunkerWidth, y: gy - 20, width: 48, height: 40, material: 'stone' });

      // Bunker Stone Columns
      blocks.push({ id: `pb_${blockIdCounter++}`, x: fx, y: gy - 40 - colHeight / 2, width: 38, height: colHeight, material: 'stone' });
      blocks.push({ id: `pb_${blockIdCounter++}`, x: fx + bunkerWidth, y: gy - 40 - colHeight / 2, width: 38, height: colHeight, material: 'stone' });

      // Bunker Thick Roof Slab
      const bunkerRoofY = gy - 40 - colHeight - 14;
      blocks.push({ id: `pb_${blockIdCounter++}`, x: fx + bunkerWidth / 2, y: bunkerRoofY, width: bunkerWidth + 50, height: 28, material: 'stone' });

      // Pig inside Stone Bunker
      pigs.push({
        id: `pp_${pigIdCounter++}`,
        x: fx + bunkerWidth / 2,
        y: gy - 52,
        type: 'helmet',
        radius: 52,
        health: 120,
        maxHealth: 120,
      });

      // Side Ice / Glass Greenhouse
      const shedX = fx + bunkerWidth + 40;
      const shedColHeight = 110;
      blocks.push({ id: `pb_${blockIdCounter++}`, x: shedX, y: gy - 16, width: 40, height: 32, material: 'stone' });
      blocks.push({ id: `pb_${blockIdCounter++}`, x: shedX + shedWidth, y: gy - 16, width: 40, height: 32, material: 'stone' });
      blocks.push({ id: `pb_${blockIdCounter++}`, x: shedX, y: gy - 32 - shedColHeight / 2, width: 26, height: shedColHeight, material: 'ice' });
      blocks.push({ id: `pb_${blockIdCounter++}`, x: shedX + shedWidth, y: gy - 32 - shedColHeight / 2, width: 26, height: shedColHeight, material: 'ice' });
      blocks.push({ id: `pb_${blockIdCounter++}`, x: shedX + shedWidth / 2, y: gy - 32 - shedColHeight - 11, width: shedWidth + 34, height: 22, material: 'ice' });

      // Pig inside Ice Shed
      pigs.push({
        id: `pp_${pigIdCounter++}`,
        x: shedX + shedWidth / 2,
        y: gy - 48,
        type: 'standard',
        radius: 48,
        health: 75,
        maxHealth: 75,
      });

      // Top Roof Battlement & Small Pig
      blocks.push({ id: `pb_${blockIdCounter++}`, x: fx + 30, y: bunkerRoofY - 22, width: 30, height: 30, material: 'stone' });
      blocks.push({ id: `pb_${blockIdCounter++}`, x: fx + bunkerWidth - 30, y: bunkerRoofY - 22, width: 30, height: 30, material: 'stone' });
      pigs.push({
        id: `pp_${pigIdCounter++}`,
        x: fx + bunkerWidth / 2,
        y: bunkerRoofY - 38,
        type: 'small',
        radius: 38,
        health: 50,
        maxHealth: 50,
      });
    } else {
      // ARCHETYPE 3: Castle Gatehouse & Watchtowers
      // Left Guard Post, Gate Archway, Right Keep
      const baySpacing = 155;
      const colWidth = 36;
      const colHeight = 120;

      // 3 Ground Rooms with separate lintels
      for (let c = 0; c < 4; c++) {
        const colX = fx + c * baySpacing;
        // Foundation Footer
        blocks.push({
          id: `pb_${blockIdCounter++}`,
          x: colX,
          y: gy - 18,
          width: 44,
          height: 36,
          material: 'stone',
        });
        // Column
        blocks.push({
          id: `pb_${blockIdCounter++}`,
          x: colX,
          y: gy - 36 - colHeight / 2,
          width: colWidth,
          height: colHeight,
          material: c === 1 || c === 2 ? 'wood' : 'stone',
        });
      }

      // 3 Independent Bay Lintels
      const beamY = gy - 36 - colHeight - 13;
      for (let b = 0; b < 3; b++) {
        const bX = fx + b * baySpacing + baySpacing / 2;
        blocks.push({
          id: `pb_${blockIdCounter++}`,
          x: bX,
          y: beamY,
          width: baySpacing + colWidth - 2,
          height: 26,
          material: b === 1 ? 'stone' : 'wood',
        });

        // Pigs in room 0 and room 1
        if (b < 2) {
          const isHelmet = b === 1;
          const r = isHelmet ? 52 : 48;
          pigs.push({
            id: `pp_${pigIdCounter++}`,
            x: bX,
            y: gy - r,
            type: isHelmet ? 'helmet' : 'standard',
            radius: r,
            health: isHelmet ? 120 : 75,
            maxHealth: isHelmet ? 120 : 75,
          });
        } else {
          // Room 2 has a TNT crate protected by thick stone
          blocks.push({
            id: `pb_${blockIdCounter++}`,
            x: bX,
            y: gy - 24,
            width: 48,
            height: 48,
            material: 'tnt',
          });
          pigs.push({
            id: `pp_${pigIdCounter++}`,
            x: bX,
            y: gy - 48 - 48,
            type: 'standard',
            radius: 46,
            health: 70,
            maxHealth: 70,
          });
        }
      }

      // Watchtower on Right Keep (b = 2)
      const wtFloorY = beamY - 13;
      const wtColHeight = 90;
      const wtLeftX = fx + 2 * baySpacing + 15;
      const wtRightX = fx + 3 * baySpacing - 15;

      blocks.push({ id: `pb_${blockIdCounter++}`, x: wtLeftX, y: wtFloorY - wtColHeight / 2, width: 28, height: wtColHeight, material: 'wood' });
      blocks.push({ id: `pb_${blockIdCounter++}`, x: wtRightX, y: wtFloorY - wtColHeight / 2, width: 28, height: wtColHeight, material: 'wood' });
      blocks.push({ id: `pb_${blockIdCounter++}`, x: (wtLeftX + wtRightX) / 2, y: wtFloorY - wtColHeight - 11, width: baySpacing - 10, height: 22, material: 'wood' });

      // Sentry pig on tower
      pigs.push({
        id: `pp_${pigIdCounter++}`,
        x: (wtLeftX + wtRightX) / 2,
        y: wtFloorY - 38,
        type: 'small',
        radius: 38,
        health: 50,
        maxHealth: 50,
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
    const baseScore = blocks.length * 600 + pigs.length * 5000;
    const oneStar = Math.floor(baseScore * 0.6);
    const twoStar = Math.floor(baseScore * 0.95 + (chickens.length - 1) * 4500);
    const threeStar = Math.floor(baseScore * 1.35 + (chickens.length - 1) * 7000);

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
