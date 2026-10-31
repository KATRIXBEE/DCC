'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowRight, ShieldCheck, Check, Droplets, ArrowDown } from 'lucide-react';
import { GlitchButton } from './GlitchButton';
import { useCart, defaultProduct } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollSequenceSectionProps {
  onProgress?: (percent: number) => void;
  onLoaded?: () => void;
  onOpenB2B: () => void;
}

export const ScrollSequenceSection: React.FC<ScrollSequenceSectionProps> = ({
  onProgress,
  onLoaded,
  onOpenB2B,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const processedFramesRef = useRef<HTMLCanvasElement[]>([]);
  const currentFrameRef = useRef<number>(0);

  const [frameIndex, setFrameIndex] = useState<number>(1);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isImagesLoaded, setIsImagesLoaded] = useState<boolean>(false);

  const { addItem } = useCart();
  const totalFrames = 105;

  // Render a specific frame index on the canvas
  const renderFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const clamped = Math.max(0, Math.min(frameIdx, totalFrames - 1));
    const processed = processedFramesRef.current[clamped];
    if (!processed) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const srcRatio = processed.width / processed.height;

    // Centered bottle scaling: takes up ~80% of viewport height
    let drawHeight = height * 0.82;
    let drawWidth = drawHeight * srcRatio;

    // Responsive constrain for smaller screens
    if (drawWidth > width * 0.8) {
      drawWidth = width * 0.8;
      drawHeight = drawWidth / srcRatio;
    }

    const offsetX = (width - drawWidth) / 2;
    const offsetY = (height - drawHeight) / 2;

    ctx.drawImage(
      processed,
      offsetX * dpr,
      offsetY * dpr,
      drawWidth * dpr,
      drawHeight * dpr
    );

    currentFrameRef.current = clamped;
    setFrameIndex(clamped + 1);
  }, [totalFrames]);

  // Resize handler
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    renderFrame(currentFrameRef.current);
  }, [renderFrame]);

  // Preload and chroma-key process all 105 frames
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
        const offCanvas = document.createElement('canvas');
        offCanvas.width = sw;
        offCanvas.height = sh;
        const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });

        if (offCtx) {
          offCtx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

          try {
            const imgData = offCtx.getImageData(0, 0, sw, sh);
            const data = imgData.data;
            for (let p = 0; p < data.length; p += 4) {
              const r = data[p];
              const g = data[p + 1];
              const b = data[p + 2];
              // Chroma green filter
              if (g > 130 && g > r * 1.3 && g > b * 1.3) {
                data[p + 3] = 0;
              }
            }
            offCtx.putImageData(imgData, 0, 0);
          } catch {
            // fallback
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

    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [totalFrames, onProgress, onLoaded, resizeCanvas, renderFrame]);

  // GSAP ScrollTrigger Scrubbing over 300vh
  useEffect(() => {
    if (!isImagesLoaded || !containerRef.current) return;

    const triggerElement = containerRef.current;

    const st = ScrollTrigger.create({
      trigger: triggerElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5, // Ultra-smooth scrubbing
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress;
        setScrollProgress(p);

        const newFrame = Math.round(p * (totalFrames - 1));
        if (newFrame !== currentFrameRef.current) {
          renderFrame(newFrame);
        }
      },
    });

    return () => {
      st.kill();
    };
  }, [isImagesLoaded, totalFrames, renderFrame]);

  // Determine active narrative stage (0 to 3)
  // 0% -> Stage 0: "WE CLEAN"
  // 25% -> Stage 1: "WITHOUT RULES"
  // 50% -> Stage 2: "BIO-ENZYMATIC. COST-PER-WASH OPTIMIZED."
  // 75% -> Stage 3: Feature stats
  let activeStage = 0;
  if (scrollProgress >= 0.22 && scrollProgress < 0.48) {
    activeStage = 1;
  } else if (scrollProgress >= 0.48 && scrollProgress < 0.72) {
    activeStage = 2;
  } else if (scrollProgress >= 0.72) {
    activeStage = 3;
  }

  const azimuthDegrees = Math.round(scrollProgress * 360);

  return (
    <section
      ref={containerRef}
      id="hero-scroll-sequence"
      className="relative w-full h-[300vh] bg-white border-b-4 border-black select-none"
    >
      {/* Pinned / Sticky Viewport Wrapper */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-white">
        {/* Blueprint background grid lines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />

        {/* Top Floating Telemetry Strip */}
        <div className="absolute top-0 left-0 right-0 z-30 border-b-4 border-black bg-white px-4 sm:px-8 py-2 font-mono text-[10px] md:text-xs flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF3333] animate-ping" />
            <span className="font-bold bg-black text-[#FFDE00] px-1.5 py-0.5">
              STICKY CAD VIEWPORT
            </span>
            <span className="hidden sm:inline font-bold">BATCH 001 ALLOCATION // PUNE LAB</span>
          </div>
          <div className="flex items-center gap-4 font-bold">
            <span className="text-[#8A9A5B]">pH 7.3 NEUTRAL</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">5ML CONCENTRATE</span>
            <span>•</span>
            <span className="bg-[#FFDE00] text-black px-2 py-0.5 border border-black">
              AZIMUTH: {azimuthDegrees}°
            </span>
          </div>
        </div>

        {/* Viewfinder Corner Accents */}
        <div className="absolute top-16 left-6 w-6 h-6 border-t-4 border-l-4 border-black pointer-events-none z-20" />
        <div className="absolute top-16 right-6 w-6 h-6 border-t-4 border-r-4 border-black pointer-events-none z-20" />
        <div className="absolute bottom-6 left-6 w-6 h-6 border-b-4 border-l-4 border-black pointer-events-none z-20" />
        <div className="absolute bottom-6 right-6 w-6 h-6 border-b-4 border-r-4 border-black pointer-events-none z-20" />

        {/* Left Side Progress Bar & Step Numbers */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-3 font-mono text-xs font-bold">
          <span className="text-[10px] text-neutral-400 -rotate-90 mb-4 tracking-widest uppercase">
            SCROLL ROTATION
          </span>
          {[0, 1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-8 h-8 flex items-center justify-center border-2 border-black transition-all ${
                activeStage === step
                  ? 'bg-[#FFDE00] text-black scale-110 shadow-[3px_3px_0px_0px_#000]'
                  : 'bg-white text-neutral-400'
              }`}
            >
              0{step + 1}
            </div>
          ))}
          <div className="w-1 h-20 bg-neutral-200 mt-2 relative border border-black">
            <div
              className="w-full bg-[#FFDE00] transition-all duration-100"
              style={{ height: `${Math.min(100, Math.round(scrollProgress * 100))}%` }}
            />
          </div>
        </div>

        {/* Right HUD: Frame Index */}
        <div className="absolute right-6 top-20 z-20 hidden md:block font-mono text-xs pointer-events-none">
          <div className="border-2 border-black bg-white p-3 shadow-[4px_4px_0px_0px_#000] text-right space-y-1">
            <span className="block text-[10px] text-neutral-500 uppercase">TELEMETRY</span>
            <div className="font-bold text-sm">
              FRM: {String(frameIndex).padStart(3, '0')} / {totalFrames}
            </div>
            <div className="text-[10px] text-[#8A9A5B] font-bold">
              {Math.round(scrollProgress * 100)}% SEQUENCE COMPLETE
            </div>
          </div>
        </div>

        {/* CENTER STICKY CANVAS FOR 105 BOTTLE FRAMES */}
        <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">
          <canvas
            ref={canvasRef}
            className="block max-w-full max-h-full"
          />

          {!isImagesLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-30 font-mono text-xs">
              <div className="border-4 border-black p-6 bg-[#FFDE00] shadow-[6px_6px_0px_0px_#000]">
                <p className="font-bold text-sm uppercase">BUFFERING 105 FRAME SEQUENCE...</p>
                <p className="text-xs text-neutral-700 mt-1">Calibrating transparent chroma matrix</p>
              </div>
            </div>
          )}
        </div>

        {/* LAYERED TEXT OVERLAYS SYNCHRONIZED TO SCROLL PROGRESS */}
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center p-6 sm:p-12 md:p-16 max-w-7xl mx-auto">
          {/* ========================================================
              STAGE 0 (0% - 22% Scroll): "WE CLEAN"
             ======================================================== */}
          <div
            className={`absolute left-4 sm:left-12 lg:left-24 max-w-xl transition-all duration-500 transform ${
              activeStage === 0
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 -translate-y-8 pointer-events-none'
            }`}
          >
            <div className="inline-flex items-center gap-2 border-2 border-black bg-[#8A9A5B] text-black px-3 py-1 font-mono text-xs font-bold uppercase mb-4 shadow-[3px_3px_0px_0px_#000]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pune Biochemical Lab</span>
            </div>

            <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tighter leading-[0.88] text-black mb-4">
              WE CLEAN
            </h1>

            <p className="font-mono text-xs sm:text-sm text-neutral-700 bg-white/90 border-l-4 border-black p-3 mb-6 max-w-md backdrop-blur-xs">
              Deccan Clean Tech engineers biological enzyme cleaners that dissolve organic food grease at the molecular bond. No caustic lye. No synthetic sulfates.
            </p>

            <div className="flex items-center gap-3">
              <Link
                href="/shop"
                className="relative inline-flex items-center justify-center border-4 border-black rounded-none transition-all duration-150 active:translate-x-[2px] active:translate-y-[2px] cursor-pointer select-none bg-[#FFDE00] text-black hover:bg-black hover:text-[#FFDE00] shadow-[4px_4px_0px_0px_#000000] px-6 py-3.5 text-sm md:text-base font-mono uppercase tracking-wider font-bold"
              >
                EXPLORE BATCH 001 [₹169] →
              </Link>
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono font-bold text-neutral-500 animate-pulse">
                <ArrowDown className="w-4 h-4" />
                <span>SCROLL DOWN TO ROTATE BOTTLE</span>
              </div>
            </div>
          </div>

          {/* ========================================================
              STAGE 1 (22% - 48% Scroll): "WITHOUT RULES"
             ======================================================== */}
          <div
            className={`absolute left-4 sm:left-12 lg:left-24 max-w-xl transition-all duration-500 transform ${
              activeStage === 1
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 translate-y-8 pointer-events-none'
            }`}
          >
            <div className="inline-flex items-center gap-2 border-2 border-black bg-black text-[#FFDE00] px-3 py-1 font-mono text-xs font-bold uppercase mb-4 shadow-[3px_3px_0px_0px_#8A9A5B]">
              <span>PHASE 02 // ZERO SYNTHETICS</span>
            </div>

            <h2 className="font-heading text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tighter leading-[0.88] text-black mb-4">
              WITHOUT <br />
              <span className="bg-black text-[#FFDE00] px-3 inline-block mt-1">
                RULES.
              </span>
            </h2>

            <p className="font-mono text-xs sm:text-sm text-neutral-700 bg-white/90 border-l-4 border-black p-3 mb-6 max-w-md backdrop-blur-xs">
              We threw out the 80-year-old blue detergent formula. No toxic SLS/SLES foamers, zero petrochemical color dyes, and zero caustic sodium hydroxide.
            </p>

            <div className="flex gap-2">
              <span className="bg-neutral-100 border-2 border-black px-2.5 py-1 text-xs font-mono font-bold">
                100% BIO-BASED
              </span>
              <span className="bg-[#8A9A5B] text-black border-2 border-black px-2.5 py-1 text-xs font-mono font-bold">
                SKIN BARRIER SAFE
              </span>
            </div>
          </div>

          {/* ========================================================
              STAGE 2 (48% - 72% Scroll): "BIO-ENZYMATIC"
             ======================================================== */}
          <div
            className={`absolute right-4 sm:right-12 lg:right-24 max-w-xl text-right transition-all duration-500 transform ${
              activeStage === 2
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 translate-y-8 pointer-events-none'
            }`}
          >
            <div className="inline-flex items-center gap-2 border-2 border-black bg-[#FF3333] text-white px-3 py-1 font-mono text-xs font-bold uppercase mb-4 shadow-[3px_3px_0px_0px_#000]">
              <span>PHASE 03 // MOLECULAR DIGESTION</span>
            </div>

            <h2 className="font-heading text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tighter leading-[0.9] text-black mb-2">
              BIO-ENZYMATIC.
            </h2>
            <div className="font-heading text-xl sm:text-2xl uppercase tracking-tight text-[#8A9A5B] mb-4">
              COST-PER-WASH OPTIMIZED
            </div>

            <div className="bg-white/90 border-r-4 border-black p-4 mb-6 max-w-md ml-auto text-left backdrop-blur-xs font-mono text-xs space-y-1.5 shadow-[4px_4px_0px_0px_#000]">
              <div className="flex justify-between border-b pb-1 font-bold">
                <span>DCC DOSE:</span>
                <span className="text-black">5ML CONCENTRATE</span>
              </div>
              <div className="flex justify-between border-b py-1">
                <span>COST / 20 PLATES:</span>
                <span className="text-[#8A9A5B] font-bold">₹0.84</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>COMMERCIAL AVERAGE:</span>
                <span className="text-[#FF3333] line-through font-bold">₹3.20</span>
              </div>
            </div>

            <button
              onClick={onOpenB2B}
              className="bg-black text-white border-4 border-black px-6 py-3 font-mono font-bold text-xs uppercase hover:bg-[#FFDE00] hover:text-black transition-colors cursor-pointer shadow-[4px_4px_0px_0px_#8A9A5B]"
            >
              AUDIT YOUR RESTAURANT SPEND →
            </button>
          </div>

          {/* ========================================================
              STAGE 3 (72% - 100% Scroll): FULL SPECIFICATIONS & CTAS
             ======================================================== */}
          <div
            className={`w-full max-w-6xl transition-all duration-500 transform ${
              activeStage === 3
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 translate-y-8 pointer-events-none'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              {/* Left card */}
              <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_#000]">
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-black text-[#FFDE00] px-2 py-0.5 font-mono text-xs font-bold uppercase">
                    STAGE 04 // FINAL SPECS
                  </span>
                  <span className="font-mono text-xs font-bold text-[#8A9A5B]">
                    360° INSPECTION COMPLETE
                  </span>
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl uppercase tracking-tight mb-3">
                  DCC BATCH 001 ALLOCATED.
                </h3>

                <div className="space-y-2 font-mono text-xs text-neutral-800">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#8A9A5B] stroke-[3]" />
                    <span><strong>pH 7.3 ± 0.1:</strong> Skin neutral, zero chef dermatitis.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#8A9A5B] stroke-[3]" />
                    <span><strong>Sheeting Polymer:</strong> Water sheets in 3.2s, zero spotting.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#8A9A5B] stroke-[3]" />
                    <span><strong>100 Doses:</strong> 500ml concentrated active gel.</span>
                  </div>
                </div>
              </div>

              {/* Right card */}
              <div className="border-4 border-black bg-[#FFDE00] p-6 shadow-[8px_8px_0px_0px_#000] text-black">
                <span className="font-mono text-xs font-bold uppercase block mb-1">
                  OFFICIAL PRICE
                </span>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-heading text-4xl sm:text-5xl">₹169</span>
                  <span className="font-mono text-base line-through text-neutral-700">₹249</span>
                  <span className="bg-black text-white px-2 py-0.5 font-mono text-xs font-bold">
                    SAVE ₹80
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => addItem(defaultProduct, 1)}
                    className="flex-1 bg-black text-[#FFDE00] border-2 border-black py-3 px-4 font-mono font-bold text-xs uppercase hover:bg-white hover:text-black transition-colors"
                  >
                    + ADD TO DISPATCH CART
                  </button>
                  <Link
                    href="/shop"
                    className="flex-1 bg-white text-black border-2 border-black py-3 px-4 font-mono font-bold text-xs uppercase hover:bg-black hover:text-white transition-colors text-center flex items-center justify-center cursor-pointer"
                  >
                    VIEW FULL SPECS →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Scroll Indicator Helper */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 font-mono text-[10px] md:text-xs font-bold flex items-center gap-2 bg-black text-white px-4 py-1.5 border-2 border-black shadow-[3px_3px_0px_0px_#FFDE00]">
          <span className="text-[#FFDE00]">ROTATION SCRUBBER:</span>
          <span>{Math.round(scrollProgress * 100)}%</span>
          <span>•</span>
          <span>{scrollProgress >= 0.98 ? 'PIN RELEASING ↓' : 'KEEP SCROLLING ↓'}</span>
        </div>
      </div>
    </section>
  );
};
