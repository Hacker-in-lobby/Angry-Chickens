import React, { useState, useEffect, useRef } from 'react';
import { GameView, LevelData, LevelProgress } from './types/game';
import { LevelGenerator } from './game/proceduralGenerator';
import { soundManager } from './audio/soundManager';
import { PhysicsGameEngine } from './game/physicsEngine';
import { StartScreen } from './components/StartScreen';
import { LevelSelector } from './components/LevelSelector';
import { HowToPlayModal } from './components/HowToPlayModal';
import { GameCanvas } from './components/GameCanvas';
import { GameHUD } from './components/GameHUD';
import { VictoryModal } from './components/VictoryModal';
import { GameOverModal } from './components/GameOverModal';
import { PauseModal } from './components/PauseModal';

export default function App() {
  // Navigation & View
  const [view, setView] = useState<GameView>('start');
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);

  // Level & In-Game state
  const [levelNumber, setLevelNumber] = useState<number>(1);
  const [currentLevel, setCurrentLevel] = useState<LevelData>(() => LevelGenerator.getLevel(1));
  const [score, setScore] = useState<number>(0);
  const [pigsRemaining, setPigsRemaining] = useState<number>(1);
  const [totalPigs, setTotalPigs] = useState<number>(1);
  const [chickensRemaining, setChickensRemaining] = useState<number>(3);
  const [totalChickens, setTotalChickens] = useState<number>(3);

  // Modals & Pause
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showVictory, setShowVictory] = useState<boolean>(false);
  const [showGameOver, setShowGameOver] = useState<boolean>(false);
  const [starsEarned, setStarsEarned] = useState<number>(1);
  const [unusedChickens, setUnusedChickens] = useState<number>(0);

  // Persistent Progress (localStorage)
  const engineRef = useRef<PhysicsGameEngine | null>(null);
  const [isCameraAtFortress, setIsCameraAtFortress] = useState<boolean>(false);

  const [progress, setProgress] = useState<LevelProgress>(() => {
    try {
      const savedUnlocked = localStorage.getItem('angry_chickens_unlocked');
      const savedHighScores = localStorage.getItem('angry_chickens_highscores');
      const savedStars = localStorage.getItem('angry_chickens_stars');
      return {
        unlockedLevels: savedUnlocked ? Math.max(1, parseInt(savedUnlocked, 10)) : 1,
        highScores: savedHighScores ? JSON.parse(savedHighScores) : {},
        stars: savedStars ? JSON.parse(savedStars) : {},
        soundEnabled: soundManager.isEnabled(),
      };
    } catch {
      return {
        unlockedLevels: 1,
        highScores: {},
        stars: {},
        soundEnabled: true,
      };
    }
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(progress.soundEnabled);

  // Save progress changes to localStorage
  const updateProgress = (newProgress: LevelProgress) => {
    setProgress(newProgress);
    try {
      localStorage.setItem('angry_chickens_unlocked', String(newProgress.unlockedLevels));
      localStorage.setItem('angry_chickens_highscores', JSON.stringify(newProgress.highScores));
      localStorage.setItem('angry_chickens_stars', JSON.stringify(newProgress.stars));
    } catch {}
  };

  const handleToggleSound = () => {
    const nextVal = soundManager.toggleSound();
    setSoundEnabled(nextVal);
    setProgress((p) => ({ ...p, soundEnabled: nextVal }));
  };

  const startLevel = (lvlNum: number) => {
    setLevelNumber(lvlNum);
    const newLvl = LevelGenerator.getLevel(lvlNum);
    setCurrentLevel(newLvl);
    setScore(0);
    setPigsRemaining(newLvl.pigs.length);
    setTotalPigs(newLvl.pigs.length);
    setChickensRemaining(newLvl.chickens.length);
    setTotalChickens(newLvl.chickens.length);

    setIsPaused(false);
    setShowVictory(false);
    setShowGameOver(false);
    setIsCameraAtFortress(false);
    setView('playing');
  };

  const handleToggleCameraPan = () => {
    if (engineRef.current) {
      engineRef.current.toggleCameraPan();
      setIsCameraAtFortress(engineRef.current.isCameraAtFortress());
    }
  };

  const handleLevelComplete = (stars: number, finalScore: number, unusedBirds: number) => {
    setStarsEarned(stars);
    setUnusedChickens(unusedBirds);

    const prevHigh = progress.highScores[levelNumber] || 0;
    const newHigh = Math.max(prevHigh, finalScore);
    const prevStars = progress.stars[levelNumber] || 0;
    const newStars = Math.max(prevStars, stars);
    const newUnlocked = Math.max(progress.unlockedLevels, levelNumber + 1);

    updateProgress({
      ...progress,
      unlockedLevels: newUnlocked,
      highScores: { ...progress.highScores, [levelNumber]: newHigh },
      stars: { ...progress.stars, [levelNumber]: newStars },
    });

    setShowVictory(true);
  };

  const handleLevelFailed = (finalScore: number) => {
    setShowGameOver(true);
  };

  const handleNextLevel = () => {
    startLevel(levelNumber + 1);
  };

  const handleRestartLevel = () => {
    startLevel(levelNumber);
  };

  const totalStarsCount = Object.values(progress.stars).reduce((a, b) => a + b, 0);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none touch-none">
      {/* 1. START SCREEN */}
      {view === 'start' && (
        <StartScreen
          onPlay={() => startLevel(progress.unlockedLevels)}
          onLevelSelect={() => setView('levelSelect')}
          onHowToPlay={() => setShowHowToPlay(true)}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          totalStars={totalStarsCount}
        />
      )}

      {/* 2. LEVEL SELECTOR SCREEN */}
      {view === 'levelSelect' && (
        <LevelSelector
          progress={progress}
          onSelectLevel={(lvl) => startLevel(lvl)}
          onBack={() => setView('start')}
        />
      )}

      {/* 3. ACTIVE GAME PLAYING */}
      {view === 'playing' && (
        <div className="relative w-full h-full flex items-center justify-center bg-slate-950 overflow-hidden">
          <div
            className="relative flex items-center justify-center select-none touch-none shadow-2xl overflow-hidden"
            style={{
              aspectRatio: '16 / 9',
              width: 'min(100vw, calc(100vh * 16 / 9))',
              height: 'min(100vh, calc(100vw * 9 / 16))',
              maxWidth: '100vw',
              maxHeight: '100vh',
            }}
          >
            <GameCanvas
              level={currentLevel}
              onScoreUpdate={setScore}
              onPigsUpdate={(rem, tot) => {
                setPigsRemaining(rem);
                setTotalPigs(tot);
              }}
              onChickensUpdate={(rem, tot) => {
                setChickensRemaining(rem);
                setTotalChickens(tot);
              }}
              onLevelComplete={handleLevelComplete}
              onLevelFailed={handleLevelFailed}
              isPaused={isPaused || showVictory || showGameOver}
              engineInstanceRef={engineRef}
            />

            <GameHUD
              level={currentLevel}
              score={score}
              highScore={progress.highScores[levelNumber] || 0}
              pigsRemaining={pigsRemaining}
              totalPigs={totalPigs}
              chickensRemaining={chickensRemaining}
              totalChickens={totalChickens}
              soundEnabled={soundEnabled}
              onPause={() => setIsPaused(true)}
              onRestart={handleRestartLevel}
              onToggleSound={handleToggleSound}
              onToggleCameraPan={handleToggleCameraPan}
              isCameraAtFortress={isCameraAtFortress}
            />
          </div>
        </div>
      )}

      {/* MODALS */}
      {/* Pause Modal */}
      {isPaused && (
        <PauseModal
          onResume={() => setIsPaused(false)}
          onRestart={handleRestartLevel}
          onLevelSelect={() => {
            setIsPaused(false);
            setView('levelSelect');
          }}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
        />
      )}

      {/* Victory Modal */}
      {showVictory && (
        <VictoryModal
          levelNumber={levelNumber}
          score={score}
          highScore={progress.highScores[levelNumber] || score}
          starsEarned={starsEarned}
          unusedChickens={unusedChickens}
          onNextLevel={handleNextLevel}
          onRestart={handleRestartLevel}
          onLevelSelect={() => {
            setShowVictory(false);
            setView('levelSelect');
          }}
        />
      )}

      {/* Game Over Modal */}
      {showGameOver && (
        <GameOverModal
          levelNumber={levelNumber}
          score={score}
          onRestart={handleRestartLevel}
          onLevelSelect={() => {
            setShowGameOver(false);
            setView('levelSelect');
          }}
        />
      )}

      {/* How To Play Tutorial Modal */}
      {showHowToPlay && (
        <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
      )}
    </div>
  );
}
