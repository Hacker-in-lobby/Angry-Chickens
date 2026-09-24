import React, { useEffect, useRef } from 'react';
import { PhysicsGameEngine } from '../game/physicsEngine';
import { LevelData } from '../types/game';

interface GameCanvasProps {
  level: LevelData;
  onScoreUpdate: (score: number) => void;
  onPigsUpdate: (remaining: number, total: number) => void;
  onChickensUpdate: (remaining: number, total: number) => void;
  onLevelComplete: (stars: number, score: number, unusedChickens: number) => void;
  onLevelFailed: (score: number) => void;
  onFloatingText?: (text: string, x: number, y: number, color?: string) => void;
  isPaused: boolean;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  level,
  onScoreUpdate,
  onPigsUpdate,
  onChickensUpdate,
  onLevelComplete,
  onLevelFailed,
  onFloatingText,
  isPaused,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<PhysicsGameEngine | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isDraggingSlingRef = useRef<boolean>(false);

  // Logical game resolution
  const GAME_WIDTH = 1200;
  const GAME_HEIGHT = 675;

  // Initialize engine & load level
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;

    const engine = new PhysicsGameEngine(canvas, {
      onScoreUpdate,
      onPigsUpdate,
      onChickensUpdate,
      onLevelComplete,
      onLevelFailed,
      onFloatingText: onFloatingText || (() => {}),
    });

    engineRef.current = engine;
    engine.loadLevel(level);

    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (!isPaused) {
        engine.update(dt);
        engine.render();
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      engine.destroy();
      engineRef.current = null;
    };
  }, [level]);

  // Convert client viewport coordinates to Game Canvas space
  const getCanvasCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = GAME_WIDTH / rect.width;
    const scaleY = GAME_HEIGHT / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPaused) return;
    const { x, y } = getCanvasCoords(e.clientX, e.clientY);
    const pulled = engineRef.current?.startPull(x, y);
    if (pulled) {
      isDraggingSlingRef.current = true;
    } else {
      // Tap in flight for special ability
      engineRef.current?.triggerAbility();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPaused || !isDraggingSlingRef.current) return;
    const { x, y } = getCanvasCoords(e.clientX, e.clientY);
    engineRef.current?.updatePull(x, y);
  };

  const handleMouseUp = () => {
    if (isPaused || !isDraggingSlingRef.current) return;
    isDraggingSlingRef.current = false;
    engineRef.current?.releasePull();
  };

  // Touch handlers for mobile devices
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isPaused || e.touches.length === 0) return;
    const touch = e.touches[0];
    const { x, y } = getCanvasCoords(touch.clientX, touch.clientY);
    const pulled = engineRef.current?.startPull(x, y);
    if (pulled) {
      isDraggingSlingRef.current = true;
    } else {
      // Tap in flight for ability
      engineRef.current?.triggerAbility();
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isPaused || !isDraggingSlingRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const { x, y } = getCanvasCoords(touch.clientX, touch.clientY);
    engineRef.current?.updatePull(x, y);
  };

  const handleTouchEnd = () => {
    if (isPaused || !isDraggingSlingRef.current) return;
    isDraggingSlingRef.current = false;
    engineRef.current?.releasePull();
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-slate-950 overflow-hidden select-none touch-none">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className="w-full h-full object-contain cursor-crosshair touch-none"
        style={{
          aspectRatio: '16/9',
          maxHeight: '100vh',
          maxWidth: '100vw',
        }}
      />
    </div>
  );
};
