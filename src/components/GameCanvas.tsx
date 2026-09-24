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
  const activePointerIdRef = useRef<number | null>(null);

  // Logical game resolution (16:9)
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
    if (rect.width === 0 || rect.height === 0) return { x: 0, y: 0 };

    const scaleX = GAME_WIDTH / rect.width;
    const scaleY = GAME_HEIGHT / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    return {
      x: Math.max(0, Math.min(GAME_WIDTH, x)),
      y: Math.max(0, Math.min(GAME_HEIGHT, y)),
    };
  };

  // Unified Pointer handlers (supports both touch in landscape and mouse)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isPaused) return;

    // Prevent default gesture actions on mobile
    e.preventDefault();

    const { x, y } = getCanvasCoords(e.clientX, e.clientY);
    const pulled = engineRef.current?.startPull(x, y);

    if (pulled) {
      isDraggingSlingRef.current = true;
      activePointerIdRef.current = e.pointerId;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
    } else {
      // Tap in flight for special bird ability
      engineRef.current?.triggerAbility();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isPaused || !isDraggingSlingRef.current) return;
    e.preventDefault();
    const { x, y } = getCanvasCoords(e.clientX, e.clientY);
    engineRef.current?.updatePull(x, y);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isPaused || !isDraggingSlingRef.current) return;
    e.preventDefault();
    isDraggingSlingRef.current = false;

    if (activePointerIdRef.current !== null) {
      try {
        e.currentTarget.releasePointerCapture(activePointerIdRef.current);
      } catch {}
      activePointerIdRef.current = null;
    }

    engineRef.current?.releasePull();
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingSlingRef.current) return;
    isDraggingSlingRef.current = false;

    if (activePointerIdRef.current !== null) {
      try {
        e.currentTarget.releasePointerCapture(activePointerIdRef.current);
      } catch {}
      activePointerIdRef.current = null;
    }

    engineRef.current?.releasePull();
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onTouchStart={(e) => {
        // Prevent mobile browser drag / bounce gestures
        if (e.cancelable) e.preventDefault();
      }}
      onTouchMove={(e) => {
        if (e.cancelable) e.preventDefault();
      }}
      className="w-full h-full block cursor-crosshair touch-none select-none"
      style={{
        touchAction: 'none',
      }}
    />
  );
};
