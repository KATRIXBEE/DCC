'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * The Deccan Cleaning Company (DCC) — Text Scramble & Intro Timing Engine
 *
 * Provides a high-performance, single-loop requestAnimationFrame text scrambler,
 * centralized configuration for the preloader sequence, and interactive hover effects.
 */

export interface PreloaderTimingConfig {
  bg: string;
  textColor: string;
  scrambleColor: string;
  glyphPool: string;
  initialCursorHoldMs: number;     // 0 - 0.3s (300ms)
  scrambleDurationMs: number;      // 0.3 - 1.6s (1300ms)
  glyphTickMs: number;             // Character cycle rate (~40ms)
  jitterMinMs: number;             // Minimum jitter per char (30ms)
  jitterMaxMs: number;             // Maximum jitter per char (120ms)
  decodedHoldMs: number;           // 1.6 - 2.0s (400ms)
  morphDurationMs: number;         // 2.0 - 2.6s (600ms)
  logoHoldMs: number;              // Hold after logo lands (300ms)
  exitSlideMs: number;             // Overlay translateY(-100%) duration (700ms)
  exitEasing: string;              // cubic-bezier(0.76, 0, 0.24, 1)
  hardCapMs: number;               // 4.5s fail-safe timeout
  cursorBlinkMs: number;           // 500ms
  hoverScrambleDurationMs: number; // 400ms for nav/CTA hover
  storageKey: string;              // sessionStorage key
}

/**
 * Centralized timing & styling configuration.
 * All timing values can be tweaked here to easily adjust speeds.
 */
export const PRELOADER_CONFIG: PreloaderTimingConfig = {
  bg: '#07110e',
  textColor: '#eaeae6',
  scrambleColor: 'rgba(234, 234, 230, 0.6)',
  glyphPool: '$&◊*:%#@!?+=<>/\\|░▒▓',
  initialCursorHoldMs: 300,
  scrambleDurationMs: 1300,
  glyphTickMs: 40,
  jitterMinMs: 30,
  jitterMaxMs: 120,
  decodedHoldMs: 400,
  morphDurationMs: 600,
  logoHoldMs: 300,
  exitSlideMs: 700,
  exitEasing: 'cubic-bezier(0.76, 0, 0.24, 1)',
  hardCapMs: 4500,
  cursorBlinkMs: 500,
  hoverScrambleDurationMs: 400,
  storageKey: 'dcc_intro_seen',
};

export interface ScrambleOptions {
  duration?: number;
  glyphs?: string;
  tickInterval?: number;
  onUpdate?: (currentText: string, isComplete: boolean) => void;
  onComplete?: () => void;
  /**
   * If true, applies left-to-right sequential locking with organic jitter.
   * If false, resolves across all characters evenly. Default: true.
   */
  sequentialLock?: boolean;
}

export interface ScrambleHandle {
  stop: () => void;
}

/**
 * Reusable function to scramble text content of an HTMLElement or notify via callback.
 * Uses requestAnimationFrame with a single loop (no per-character intervals).
 *
 * @param element HTMLElement to update with scrambled text
 * @param finalText The target text to resolve to
 * @param options Timing, glyph pool, and completion callbacks
 */
