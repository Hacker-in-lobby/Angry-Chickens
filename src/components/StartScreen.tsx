import React from 'react';
import { Play, Grid, HelpCircle, Volume2, VolumeX, Trophy } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

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
    <div className="relative w-full h-full flex flex-col items-center justify-between p-6 select-none bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-400 overflow-hidden">
      {/* Background clouds & hills */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-12 left-10 w-48 h-48 bg-white rounded-full blur-xl animate-pulse" />
        <div className="absolute top-20 right-16 w-64 h-64 bg-white rounded-full blur-2xl" />
        <div className="absolute bottom-0 w-full h-36 bg-gradient-to-t from-emerald-600 to-transparent" />
      </div>

      {/* Top Header bar */}
      <div className="relative z-10 w-full max-w-4xl flex items-center justify-between">
        <div className="flex items-center gap-2 bg-amber-500/90 text-white font-black px-4 py-2 rounded-full border-3 border-amber-700 shadow-lg text-sm sm:text-base">
          <Trophy className="w-5 h-5 text-yellow-200 fill-yellow-200 animate-bounce" />
          <span>STARS: {totalStars}</span>
        </div>

        <button
          onClick={onToggleSound}
          className="p-3 bg-amber-500 text-white rounded-full border-3 border-amber-700 shadow-lg hover:scale-105 active:scale-95 transition-transform"
          title={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
        >
          {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6 text-red-200" />}
        </button>
      </div>

      {/* Logo & Hero Artwork */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto">
        <div className="relative mb-4">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-wider text-yellow-400 drop-shadow-[0_8px_0_rgba(180,83,9,1)] stroke-black uppercase font-['Luckiest_Guy',cursive] transform -rotate-2">
            Angry Chickens
          </h1>
          <div className="flex items-center justify-center gap-3 mt-1 sm:mt-2">
            <span className="text-2xl sm:text-4xl font-extrabold text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.8)] font-['Luckiest_Guy',cursive]">
              VS
            </span>
            <span className="text-4xl sm:text-6xl font-black text-emerald-400 drop-shadow-[0_6px_0_rgba(6,78,59,1)] font-['Luckiest_Guy',cursive] transform rotate-1">
              SANDEEP
            </span>
          </div>
        </div>

        {/* Visual Showcase: Angry Chickens on left facing Sandeep on right */}
        <div className="relative w-72 sm:w-96 h-36 sm:h-44 my-2 flex items-center justify-between px-4">
          {/* Angry Chickens stack */}
          <div className="flex items-end -space-x-4 animate-bounce">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-red-600 to-red-400 border-3 border-red-900 shadow-xl flex items-center justify-center relative">
              <span className="text-2xl">🐔</span>
              <div className="absolute -top-2 left-1 text-xs font-black text-white bg-red-800 px-1 rounded">RED</div>
            </div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-yellow-500 to-amber-300 border-3 border-amber-800 shadow-xl flex items-center justify-center relative -mb-2">
              <span className="text-3xl">🐥</span>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-sky-500 to-cyan-300 border-3 border-cyan-800 shadow-xl flex items-center justify-center">
              <span className="text-xl">🐦</span>
            </div>
          </div>

          <div className="text-2xl sm:text-3xl font-black text-white drop-shadow font-['Luckiest_Guy',cursive]">
            ⚔️
          </div>

          {/* Sandeep Pig */}
          <div className="relative flex flex-col items-center">
            <div className="relative flex items-center justify-center">
              <img
                src="/assets/1000025505-removebg-preview.png"
                alt="Sandeep"
                className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] animate-pulse"
                onError={(e) => {
                  // Fallback to svg if png fails
                  (e.target as HTMLImageElement).src = `${import.meta.env.BASE_URL}assets/sandeep.svg`;
                }}
              />
              <div className="absolute -bottom-2 bg-emerald-900 text-yellow-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-yellow-400 shadow">
                SANDEEP
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm sm:text-base font-bold text-amber-950 bg-white/70 px-4 py-1.5 rounded-full shadow-sm max-w-md">
          Catapult angry chickens to topple fortresses and defeat Sandeep!
        </p>
      </div>

      {/* Main Action Buttons */}
      <div className="relative z-10 w-full max-w-md flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center mb-4">
        <button
          onClick={onPlay}
          className="w-full sm:flex-1 py-4 px-6 bg-gradient-to-b from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-black text-2xl tracking-wide rounded-2xl border-4 border-emerald-900 shadow-[0_6px_0_rgba(6,78,59,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 font-['Luckiest_Guy',cursive]"
        >
          <Play className="w-8 h-8 fill-white" />
          <span>PLAY NOW</span>
        </button>

        <button
          onClick={onLevelSelect}
          className="w-full sm:w-auto py-4 px-5 bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black text-xl rounded-2xl border-4 border-amber-800 shadow-[0_6px_0_rgba(146,64,14,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 font-['Luckiest_Guy',cursive]"
          title="Select Level"
        >
          <Grid className="w-6 h-6" />
          <span>LEVELS</span>
        </button>

        <button
          onClick={onHowToPlay}
          className="w-full sm:w-auto py-4 px-5 bg-gradient-to-b from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-400 text-sky-950 font-black text-xl rounded-2xl border-4 border-sky-800 shadow-[0_6px_0_rgba(7,89,133,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 font-['Luckiest_Guy',cursive]"
          title="How to Play"
        >
          <HelpCircle className="w-6 h-6" />
          <span>TUTORIAL</span>
        </button>
      </div>

      {/* Footer credits */}
      <div className="relative z-10 text-xs font-semibold text-emerald-950/70 text-center">
        OG Physics Arcade Experience • Endless Autogenerated Levels • Mobile Touch Supported
      </div>
    </div>
  );
};
