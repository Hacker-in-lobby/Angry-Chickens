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
  engineInstanceRef?: React.MutableRefObject<PhysicsGameEngine | null>;
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
  engineInstanceRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<PhysicsGameEngine | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Interaction tracking
  const isDraggingSlingRef = useRef<boolean>(false);
  const isPanningCameraRef = useRef<boolean>(false);
  const lastPointerPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const pointerDownPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
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
    if (engineInstanceRef) {
      engineInstanceRef.current = engine;
    }
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
      if (engineInstanceRef) {
        engineInstanceRef.current = null;
      }
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
    lastPointerPosRef.current = { x: e.clientX, y: e.clientY };
    pointerDownPosRef.current = { x: e.clientX, y: e.clientY };

    const pulled = engineRef.current?.startPull(x, y);

    if (pulled) {
      isDraggingSlingRef.current = true;
      isPanningCameraRef.current = false;
      activePointerIdRef.current = e.pointerId;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
    } else {
      // Touch outside slingshot: initiate landscape scrolling / camera pan!
      isPanningCameraRef.current = true;
      isDraggingSlingRef.current = false;
      activePointerIdRef.current = e.pointerId;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isPaused) return;

    if (isDraggingSlingRef.current) {
      const { x, y } = getCanvasCoords(e.clientX, e.clientY);
      engineRef.current?.updatePull(x, y);
    } else if (isPanningCameraRef.current) {
      // Responsive, fluid landscape camera panning / scrolling
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = rect.width > 0 ? GAME_WIDTH / rect.width : 1;

      const deltaX = (e.clientX - lastPointerPosRef.current.x) * scaleX;
      // Dragging left scrolls camera right into the fortress
      engineRef.current?.panCamera(-deltaX);
      lastPointerPosRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isPaused) return;

    if (isDraggingSlingRef.current) {
      isDraggingSlingRef.current = false;
      engineRef.current?.releasePull();
    } else if (isPanningCameraRef.current) {
      isPanningCameraRef.current = false;

      // Check if it was a stationary tap or quick click (not a drag)
      const dist = Math.hypot(
        e.clientX - pointerDownPosRef.current.x,
        e.clientY - pointerDownPosRef.current.y
      );

      // Short tap: trigger in-flight bird ability!
      if (dist < 12) {
        engineRef.current?.triggerAbility();
      }
    }

    if (activePointerIdRef.current !== null) {
      try {
        e.currentTarget.releasePointerCapture(activePointerIdRef.current);
      } catch {}
      activePointerIdRef.current = null;
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDraggingSlingRef.current) {
      isDraggingSlingRef.current = false;
      engineRef.current?.releasePull();
    }
    isPanningCameraRef.current = false;

    if (activePointerIdRef.current !== null) {
      try {
        e.currentTarget.releasePointerCapture(activePointerIdRef.current);
      } catch {}
      activePointerIdRef.current = null;
    }
  };

  // Support trackpad / mouse wheel horizontal scrolling
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    if (isPaused) return;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    engineRef.current?.panCamera(delta * 0.9);
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onWheel={handleWheel}
      className="w-full h-full block cursor-crosshair touch-none select-none"
      style={{
        touchAction: 'none',
      }}
    />
  );
};
