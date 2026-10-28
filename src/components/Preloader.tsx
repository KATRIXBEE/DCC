'use client';

import React, { useEffect, useState } from 'react';

interface PreloaderProps {
  progress: number; // 0 to 100
  isLoaded: boolean;
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({
  progress,
  isLoaded,
  onComplete,
}) => {
  const [shouldRender, setShouldRender] = useState(true);
  const [displayedProgress, setDisplayedProgress] = useState(0);

  // Smoothly increment displayed progress toward actual progress
  useEffect(() => {
    const timer = setInterval(() => {
      setDisplayedProgress((prev) => {
        if (prev < progress) {
          return Math.min(prev + 2, progress);
        }
        return prev;
      });
    }, 20);

    return () => clearInterval(timer);
  }, [progress]);

  useEffect(() => {
    if (displayedProgress >= 100 && isLoaded) {
      const exitTimer = setTimeout(() => {
        setShouldRender(false);
        if (onComplete) onComplete();
      }, 500);
      return () => clearTimeout(exitTimer);
    }
  }, [displayedProgress, isLoaded, onComplete]);

  if (!shouldRender) return null;

  // Determine stage message
  let statusMessage = 'CALIBRATING TRIPLE-ENZYME BUFFER...';
  if (displayedProgress > 25 && displayedProgress <= 50) {
    statusMessage = 'STABILIZING BIO-POLYMER SHEETING (pH 7.3)...';
  } else if (displayedProgress > 50 && displayedProgress <= 75) {
    statusMessage = 'LOADING 3D ROTATION MATRIX [105 FRAMES]...';
  } else if (displayedProgress > 75 && displayedProgress < 100) {
    statusMessage = 'MOUNTING GSAP SCROLL SCRUBBER...';
  } else if (displayedProgress >= 100) {
    statusMessage = 'BATCH 001 CALIBRATION COMPLETE. SYSTEM ARMED.';
  }

  // ASCII bar
  const totalBars = 24;
  const filledBars = Math.floor((displayedProgress / 100) * totalBars);
  const barString = '█'.repeat(filledBars) + '░'.repeat(totalBars - filledBars);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-between bg-black text-white p-6 md:p-12 transition-all duration-700 select-none ${
        displayedProgress >= 100 && isLoaded
          ? 'opacity-0 pointer-events-none -translate-y-4'
          : 'opacity-100'
      }`}
    >
      {/* Top Header info */}
      <div className="flex justify-between items-start border-b-4 border-white pb-4 font-mono text-xs md:text-sm">
        <div>
          <span className="bg-[#FFDE00] text-black px-2 py-0.5 font-bold mr-2">
            SYSTEM BOOT
          </span>
          <span className="tracking-widest">DCC // DECCAN CLEAN TECH</span>
        </div>
        <div className="text-right">
          <p className="text-[#8A9A5B] font-bold">18.5204° N, 73.8567° E</p>
          <p className="text-neutral-400">PUNE R&D BIOCHEMICAL LAB</p>
        </div>
      </div>

      {/* Center content */}
      <div className="max-w-3xl w-full mx-auto my-auto py-12">
        <div className="border-4 border-white p-6 md:p-10 bg-[#111111] shadow-[8px_8px_0px_0px_#FFDE00]">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-3.5 h-3.5 bg-[#FF3333] animate-ping" />
            <span className="font-mono text-xs md:text-sm tracking-wider text-neutral-400 uppercase">
              ASSET PIPELINE VERIFICATION
            </span>
          </div>

          <h1 className="font-heading text-3xl md:text-6xl uppercase tracking-tighter text-white mb-6">
            INITIALIZING BATCH 001...
          </h1>

          {/* ASCII progress meter */}
          <div className="bg-black border-2 border-white p-4 font-mono mb-6">
            <div className="flex justify-between text-xs md:text-sm mb-2 text-[#FFDE00]">
              <span>[{barString}]</span>
              <span className="font-bold">{displayedProgress}%</span>
            </div>
            <div className="w-full bg-neutral-900 h-3 border border-white">
              <div
                className="bg-[#FFDE00] h-full transition-all duration-150"
                style={{ width: `${displayedProgress}%` }}
              />
            </div>
          </div>

          {/* Status readout */}
          <div className="font-mono text-xs md:text-sm flex flex-col gap-1 text-neutral-300">
            <div className="flex items-center gap-2">
              <span className="text-[#8A9A5B]">▶</span>
              <span>{statusMessage}</span>
            </div>
            <div className="text-neutral-500 text-xs mt-2">
              FRAME BUFFERS: {Math.round((displayedProgress / 100) * 105)} / 105
              WEBP TEXTURES LOADED
            </div>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="flex justify-between items-end border-t-4 border-white pt-4 font-mono text-xs text-neutral-400">
        <div>
          <span>SPEC: BIO-ENZYMATIC HIGH-DENSITY FORMULA</span>
        </div>
        <div>
          <span>DCC-OS v2.4 // PROTOCOL ZERO</span>
        </div>
      </div>
    </div>
  );
};
