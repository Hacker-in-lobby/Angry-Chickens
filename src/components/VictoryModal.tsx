import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Star, RotateCcw, ArrowRight, Grid } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface VictoryModalProps {
  levelNumber: number;
  score: number;
  highScore: number;
  starsEarned: number;
  unusedChickens: number;
  onNextLevel: () => void;
  onRestart: () => void;
  onLevelSelect: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  levelNumber,
  score,
  highScore,
  starsEarned,
  unusedChickens,
  onNextLevel,
  onRestart,
  onLevelSelect,
}) => {
  const [displayedStars, setDisplayedStars] = useState(0);

  useEffect(() => {
    // Confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}

    // Animate stars popping in with audio chimes
    const timer1 = setTimeout(() => {
      if (starsEarned >= 1) {
        setDisplayedStars(1);
        soundManager.playStar(0);
      }
    }, 400);

    const timer2 = setTimeout(() => {
      if (starsEarned >= 2) {
        setDisplayedStars(2);
        soundManager.playStar(1);
      }
    }, 900);

    const timer3 = setTimeout(() => {
      if (starsEarned >= 3) {
        setDisplayedStars(3);
        soundManager.playStar(2);
        try {
          confetti({
            particleCount: 100,
            spread: 100,
            origin: { y: 0.5 },
          });
        } catch {}
      }
    }, 1400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [starsEarned]);

  const isNewRecord = score >= highScore && score > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-md bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-500 rounded-3xl border-4 border-amber-900 shadow-2xl p-6 text-center overflow-hidden flex flex-col items-center animate-in zoom-in-95 duration-200">
        {/* Banner Title */}
        <div className="relative mb-2">
          <h2 className="text-4xl sm:text-5xl font-black text-amber-950 drop-shadow-[0_3px_0_rgba(255,255,255,0.7)] font-['Luckiest_Guy',cursive]">
            LEVEL CLEARED!
          </h2>
          <div className="text-sm font-black text-amber-900 uppercase tracking-widest">
            Level {levelNumber} Complete
          </div>
        </div>

        {/* 3 Stars Container */}
        <div className="flex items-center justify-center gap-3 my-4">
          {[1, 2, 3].map((starIdx) => {
            const isFilled = starIdx <= displayedStars;
            return (
              <div
                key={starIdx}
                className={`transition-all duration-300 transform ${
                  isFilled
                    ? 'scale-110 rotate-0'
                    : 'scale-90 opacity-40 -rotate-12'
                }`}
              >
                <Star
                  className={`w-16 h-16 sm:w-20 sm:h-20 stroke-[2.5] stroke-amber-950 ${
                    isFilled
                      ? 'fill-yellow-300 text-yellow-300 drop-shadow-[0_4px_0_rgba(180,83,9,1)]'
                      : 'fill-stone-600/30 text-stone-600/30'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Score & Breakdown */}
        <div className="w-full bg-amber-900/15 rounded-2xl p-4 border-2 border-amber-900/30 mb-5">
          <div className="text-xs sm:text-sm font-bold text-amber-950 uppercase">
            Total Score
          </div>
          <div className="text-4xl sm:text-5xl font-black text-amber-950 font-['Luckiest_Guy',cursive] tracking-wider my-1">
            {score.toLocaleString()}
          </div>

          {unusedChickens > 0 && (
            <div className="text-xs font-bold text-emerald-900 bg-emerald-200/80 px-2 py-1 rounded-full inline-block mt-1">
              +{unusedChickens * 10000} Chicken Bonus ({unusedChickens} left)
            </div>
          )}

          {isNewRecord && (
            <div className="mt-2 text-xs font-black text-white bg-red-600 px-3 py-1 rounded-full uppercase tracking-wider inline-block animate-pulse shadow">
              ★ NEW HIGH SCORE! ★
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 w-full">
          <button
            onClick={onLevelSelect}
            className="p-4 bg-amber-600 hover:bg-amber-700 text-yellow-100 rounded-2xl border-3 border-amber-950 shadow-[0_4px_0_rgba(120,53,15,1)] active:translate-y-1 active:shadow-none transition-all"
            title="Level Select"
          >
            <Grid className="w-7 h-7" />
          </button>

          <button
            onClick={onRestart}
            className="p-4 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl border-3 border-sky-900 shadow-[0_4px_0_rgba(7,89,133,1)] active:translate-y-1 active:shadow-none transition-all"
            title="Replay Level"
          >
            <RotateCcw className="w-7 h-7" />
          </button>

          <button
            onClick={onNextLevel}
            className="flex-1 py-4 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xl rounded-2xl border-3 border-emerald-950 shadow-[0_4px_0_rgba(6,78,59,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 font-['Luckiest_Guy',cursive]"
          >
            <span>NEXT</span>
            <ArrowRight className="w-6 h-6 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
