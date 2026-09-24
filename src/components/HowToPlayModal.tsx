import React from 'react';
import { X, Sparkles, Target, Zap, ShieldAlert } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-amber-100 to-amber-200 rounded-3xl border-4 border-amber-900 shadow-2xl p-6 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-amber-900/30 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-8 h-8 text-amber-700" />
            <h2 className="text-3xl font-black text-amber-950 font-['Luckiest_Guy',cursive]">
              HOW TO PLAY
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full border-2 border-red-800 transition-colors shadow"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto space-y-4 pr-1 text-amber-950">
          {/* Controls section */}
          <div className="bg-white/80 p-4 rounded-2xl border-2 border-amber-900/20 shadow-xs">
            <h3 className="text-xl font-black text-amber-900 mb-2 flex items-center gap-2 font-['Luckiest_Guy',cursive]">
              <Zap className="w-5 h-5 text-amber-600" /> SLINGSHOT CONTROLS
            </h3>
            <p className="text-sm font-semibold mb-2">
              • <strong>Drag & Aim:</strong> Touch or click the chicken in the slingshot, drag backwards to set launch angle and tension power, then release to launch!
            </p>
            <p className="text-sm font-semibold mb-2">
              • <strong>Trajectory Line:</strong> The white dotted arc predicts your flight path. Calibrate your shots against past trail markers!
            </p>
            <p className="text-sm font-semibold">
              • <strong>Special Ability:</strong> Tap or click anywhere on the screen while your chicken is in flight to trigger its power!
            </p>
          </div>

          {/* Chickens section */}
          <div className="bg-white/80 p-4 rounded-2xl border-2 border-amber-900/20 shadow-xs">
            <h3 className="text-xl font-black text-amber-900 mb-3 flex items-center gap-2 font-['Luckiest_Guy',cursive]">
              <Sparkles className="w-5 h-5 text-yellow-500" /> THE ANGRY CHICKEN ROSTER
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="flex items-start gap-2 bg-red-50 p-2 rounded-xl border border-red-200">
                <span className="text-2xl">🐔</span>
                <div>
                  <div className="font-black text-red-700">RED (Cluck)</div>
                  <div className="text-stone-700">Balanced warrior. Great all-around impact force.</div>
                </div>
              </div>
              <div className="flex items-start gap-2 bg-yellow-50 p-2 rounded-xl border border-yellow-200">
                <span className="text-2xl">🐥</span>
                <div>
                  <div className="font-black text-amber-700">CHUCK (Yellow)</div>
                  <div className="text-stone-700">Tap in flight to trigger Supersonic Boost! Smashes wood!</div>
                </div>
              </div>
              <div className="flex items-start gap-2 bg-sky-50 p-2 rounded-xl border border-sky-200">
                <span className="text-2xl">🐦</span>
                <div>
                  <div className="font-black text-sky-700">THE BLUES (Cyan)</div>
                  <div className="text-stone-700">Tap in flight to split into 3 birds! Shatters glass & ice!</div>
                </div>
              </div>
              <div className="flex items-start gap-2 bg-neutral-100 p-2 rounded-xl border border-neutral-300">
                <span className="text-2xl">💣</span>
                <div>
                  <div className="font-black text-neutral-800">BOMB (Black)</div>
                  <div className="text-stone-700">Heavy explosive! Tap or wait for impact to blow stone & TNT!</div>
                </div>
              </div>
              <div className="flex items-start gap-2 bg-amber-50 p-2 rounded-xl border border-amber-200 col-span-1 sm:col-span-2">
                <span className="text-2xl">🥚</span>
                <div>
                  <div className="font-black text-pink-700">MATILDA (White)</div>
                  <div className="text-stone-700">Tap in flight to drop a high-explosive egg bomb straight down!</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sandeep Target section */}
          <div className="bg-white/80 p-4 rounded-2xl border-2 border-amber-900/20 shadow-xs">
            <h3 className="text-xl font-black text-emerald-800 mb-2 flex items-center gap-2 font-['Luckiest_Guy',cursive]">
              <ShieldAlert className="w-5 h-5 text-emerald-600" /> TARGET: SANDEEP
            </h3>
            <div className="flex items-center gap-3">
              <img
                src="/assets/1000025505-removebg-preview.png"
                alt="Sandeep"
                className="w-14 h-14 object-contain shrink-0 drop-shadow"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/sandeep.svg';
                }}
              />
              <p className="text-xs sm:text-sm font-semibold text-stone-700">
                Sandeep is fortified in complex towers! Topple the pillars, trigger TNT chain reactions, or hit him directly to defeat him. Clear all Sandeeps before running out of chickens to win 3 stars!
              </p>
            </div>
          </div>
        </div>

        {/* Got it button */}
        <div className="mt-4 pt-2 flex justify-center">
          <button
            onClick={onClose}
            className="w-full sm:w-64 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xl rounded-2xl border-3 border-emerald-900 shadow-lg active:scale-95 transition-all font-['Luckiest_Guy',cursive]"
          >
            LET'S FLING!
          </button>
        </div>
      </div>
    </div>
  );
};
