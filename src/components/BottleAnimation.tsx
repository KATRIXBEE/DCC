'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface BottleAnimationProps {
  totalFrames?: number;
  onProgress?: (progress: number) => void;
  onLoaded?: () => void;
  interactive?: boolean; // allow drag/touch rotate
  showHud?: boolean;
  className?: string;
}

export const BottleAnimation: React.FC<BottleAnimationProps> = ({
  totalFrames = 105,
  onProgress,
  onLoaded,
  interactive = true,
  showHud = true,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const processedFramesRef = useRef<HTMLCanvasElement[]>([]);
  const currentFrameRef = useRef<number>(0);
  const [currentFrameState, setCurrentFrameState] = useState<number>(0);
  const [isImagesLoaded, setIsImagesLoaded] = useState<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const startFrameRef = useRef<number>(0);

  // Render a specific frame index on the canvas
  const renderFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const clampedIndex = Math.max(0, Math.min(frameIndex, totalFrames - 1));
    const processedCanvas = processedFramesRef.current[clampedIndex];
    if (!processedCanvas) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate dimensions to center the cropped bottle
    const srcRatio = processedCanvas.width / processedCanvas.height;
    
    // Scale bottle to occupy ~85% of viewport height
    let drawHeight = height * 0.86;
    let drawWidth = drawHeight * srcRatio;

    // If bottle width exceeds viewport width, constrain by width
    if (drawWidth > width * 0.85) {
      drawWidth = width * 0.85;
      drawHeight = drawWidth / srcRatio;
    }

    const offsetX = (width - drawWidth) / 2;
    const offsetY = (height - drawHeight) / 2;

    // Draw preprocessed transparent bottle frame
    ctx.drawImage(
      processedCanvas,
      offsetX * dpr,
      offsetY * dpr,
      drawWidth * dpr,
      drawHeight * dpr
    );

    currentFrameRef.current = clampedIndex;
    setCurrentFrameState(clampedIndex);
  }, [totalFrames]);

  // Handle canvas resize
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    renderFrame(currentFrameRef.current);
  }, [renderFrame]);

  // Preload and chroma-key process all frames
  useEffect(() => {
    let loadedCount = 0;
    const processedCanvases: HTMLCanvasElement[] = new Array(totalFrames);

    // Source frame dimensions: 1920x1080
    // Bottle bounds: X: 680 to 1240 (width 560), Y: 40 to 1020 (height 980)
    const sx = 680;
    const sy = 40;
    const sw = 560;
    const sh = 980;

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const paddedIndex = String(i).padStart(3, '0');
      img.src = `/bottle-frames/frame-${paddedIndex}.webp`;

      const frameIdx = i - 1;

      img.onload = () => {
        // Create an offscreen canvas to crop bottle and key out green screen
        const offCanvas = document.createElement('canvas');
        offCanvas.width = sw;
        offCanvas.height = sh;
        const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });

        if (offCtx) {
          // Draw cropped bottle area
          offCtx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

          // Key out chroma green
          try {
            const imgData = offCtx.getImageData(0, 0, sw, sh);
            const data = imgData.data;
            for (let p = 0; p < data.length; p += 4) {
              const r = data[p];
              const g = data[p + 1];
              const b = data[p + 2];
              // Chroma green condition
              if (g > 130 && g > r * 1.3 && g > b * 1.3) {
                data[p + 3] = 0; // Set alpha to 0
              }
            }
            offCtx.putImageData(imgData, 0, 0);
          } catch {
            // fallback if cross-origin or security restriction
          }
        }

        processedCanvases[frameIdx] = offCanvas;
        loadedCount++;

        const pct = Math.floor((loadedCount / totalFrames) * 100);
        if (onProgress) onProgress(pct);

        if (loadedCount === totalFrames) {
          processedFramesRef.current = processedCanvases;
          setIsImagesLoaded(true);
          if (onLoaded) onLoaded();

          requestAnimationFrame(() => {
            resizeCanvas();
            renderFrame(0);
          });
        }
      };

      img.onerror = () => {
        // Handle gracefully
        loadedCount++;
        if (loadedCount === totalFrames) {
          processedFramesRef.current = processedCanvases;
          setIsImagesLoaded(true);
          if (onLoaded) onLoaded();
          requestAnimationFrame(() => {
            resizeCanvas();
            renderFrame(0);
          });
        }
      };
    }

    // Window resize listener
    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [totalFrames, onProgress, onLoaded, resizeCanvas, renderFrame]);

  // GSAP ScrollTrigger setup
  useEffect(() => {
    if (!isImagesLoaded || !containerRef.current) return;

    // Find the hero scroll container or parent section
    const heroSection = containerRef.current.closest('#hero-section') || containerRef.current;

    const st = ScrollTrigger.create({
      trigger: heroSection,
      start: 'top top',
      end: '+=150%',
      scrub: 0.6,
      pin: false,
      onUpdate: (self) => {
        if (!isDraggingRef.current) {
          const frameIndex = Math.min(
            totalFrames - 1,
            Math.floor(self.progress * (totalFrames - 1))
          );
          if (frameIndex !== currentFrameRef.current) {
            renderFrame(frameIndex);
          }
        }
      },
    });

    return () => {
      st.kill();
    };
  }, [isImagesLoaded, totalFrames, renderFrame]);

  // Touch and Drag handlers for interactive rotation
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!interactive) return;
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startFrameRef.current = currentFrameRef.current;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!interactive || !isDraggingRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    // Map pixels to frames (sensitivity: 4px per frame)
    const frameDelta = Math.floor(deltaX / 4);
    let targetFrame = (startFrameRef.current + frameDelta) % totalFrames;
    if (targetFrame < 0) targetFrame += totalFrames;

    renderFrame(targetFrame);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!interactive) return;
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const degrees = Math.round((currentFrameState / totalFrames) * 360);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[440px] md:min-h-[560px] bg-white border-4 border-black select-none overflow-hidden ${className}`}
    >
      {/* Background brutalist grid lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Crosshair Viewfinder Accents */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-black pointer-events-none z-10" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-black pointer-events-none z-10" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-black pointer-events-none z-10" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-black pointer-events-none z-10" />

      {/* HUD Overlays */}
      {showHud && (
        <>
          {/* Top HUD */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none z-20 font-mono text-[10px] md:text-xs">
            <div className="flex items-center gap-2 bg-black text-[#FFDE00] px-2 py-1 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#FF3333] animate-pulse" />
              <span>3D ROTATION MATRIX</span>
            </div>
            <div className="bg-white border-2 border-black px-2 py-0.5 font-bold shadow-[2px_2px_0px_0px_#000]">
              FRM: {String(currentFrameState + 1).padStart(3, '0')} / {totalFrames}
            </div>
          </div>

          {/* Bottom HUD */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none z-20 font-mono text-[10px] md:text-xs">
            <div className="bg-black text-white px-2 py-1 flex items-center gap-2">
              <span className="text-[#8A9A5B]">AZIMUTH:</span>
              <span className="font-bold">{degrees}°</span>
            </div>
            <div className="bg-[#FFDE00] text-black border-2 border-black px-2 py-1 font-bold shadow-[2px_2px_0px_0px_#000]">
              DRAG / SCROLL TO ROTATE 360°
            </div>
          </div>
        </>
      )}

      {/* Main HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full h-full block cursor-grab active:cursor-grabbing touch-none relative z-10"
      />

      {/* Loading state placeholder if not yet loaded */}
      {!isImagesLoaded && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white font-mono text-xs">
          <div className="border-2 border-black p-4 bg-[#FFDE00] shadow-[4px_4px_0px_0px_#000]">
            <p className="font-bold">BUFFERING 3D VIEWPORT...</p>
          </div>
        </div>
      )}
    </div>
  );
};
