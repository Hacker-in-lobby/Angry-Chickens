import React, { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Star, Lock, Dices } from 'lucide-react';
import { LevelProgress } from '../types/game';

interface LevelSelectorProps {
  progress: LevelProgress;
  onSelectLevel: (lvl: number) => void;
  onBack: () => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  progress,
  onSelectLevel,
  onBack,
}) => {
  const [page, setPage] = useState(0);
  const levelsPerPage = 15;
  const startLevel = page * levelsPerPage + 1;

  const totalPossibleLevels = Math.max(startLevel + levelsPerPage, progress.unlockedLevels + 5);

  const levels = Array.from({ length: levelsPerPage }, (_, i) => startLevel + i);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 select-none bg-gradient-to-b from-amber-600 via-amber-500 to-amber-700 overflow-y-auto">
      {/* Top Header */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-amber-800 text-yellow-200 font-bold rounded-full border-2 border-amber-950 shadow hover:bg-amber-900 transition-colors font-['Luckiest_Guy',cursive]"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>MENU</span>
        </button>

        <h2 className="text-3xl sm:text-5xl font-black text-yellow-300 drop-shadow-[0_4px_0_rgba(0,0,0,0.6)] font-['Luckiest_Guy',cursive]">
          SELECT LEVEL
        </h2>

        {/* Endless Random Level Button */}
        <button
          onClick={() => {
            const randomLvl = 16 + Math.floor(Math.random() * 50);
            onSelectLevel(randomLvl);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-bold rounded-full border-2 border-emerald-900 shadow hover:bg-emerald-700 transition-all font-['Luckiest_Guy',cursive] text-sm"
          title="Play a random procedural fortress!"
        >
          <Dices className="w-5 h-5" />
          <span className="hidden sm:inline">RANDOM</span>
        </button>
      </div>

      {/* Level Grid */}
      <div className="w-full max-w-4xl mx-auto my-auto py-6">
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-5">
          {levels.map((lvl) => {
            const isUnlocked = lvl <= progress.unlockedLevels;
            const stars = progress.stars[lvl] || 0;
            const highScore = progress.highScores[lvl] || 0;

            return (
              <button
                key={lvl}
                disabled={!isUnlocked}
                onClick={() => onSelectLevel(lvl)}
                className={`relative flex flex-col items-center justify-between p-3 rounded-2xl border-4 transition-all aspect-square ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-yellow-300 to-amber-500 border-amber-800 text-amber-950 shadow-[0_6px_0_rgba(120,53,15,1)] hover:scale-105 active:translate-y-1 active:shadow-none cursor-pointer'
                    : 'bg-stone-700/80 border-stone-800 text-stone-500 shadow-inner cursor-not-allowed opacity-75'
                }`}
              >
                {/* Level Number or Lock */}
                <div className="flex-1 flex items-center justify-center">
                  {isUnlocked ? (
                    <span className="text-3xl sm:text-4xl font-black font-['Luckiest_Guy',cursive]">
                      {lvl}
                    </span>
                  ) : (
                    <Lock className="w-8 h-8 text-stone-500" />
                  )}
                </div>

                {/* Stars container */}
                {isUnlocked && (
                  <div className="flex items-center gap-0.5 mb-1">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          s <= stars
                            ? 'text-yellow-100 fill-yellow-100 drop-shadow'
                            : 'text-amber-800/40 fill-amber-800/40'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* High score badge if played */}
                {highScore > 0 && (
                  <div className="text-[10px] sm:text-xs font-black text-amber-950 bg-yellow-200/80 px-2 py-0.5 rounded-full">
                    {highScore.toLocaleString()}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-center gap-4">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          className="p-3 bg-amber-800 text-yellow-200 rounded-full border-2 border-amber-950 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-900 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <span className="text-xl font-black text-yellow-200 font-['Luckiest_Guy',cursive]">
          PAGE {page + 1}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          className="p-3 bg-amber-800 text-yellow-200 rounded-full border-2 border-amber-950 hover:bg-amber-900 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
