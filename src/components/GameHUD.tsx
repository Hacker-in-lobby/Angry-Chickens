import React from 'react';
import { Pause, RotateCcw, Volume2, VolumeX, Trophy } from 'lucide-react';
import { LevelData } from '../types/game';

interface GameHUDProps {
  level: LevelData;
  score: number;
  highScore: number;
  pigsRemaining: number;
  totalPigs: number;
  chickensRemaining: number;
  totalChickens: number;
  soundEnabled: boolean;
  onPause: () => void;
  onRestart: () => void;
  onToggleSound: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  level,
  score,
  highScore,
  pigsRemaining,
  totalPigs,
  chickensRemaining,
  totalChickens,
  soundEnabled,
  onPause,
  onRestart,
  onToggleSound,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-4 select-none">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between pointer-events-auto">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPause}
            className="p-2.5 sm:p-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl border-3 border-amber-800 shadow-[0_4px_0_rgba(120,53,15,1)] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            title="Pause Game"
          >
            <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
          </button>

          <button
            onClick={onRestart}
            className="p-2.5 sm:p-3 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl border-3 border-sky-800 shadow-[0_4px_0_rgba(7,89,133,1)] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            title="Restart Level"
          >
            <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </button>

          <button
            onClick={onToggleSound}
            className="p-2.5 sm:p-3 bg-amber-600 hover:bg-amber-700 text-yellow-100 rounded-2xl border-3 border-amber-900 shadow-[0_4px_0_rgba(69,26,3,1)] active:translate-y-1 active:shadow-none transition-all cursor-pointer hidden sm:flex"
            title="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" /> : <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 text-red-200" />}
          </button>
        </div>

        {/* Center: Level Title */}
        <div className="flex flex-col items-center bg-black/40 backdrop-blur-xs px-4 py-1.5 rounded-2xl border-2 border-white/20 text-center shadow-lg">
          <div className="text-[10px] sm:text-xs font-black text-yellow-300 uppercase tracking-wider font-['Luckiest_Guy',cursive]">
            LEVEL {level.id}
          </div>
          <div className="text-xs sm:text-sm font-bold text-white max-w-[140px] sm:max-w-xs truncate">
            {level.name}
          </div>
        </div>

        {/* Right: Score Board & Targets */}
        <div className="flex items-center gap-2">
          {/* Pigs Remaining */}
          <div className="flex items-center gap-1.5 bg-emerald-600/90 text-white font-black px-3 py-1.5 rounded-2xl border-2 border-emerald-800 shadow-md">
            <img
              src="/assets/1000025505-removebg-preview.png"
              alt="Sandeep"
              className="w-6 h-6 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `${import.meta.env.BASE_URL}assets/sandeep.svg`;
              }}
            />
            <span className="text-sm sm:text-base font-['Luckiest_Guy',cursive]">
              {pigsRemaining}/{totalPigs}
            </span>
          </div>

          {/* Current Score */}
          <div className="flex flex-col items-end bg-amber-500/95 text-amber-950 px-3.5 py-1 rounded-2xl border-3 border-amber-800 shadow-[0_3px_0_rgba(120,53,15,1)]">
            <div className="text-[9px] sm:text-[10px] font-black uppercase text-amber-900 tracking-wider">
              SCORE
            </div>
            <div className="text-lg sm:text-2xl font-black font-['Luckiest_Guy',cursive] leading-tight">
              {score.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="w-full flex items-end justify-between pointer-events-none">
        <div className="bg-black/35 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10 text-white text-[11px] sm:text-xs font-semibold shadow">
          🏹 Drag slingshot & release • Tap in flight for abilities!
        </div>

        {highScore > 0 && (
          <div className="bg-black/35 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10 text-yellow-300 text-[11px] sm:text-xs font-bold flex items-center gap-1.5 shadow">
            <Trophy className="w-3.5 h-3.5" />
            <span>BEST: {highScore.toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};
