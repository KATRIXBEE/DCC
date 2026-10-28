'use client';

import React, { useState } from 'react';

interface GlitchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'yellow' | 'black' | 'sage' | 'red' | 'white';
  glitchHover?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const GlitchButton: React.FC<GlitchButtonProps> = ({
  children,
  variant = 'yellow',
  glitchHover = true,
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const variantStyles = {
    yellow:
      'bg-[#FFDE00] text-black hover:bg-black hover:text-[#FFDE00] shadow-[4px_4px_0px_0px_#000000]',
    black:
      'bg-black text-white hover:bg-[#FFDE00] hover:text-black shadow-[4px_4px_0px_0px_#8A9A5B]',
    sage:
      'bg-[#8A9A5B] text-black hover:bg-black hover:text-[#8A9A5B] shadow-[4px_4px_0px_0px_#000000]',
    red:
      'bg-[#FF3333] text-white hover:bg-black hover:text-[#FF3333] shadow-[4px_4px_0px_0px_#000000]',
    white:
      'bg-white text-black hover:bg-black hover:text-white shadow-[4px_4px_0px_0px_#000000]',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs font-mono uppercase tracking-wider',
    md: 'px-6 py-3.5 text-sm md:text-base font-mono uppercase tracking-wider font-bold',
    lg: 'px-8 py-5 text-base md:text-lg font-heading uppercase tracking-wide',
  };

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
      className={`
        relative inline-flex items-center justify-center
        border-4 border-black rounded-none transition-all duration-150
        active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
        cursor-pointer select-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${isHovered && glitchHover ? 'animate-glitch' : ''}
        ${className}
      `}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {/* Glitch color artifacts on hover */}
      {isHovered && glitchHover && (
        <>
          <span
            aria-hidden
            className="absolute inset-0 bg-[#FF3333] opacity-20 pointer-events-none translate-x-[2px] -translate-y-[2px]"
          />
          <span
            aria-hidden
            className="absolute inset-0 bg-[#8A9A5B] opacity-20 pointer-events-none -translate-x-[2px] translate-y-[2px]"
          />
        </>
      )}
    </button>
  );
};