export function scrambleText(
  element: HTMLElement | null,
  finalText: string,
  options?: ScrambleOptions
): ScrambleHandle {
  const duration = options?.duration ?? PRELOADER_CONFIG.hoverScrambleDurationMs;
  const glyphs = options?.glyphs ?? PRELOADER_CONFIG.glyphPool;
  const tickInterval = options?.tickInterval ?? PRELOADER_CONFIG.glyphTickMs;
  const sequential = options?.sequentialLock !== false;
  const onUpdate = options?.onUpdate;
  const onComplete = options?.onComplete;

  let animFrameId: number | null = null;
  let isStopped = false;

  const length = finalText.length;
  if (length === 0) {
    if (element) element.textContent = '';
    onComplete?.();
    return { stop: () => {} };
  }

  // Pre-calculate per-character resolve timestamps if sequential lock is enabled
  const resolveTimes: number[] = [];
  if (sequential) {
    for (let i = 0; i < length; i++) {
      // Base linear distribution across duration
      const baseRatio = (i + 1) / length;
      const baseTime = baseRatio * duration;
      // Add random jitter between 30ms and 120ms (scaled to fit within duration)
      const jitter = (Math.random() * 90 + 30) * (duration / PRELOADER_CONFIG.scrambleDurationMs);
      const targetTime = Math.min(duration, Math.max(50, baseTime + (Math.random() - 0.5) * jitter));
      resolveTimes.push(targetTime);
    }
    // Ensure the last character resolves exactly at or slightly before duration
    resolveTimes[length - 1] = duration;
  }

  const startTime = performance.now();
  let lastTick = 0;

  // Working character buffer
  const currentChars: string[] = new Array(length);
  for (let i = 0; i < length; i++) {
    currentChars[i] = finalText[i] === ' ' ? ' ' : glyphs[Math.floor(Math.random() * glyphs.length)];
  }

  const frame = (now: number) => {
    if (isStopped) return;

    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);

    // Update random glyphs periodically based on tickInterval
    const shouldTick = now - lastTick >= tickInterval;
    if (shouldTick) {
      lastTick = now;

      for (let i = 0; i < length; i++) {
        if (finalText[i] === ' ') {
          currentChars[i] = ' ';
          continue;
        }

        const isResolved = sequential
          ? elapsed >= resolveTimes[i]
          : progress >= (i + 1) / length;

        if (isResolved) {
          currentChars[i] = finalText[i];
        } else {
          currentChars[i] = glyphs[Math.floor(Math.random() * glyphs.length)];
        }
      }

      const text = currentChars.join('');
      if (element) {
        element.textContent = text;
      }
      onUpdate?.(text, progress >= 1);
    }

    if (progress < 1) {
      animFrameId = requestAnimationFrame(frame);
    } else {
      // Ensure exact final text on completion
      if (element) {
        element.textContent = finalText;
      }
      onUpdate?.(finalText, true);
      onComplete?.();
    }
  };

  animFrameId = requestAnimationFrame(frame);

  return {
    stop: () => {
      isStopped = true;
      if (animFrameId !== null) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
    },
  };
}

/**
 * React hook for applying 400ms scramble effect on mouseenter to nav links & CTAs.
 */

export function useScrambleHover(
  initialText: string,
  duration = PRELOADER_CONFIG.hoverScrambleDurationMs
) {
  const elRef = useRef<HTMLElement | null>(null);
  const handleRef = useRef<ScrambleHandle | null>(null);

  const trigger = useCallback(() => {
    handleRef.current?.stop();
    if (elRef.current) {
      handleRef.current = scrambleText(elRef.current, initialText, {
        duration,
        sequentialLock: true,
        onComplete: () => {
          if (elRef.current) elRef.current.textContent = initialText;
        },
      });
    }
  }, [initialText, duration]);

  const reset = useCallback(() => {
    handleRef.current?.stop();
    if (elRef.current) elRef.current.textContent = initialText;
  }, [initialText]);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    el.textContent = initialText;

    const handleMouseEnter = () => trigger();
    const handleMouseLeave = () => reset();

    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      handleRef.current?.stop();
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [initialText, trigger, reset]);

  return { elRef, trigger, reset };
}

/**
 * Reusable wrapper for scramble-on-hover text labels.
 */
export const ScrambleHoverText: React.FC<{
  text: string;
  duration?: number;
  className?: string;
}> = ({ text, duration = PRELOADER_CONFIG.hoverScrambleDurationMs, className = '' }) => {
  const { elRef } = useScrambleHover(text, duration);
  return React.createElement(
    'span',
    {
      ref: elRef,
      className: `inline-block select-none ${className}`,
    },
    text
  );
};

