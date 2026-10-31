'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { PRELOADER_CONFIG } from '@/lib/scramble';

/**
 * The Deccan Cleaning Company (DCC) — High-Performance Intro Preloader
 *
 * Sequence:
 * 1. 0.0s – 0.3s: Overlay visible instantly (#07110e). Blinking halftone cursor only.
 * 2. 0.3s – 1.6s: Text "THE DECCAN CLEANING COMPANY" decodes with organic left-to-right jitter.
 * 3. 1.6s – 2.0s: Hold decoded text.
 * 4. 2.0s – 2.6s: Morph into DCC logo via micro-scramble, clip-path wipe, scale & SVG stroke draw.
 * 5. 2.6s – 2.9s: Hold logo for 300ms.
 * 6. 2.9s – 3.6s: translateY(-100%) slide-up (700ms, cubic-bezier(0.76, 0, 0.24, 1)).
 *    Body scroll restored, custom completion event dispatched, overlay removed from DOM.
 */

const TARGET_TEXT = 'THE DECCAN CLEANING COMPANY';

interface CharState {
  char: string;
  isResolved: boolean;
}

export const Preloader: React.FC = () => {
  const [isMounted, setIsMounted] = useState<boolean>(true);
  const [phase, setPhase] = useState<'initial' | 'scrambling' | 'decoded' | 'morphing' | 'logo' | 'exiting' | 'done'>('initial');
  const [charStates, setCharStates] = useState<CharState[]>(() =>
    TARGET_TEXT.split('').map((char) => ({ char: char === ' ' ? ' ' : ' ', isResolved: false }))
  );
  const [cursorIndex, setCursorIndex] = useState<number>(0);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const addTimer = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timersRef.current.push(t);
    return t;
  }, []);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  // Complete preloader sequence and remove from DOM
  const finishPreloader = useCallback(() => {
    clearAllTimers();
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
      try {
        sessionStorage.setItem(PRELOADER_CONFIG.storageKey, 'true');
        document.documentElement.classList.add('dcc-preloader-skip');
      } catch {
        // Fallback for sandboxed storage
      }
      window.dispatchEvent(new CustomEvent('dcc-preloader-complete'));
    }

    setPhase('exiting');

    addTimer(() => {
      setPhase('done');
      setIsMounted(false);
    }, PRELOADER_CONFIG.exitSlideMs);
  }, [clearAllTimers, addTimer]);

  const runSequence = useCallback((pauseAt?: string) => {
    clearAllTimers();
    setIsMounted(true);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
      document.documentElement.classList.remove('dcc-preloader-skip');
    }

    // Check reduced motion: skip scramble, show logo with simple 300ms fade, then remove overlay
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsReducedMotion(true);
      setPhase('logo');
      if (pauseAt === 'logo') return;
      addTimer(() => {
        finishPreloader();
      }, 600);
      return;
    }

    // Step 1: Initial hold with blinking halftone cursor
    setPhase('initial');
    setCharStates(TARGET_TEXT.split('').map((char) => ({ char: char === ' ' ? ' ' : ' ', isResolved: false })));
    setCursorIndex(0);

    if (pauseAt === 'initial') return;

    // Hard cap fail-safe: never hang longer than 4.5s
    if (!pauseAt) {
      addTimer(() => {
        finishPreloader();
      }, PRELOADER_CONFIG.hardCapMs);
    }

    // Step 2: 0.3s - 1.6s Scramble text
    addTimer(() => {
      setPhase('scrambling');

      const totalChars = TARGET_TEXT.length;
      const glyphs = PRELOADER_CONFIG.glyphPool;
      const scrambleDuration = PRELOADER_CONFIG.scrambleDurationMs;

      // Precalculate organic resolve timestamps with jitter
      const resolveTimes: number[] = [];
      for (let i = 0; i < totalChars; i++) {
        const base = ((i + 1) / totalChars) * scrambleDuration;
        const jitter = (Math.random() * (PRELOADER_CONFIG.jitterMaxMs - PRELOADER_CONFIG.jitterMinMs) + PRELOADER_CONFIG.jitterMinMs);
        const resolveTime = Math.min(scrambleDuration, Math.max(60, base + (Math.random() - 0.5) * jitter));
        resolveTimes.push(resolveTime);
      }
      resolveTimes[totalChars - 1] = scrambleDuration;

      const startTime = performance.now();
      let lastTick = 0;

      const runScramble = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / scrambleDuration);

        if (now - lastTick >= PRELOADER_CONFIG.glyphTickMs) {
          lastTick = now;
          let highestResolvedIndex = 0;

          const nextStates: CharState[] = [];
          for (let i = 0; i < totalChars; i++) {
            const targetChar = TARGET_TEXT[i];
            if (targetChar === ' ') {
              nextStates.push({ char: ' ', isResolved: true });
              continue;
            }

            const isResolved = elapsed >= resolveTimes[i];
            if (isResolved) {
              nextStates.push({ char: targetChar, isResolved: true });
              highestResolvedIndex = Math.max(highestResolvedIndex, i);
            } else {
              const randomGlyph = glyphs[Math.floor(Math.random() * glyphs.length)];
              nextStates.push({ char: randomGlyph, isResolved: false });
            }
          }

          setCharStates(nextStates);
          setCursorIndex(highestResolvedIndex);
        }

        if (pauseAt === 'mid-scramble' && progress >= 0.5) {
          return;
        }

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(runScramble);
        } else {
          // All characters resolved
          setCharStates(TARGET_TEXT.split('').map((c) => ({ char: c, isResolved: true })));
          setCursorIndex(totalChars);
          setPhase('decoded');
          if (pauseAt === 'decoded') return;

          // Step 3: 1.6s - 2.0s Hold decoded text
          addTimer(() => {
            setPhase('morphing');

            // Step 4: 2.0s - 2.6s Morph into logo
            let microTicks = 0;
            const microInterval = setInterval(() => {
              microTicks++;
              setCharStates((prev) =>
                prev.map((item) => ({
                  char: item.char === ' ' ? ' ' : glyphs[Math.floor(Math.random() * glyphs.length)],
                  isResolved: false,
                }))
              );
              if (microTicks >= 4) {
                clearInterval(microInterval);
                setPhase('logo');
              }
            }, 35);

            addTimer(() => {
              clearInterval(microInterval);
              setPhase('logo');
              if (pauseAt === 'logo') return;

              // Step 5: 2.6s - 2.9s Hold logo
              addTimer(() => {
                finishPreloader();
              }, PRELOADER_CONFIG.logoHoldMs);
            }, PRELOADER_CONFIG.morphDurationMs);
          }, PRELOADER_CONFIG.decodedHoldMs);
        }
      };

      animFrameRef.current = requestAnimationFrame(runScramble);
    }, PRELOADER_CONFIG.initialCursorHoldMs);
  }, [addTimer, clearAllTimers, finishPreloader]);

  useEffect(() => {
    // Check reduced motion
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotionQuery.matches) {
      setIsReducedMotion(true);
      setPhase('logo');
      const timer = setTimeout(() => {
        finishPreloader();
      }, 600);
      return () => clearTimeout(timer);
    }

    // Replay event listener (allows devtools / demo testing)
    const handleReplayEvent = (e?: Event) => {
      const customEvent = e as CustomEvent<{ pauseAt?: string }>;
      runSequence(customEvent?.detail?.pauseAt);
    };

    window.addEventListener('dcc-replay-preloader', handleReplayEvent);

    // Initial check: if already visited in session, skip immediately
    try {
      if (sessionStorage.getItem(PRELOADER_CONFIG.storageKey) === 'true') {
        setIsMounted(false);
        setPhase('done');
        return () => {
          window.removeEventListener('dcc-replay-preloader', handleReplayEvent);
          clearAllTimers();
        };
      }
    } catch {
      // Continue if sessionStorage is not accessible
    }

    // First visit: run sequence
    runSequence();

    return () => {
      window.removeEventListener('dcc-replay-preloader', handleReplayEvent);
      clearAllTimers();
      document.body.style.overflow = '';
    };
  }, [finishPreloader, runSequence, clearAllTimers]);

  if (!isMounted) return null;

  return (
    <div
      id="dcc-preloader"
      ref={containerRef}
      role="status"
      aria-label="Loading The Deccan Cleaning Company"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center select-none ${
        phase === 'exiting' ? '-translate-y-full' : 'translate-y-0'
      }`}
      style={{
        backgroundColor: PRELOADER_CONFIG.bg,
        transition: phase === 'exiting' ? `transform ${PRELOADER_CONFIG.exitSlideMs}ms ${PRELOADER_CONFIG.exitEasing}` : 'none',
        willChange: 'transform',
      }}
    >
      {/* Visually hidden accessibility notice */}
      <span className="sr-only">Loading The Deccan Cleaning Company</span>

      {/* Center stage container */}
      <div className="relative w-full max-w-4xl px-4 sm:px-8 flex flex-col items-center justify-center min-h-[160px] text-center">
        {/* Phase: Initial stage (0–0.3s) - Only the blinking halftone cursor shows */}
        {phase === 'initial' && !isReducedMotion && (
          <div
            className="flex items-center justify-center"
            style={{
              fontSize: 'clamp(0.88rem, 3.8vw, 2.15rem)',
            }}
            aria-hidden="true"
          >
            <span className="dcc-halftone-cursor" />
          </div>
        )}

        {/* Phase: Text Decoding Stage (Scrambling, Decoded, Morphing) */}
        {phase !== 'initial' && phase !== 'logo' && !isReducedMotion && (
          <div
            className={`flex items-center justify-center flex-wrap gap-x-1 sm:gap-x-1.5 transition-all duration-300 ${
              phase === 'morphing'
                ? 'opacity-40 scale-95 blur-[0.5px]'
                : 'opacity-100 scale-100'
            }`}
            style={{
              fontFamily: "var(--font-jetbrains), var(--font-spacemono), 'Space Mono', 'JetBrains Mono', monospace",
              fontSize: 'clamp(0.88rem, 3.8vw, 2.15rem)',
              letterSpacing: '0.06em',
            }}
            aria-hidden="true"
          >
            {/* Blinking halftone block cursor at the left before characters start resolving */}
            {cursorIndex === 0 && (
              <span className="dcc-halftone-cursor mr-2 sm:mr-3" aria-hidden="true" />
            )}

            {/* Scrambled Characters */}
            {charStates.map((item, idx) => {
              if (item.char === ' ') {
                return (
                  <span key={idx} className="inline-block w-[0.35em]">
                    &nbsp;
                  </span>
                );
              }

              const isCursorHere = phase === 'scrambling' && idx === cursorIndex;

              return (
                <span key={idx} className="relative inline-flex items-center justify-center">
                  <span
                    className={`transition-colors duration-75 font-extrabold ${
                      item.isResolved
                        ? 'text-[#eaeae6]'
                        : 'text-[#eaeae6]/60'
                    }`}
                  >
                    {item.char}
                  </span>
                  {/* Advancing halftone cursor tracking the resolve position */}
                  {isCursorHere && (
                    <span
                      className="dcc-halftone-cursor absolute left-full ml-0.5"
                      aria-hidden="true"
                    />
                  )}
                </span>
              );
            })}
          </div>
        )}

        {/* Phase: DCC Logo Morph & Reveal Stage */}
        {(phase === 'logo' || isReducedMotion) && (
          <div
            className={`flex flex-col items-center justify-center transition-all duration-500 ease-out ${
              isReducedMotion
                ? 'opacity-100 scale-100'
                : 'animate-fadeIn scale-100'
            }`}
          >
            {/* 
              TODO: Swap with official DCC logo asset if provided.
              High-fidelity SVG Monogram for Deccan Clean Tech (DCC) with industrial frame & precision paths
            */}
            <div className="relative group">
              <svg
                width="280"
                height="90"
                viewBox="0 0 280 90"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="max-w-[80vw] h-auto drop-shadow-[0_0_15px_rgba(234,234,230,0.15)]"
              >
                {/* Outer Industrial Tech Border */}
                <rect
                  x="2"
                  y="2"
                  width="276"
                  height="86"
                  stroke="#eaeae6"
                  strokeWidth="2.5"
                  className="transition-all duration-700"
                  strokeDasharray="740"
                  strokeDashoffset={isReducedMotion ? 0 : 0}
                />

                {/* Corner Tech Ticks */}
                <line x1="2" y1="12" x2="12" y2="2" stroke="#FFDE00" strokeWidth="2.5" />
                <line x1="268" y1="2" x2="278" y2="12" stroke="#FFDE00" strokeWidth="2.5" />
                <line x1="2" y1="78" x2="12" y2="88" stroke="#FFDE00" strokeWidth="2.5" />
                <line x1="268" y1="88" x2="278" y2="78" stroke="#FFDE00" strokeWidth="2.5" />

                {/* "DCC" Bold Monospace Geometric Wordmark */}
                <text
                  x="50%"
                  y="55%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fill="#eaeae6"
                  fontSize="44"
                  fontWeight="900"
                  letterSpacing="0.18em"
                  fontFamily="var(--font-jetbrains), var(--font-spacemono), monospace"
                >
                  DCC
                </text>
              </svg>

              {/* Sub-label badge */}
              <div className="flex items-center justify-between mt-3 px-1 font-mono text-[10px] sm:text-xs text-[#8A9A5B] tracking-widest uppercase">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8A9A5B] animate-pulse" />
                  <span>DECCAN CLEAN TECH</span>
                </span>
                <span className="text-neutral-500">// PUNE R&D</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Subtle corner telemetry metadata matching DCC industrial aesthetic */}
      <div className="absolute top-6 left-6 font-mono text-[10px] sm:text-xs text-neutral-500 uppercase tracking-widest hidden sm:flex items-center gap-2">
        <span className="w-2 h-2 bg-[#FFDE00] inline-block" />
        <span>SYS.BOOT // DCC-OS</span>
      </div>
      <div className="absolute bottom-6 right-6 font-mono text-[10px] sm:text-xs text-neutral-500 uppercase tracking-widest hidden sm:flex items-center gap-2">
        <span>BIO-ENZYMATIC ACTIVE</span>
        <span className="text-[#8A9A5B]">● 18.5204° N</span>
      </div>
    </div>
  );
};
