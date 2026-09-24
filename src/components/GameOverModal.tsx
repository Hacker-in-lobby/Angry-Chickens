import React from 'react';
import { RotateCcw, Grid } from 'lucide-react';

interface GameOverModalProps {
  levelNumber: number;
  score: number;
  onRestart: () => void;
  onLevelSelect: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  levelNumber,
  score,
  onRestart,
  onLevelSelect,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-md bg-gradient-to-b from-stone-800 via-stone-900 to-black rounded-3xl border-4 border-stone-700 shadow-2xl p-6 text-center overflow-hidden flex flex-col items-center animate-in zoom-in-95 duration-200 text-white">
        {/* Title */}
        <div className="mb-2">
          <h2 className="text-4xl sm:text-5xl font-black text-red-500 drop-shadow-[0_3px_0_rgba(0,0,0,0.8)] font-['Luckiest_Guy',cursive]">
            LEVEL FAILED!
          </h2>
          <div className="text-xs sm:text-sm font-semibold text-stone-400 uppercase tracking-widest mt-1">
            Out of Chickens • Level {levelNumber}
          </div>
        </div>

        {/* Sandeep surviving artwork */}
        <div className="my-5 flex flex-col items-center">
          <div className="relative flex items-center justify-center animate-bounce">
            <img
              src="/assets/1000025505-removebg-preview.png"
              alt="Sandeep surviving"
              className="w-28 h-28 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `${import.meta.env.BASE_URL}assets/sandeep.svg`;
              }}
            />
            <div className="absolute -top-1 -right-2 text-2xl">😏</div>
          </div>
          <p className="text-sm font-black text-lime-400 mt-2 font-['Luckiest_Guy',cursive]">
            "Sandeep survived your attack!"
          </p>
        </div>

        {/* Score */}
        <div className="w-full bg-stone-800/80 rounded-2xl p-3 border border-stone-700 mb-5">
          <div className="text-xs font-bold text-stone-400 uppercase">Score Earned</div>
          <div className="text-3xl font-black text-yellow-400 font-['Luckiest_Guy',cursive]">
            {score.toLocaleString()}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 w-full">
          <button
            onClick={onLevelSelect}
            className="p-4 bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-2xl border-3 border-stone-800 shadow-[0_4px_0_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none transition-all"
            title="Level Select"
          >
            <Grid className="w-7 h-7" />
          </button>

          <button
            onClick={onRestart}
            className="flex-1 py-4 px-6 bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-black text-xl rounded-2xl border-3 border-amber-900 shadow-[0_4px_0_rgba(120,53,15,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 font-['Luckiest_Guy',cursive]"
          >
            <RotateCcw className="w-6 h-6 stroke-[3]" />
            <span>TRY AGAIN</span>
          </button>
        </div>
      </div>
    </div>
  );
};
