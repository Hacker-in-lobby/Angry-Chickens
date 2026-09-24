import React from 'react';
import { Play, RotateCcw, Grid, Volume2, VolumeX } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onLevelSelect: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onLevelSelect,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-amber-400 to-amber-500 rounded-3xl border-4 border-amber-900 shadow-2xl p-6 text-center overflow-hidden flex flex-col items-center">
        <h2 className="text-4xl font-black text-amber-950 drop-shadow-[0_2px_0_rgba(255,255,255,0.6)] font-['Luckiest_Guy',cursive] mb-6">
          GAME PAUSED
        </h2>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={onResume}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xl rounded-2xl border-3 border-emerald-900 shadow-[0_4px_0_rgba(6,78,59,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 font-['Luckiest_Guy',cursive]"
          >
            <Play className="w-6 h-6 fill-white" />
            <span>RESUME</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full py-3.5 bg-sky-500 hover:bg-sky-600 text-white font-black text-xl rounded-2xl border-3 border-sky-900 shadow-[0_4px_0_rgba(7,89,133,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 font-['Luckiest_Guy',cursive]"
          >
            <RotateCcw className="w-6 h-6 stroke-[3]" />
            <span>RESTART</span>
          </button>

          <button
            onClick={onLevelSelect}
            className="w-full py-3.5 bg-amber-700 hover:bg-amber-800 text-yellow-100 font-black text-xl rounded-2xl border-3 border-amber-950 shadow-[0_4px_0_rgba(69,26,3,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 font-['Luckiest_Guy',cursive]"
          >
            <Grid className="w-6 h-6" />
            <span>LEVEL SELECT</span>
          </button>

          <button
            onClick={onToggleSound}
            className="w-full py-3 bg-stone-700 hover:bg-stone-800 text-white font-black rounded-2xl border-3 border-stone-900 shadow-[0_4px_0_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 font-['Luckiest_Guy',cursive] text-lg"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-5 h-5" />
                <span>SOUND: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-5 h-5 text-red-300" />
                <span>SOUND: OFF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
