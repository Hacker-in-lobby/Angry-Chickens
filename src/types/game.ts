export type ChickenType = 'red' | 'chuck' | 'blues' | 'bomb' | 'matilda';

export type MaterialType = 'wood' | 'ice' | 'stone' | 'tnt';

export type SandeepType = 'standard' | 'small' | 'helmet' | 'king';

export interface SandeepConfig {
  id: string;
  x: number;
  y: number;
  type: SandeepType;
  radius: number;
  health: number;
  maxHealth: number;
}

export interface BlockConfig {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  material: MaterialType;
  angle?: number;
  isCircle?: boolean;
}

export interface LevelData {
  id: number;
  name: string;
  subtitle?: string;
  chickens: ChickenType[];
  blocks: BlockConfig[];
  pigs: SandeepConfig[];
  starScores: [number, number, number]; // 1, 2, 3 stars
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  size: number;
  opacity: number;
  vy: number;
  life: number;
  maxLife: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  vRot: number;
  shape?: 'square' | 'circle' | 'feather' | 'smoke' | 'spark' | 'shard';
}

export interface GameStats {
  score: number;
  highScore: number;
  pigsRemaining: number;
  totalPigs: number;
  chickensRemaining: number;
  totalChickens: number;
}

export type GameView = 'start' | 'levelSelect' | 'playing' | 'howToPlay';

export interface LevelProgress {
  unlockedLevels: number;
  highScores: Record<number, number>;
  stars: Record<number, number>;
  soundEnabled: boolean;
}
