import React from 'react';
import { Play, Grid, HelpCircle, Volume2, VolumeX, Trophy } from 'lucide-react';

interface StartScreenProps {
  onPlay: () => void;
  onLevelSelect: () => void;
  onHowToPlay: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  totalStars: number;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onPlay,
  onLevelSelect,
  onHowToPlay,
  soundEnabled,
  onToggleSound,
  totalStars,
}) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-2 sm:p-4 md:p-6 select-none bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-400 overflow-y-auto overflow-x-hidden touch-pan-y">
      {/* Background clouds & hills */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-12 left-10 w-48 h-48 bg-white rounded-full blur-xl animate-pulse" />
        <div className="absolute top-20 right-16 w-64 h-64 bg-white rounded-full blur-2xl" />
        <div className="absolute bottom-0 w-full h-36 bg-gradient-to-t from-emerald-600 to-transparent" />
      </div>

      {/* Top Header bar */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between shrink-0 py-1">
        <div className="flex items-center gap-2 bg-amber-500/90 text-white font-black px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border-2 sm:border-3 border-amber-700 shadow-md text-xs sm:text-sm">
          <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-200 fill-yellow-200 animate-bounce" />
          <span>STARS: {totalStars}</span>
        </div>

        <button
          onClick={onToggleSound}
          className="p-1.5 sm:p-2.5 bg-amber-500 text-white rounded-full border-2 sm:border-3 border-amber-700 shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          title={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-red-200" />}
        </button>
      </div>

      {/* Main Content Area - Split horizontally on landscape & tablet/desktop so Play buttons are ALWAYS visible */}
      <div className="relative z-10 w-full max-w-5xl mx-auto my-auto py-1 sm:py-3 flex flex-col sm:flex-row landscape:flex-row items-center justify-center sm:justify-between landscape:justify-between gap-3 sm:gap-6 landscape:gap-6 min-h-0">
        {/* Left Side: Title & Character Face-off */}
        <div className="flex flex-col items-center text-center sm:text-left landscape:text-left sm:items-start landscape:items-start max-w-md shrink">
          <div className="relative mb-1 sm:mb-2">
            <h1 className="text-3xl sm:text-5xl md:text-6xl landscape:text-3xl lg:landscape:text-5xl font-black tracking-wider text-yellow-400 drop-shadow-[0_4px_0_rgba(180,83,9,1)] stroke-black uppercase font-['Luckiest_Guy',cursive] transform -rotate-1 leading-none">
              Angry Chickens
            </h1>
            <div className="flex items-center justify-center sm:justify-start landscape:justify-start gap-2 mt-0.5 sm:mt-1">
              <span className="text-lg sm:text-2xl landscape:text-lg font-extrabold text-white drop-shadow-[0_3px_0_rgba(0,0,0,0.8)] font-['Luckiest_Guy',cursive]">
                VS
              </span>
              <span className="text-2xl sm:text-4xl landscape:text-2xl lg:landscape:text-4xl font-black text-emerald-400 drop-shadow-[0_4px_0_rgba(6,78,59,1)] font-['Luckiest_Guy',cursive] transform rotate-1">
                SANDEEP
              </span>
            </div>
          </div>

          {/* Visual Showcase: Birds facing Sandeep */}
          <div className="relative w-60 sm:w-72 landscape:w-64 h-16 sm:h-22 landscape:h-18 my-1 flex items-center justify-between px-3 bg-white/30 backdrop-blur-xs rounded-2xl border border-white/40 shadow-inner">
            {/* Birds stack */}
            <div className="flex items-end -space-x-2.5">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-red-600 to-red-400 border-2 border-red-900 shadow-md flex items-center justify-center">
                <span className="text-base sm:text-lg">🐔</span>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-yellow-500 to-amber-300 border-2 border-amber-800 shadow-md flex items-center justify-center -mb-1">
                <span className="text-lg sm:text-xl">🐥</span>
              </div>
              {/* Silver Bird icon badge */}
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-slate-400 to-slate-200 border-2 border-slate-700 shadow-md flex items-center justify-center" title="Silver - Steel Piercer">
                <span className="text-base sm:text-lg">🦅</span>
              </div>
            </div>

            <div className="text-lg sm:text-xl font-black text-amber-950 font-['Luckiest_Guy',cursive]">
              ⚔️
            </div>

            {/* Sandeep Pig */}
            <div className="relative flex flex-col items-center">
              <img
                src={`${import.meta.env.BASE_URL}assets/1000025505-removebg-preview.png`}
                alt="Sandeep"
                className="w-12 h-12 sm:w-16 sm:h-16 landscape:w-12 landscape:h-12 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `${import.meta.env.BASE_URL}assets/sandeep.svg`;
                }}
              />
              <div className="bg-emerald-900 text-yellow-300 text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-full border border-yellow-400 shadow -mt-1">
                SANDEEP
              </div>
            </div>
          </div>

          <p className="text-[11px] sm:text-xs font-bold text-amber-950 bg-white/80 px-3 py-0.5 rounded-full shadow-xs max-w-sm mt-1">
            🏹 Topple sky fortresses & pierce steel with Silver!
          </p>
        </div>

        {/* Right Side: Action Buttons - ALWAYS in primary focus in landscape mode */}
        <div className="w-full max-w-xs sm:max-w-xs landscape:max-w-xs flex flex-col gap-2 sm:gap-2.5 shrink-0">
          <button
            onClick={onPlay}
            className="w-full py-3 sm:py-3.5 landscape:py-3 px-5 bg-gradient-to-b from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-black text-lg sm:text-2xl landscape:text-xl tracking-wide rounded-2xl border-3 sm:border-4 border-emerald-900 shadow-[0_4px_0_rgba(6,78,59,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2.5 font-['Luckiest_Guy',cursive] cursor-pointer hover:scale-[1.02]"
          >
            <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white" />
            <span>PLAY NOW</span>
          </button>

          <div className="flex gap-2 sm:gap-2.5">
            <button
              onClick={onLevelSelect}
              className="flex-1 py-2.5 sm:py-3 landscape:py-2 px-3 bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black text-sm sm:text-base rounded-xl sm:rounded-2xl border-2 sm:border-3 border-amber-800 shadow-[0_3px_0_rgba(146,64,14,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-1.5 font-['Luckiest_Guy',cursive] cursor-pointer"
              title="Select Level"
            >
              <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>LEVELS</span>
            </button>

            <button
              onClick={onHowToPlay}
              className="flex-1 py-2.5 sm:py-3 landscape:py-2 px-3 bg-gradient-to-b from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-400 text-sky-950 font-black text-sm sm:text-base rounded-xl sm:rounded-2xl border-2 sm:border-3 border-sky-800 shadow-[0_3px_0_rgba(7,89,133,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-1.5 font-['Luckiest_Guy',cursive] cursor-pointer"
              title="How to Play"
            >
              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>TUTORIAL</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer credits */}
      <div className="relative z-10 text-[9px] sm:text-xs font-semibold text-emerald-950/70 text-center shrink-0 py-0.5">
        Authentic Physics • Floating Sky Islands • Steel Drill Bird • Virtual Screen Barrier
      </div>
    </div>
  );
};
