'use client';

import React from 'react';

interface MarqueeProps {
  text?: string;
  speed?: 'normal' | 'fast';
  variant?: 'sage' | 'yellow' | 'black' | 'red';
  className?: string;
}

export const Marquee: React.FC<MarqueeProps> = ({
  text = '100% BIO-BASED ✦ BATCH VERIFIED ✦ pH 7.3 ✦ MADE IN PUNE ✦ 0% SYNTHETIC SULFATES ✦ TRIPLE-ENZYME COMPLEX ✦ ZERO RESIDUE ✦',
  speed = 'normal',
  variant = 'sage',
  className = '',
}) => {
  const bgStyles = {
    sage: 'bg-[#8A9A5B] text-black border-y-4 border-black',
    yellow: 'bg-[#FFDE00] text-black border-y-4 border-black',
    black: 'bg-black text-[#FFDE00] border-y-4 border-white',
    red: 'bg-[#FF3333] text-white border-y-4 border-black',
  };

  const animDuration = speed === 'fast' ? 'animate-marquee-fast' : 'animate-marquee';

  // We repeat text multiple times to ensure continuous marquee effect
  const repeatedText = `${text} `.repeat(4);

  return (
    <div
      className={`relative w-full overflow-hidden select-none py-3.5 ${bgStyles[variant]} ${className}`}
    >
      <div className="flex w-max">
        <div className={`flex shrink-0 ${animDuration} items-center font-heading text-sm md:text-xl uppercase tracking-wider`}>
          <span className="whitespace-nowrap px-4">{repeatedText}</span>
        </div>
        <div
          aria-hidden="true"
          className={`flex shrink-0 ${animDuration} items-center font-heading text-sm md:text-xl uppercase tracking-wider`}
        >
          <span className="whitespace-nowrap px-4">{repeatedText}</span>
        </div>
      </div>
    </div>
  );
};
