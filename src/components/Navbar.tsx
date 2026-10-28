'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, X, ArrowUpRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { B2BModal } from './B2BModal';

export const Navbar: React.FC = () => {
  const { totalItems, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [b2bModalOpen, setB2bModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b-4 border-black select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-stretch h-20">
            {/* Brand Logo */}
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center gap-3 group focus:outline-none"
              >
                <div className="bg-black text-white px-3 py-1 font-heading text-2xl md:text-3xl tracking-tighter group-hover:bg-[#FFDE00] group-hover:text-black transition-colors border-2 border-black">
                  DCC
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="font-heading text-xs tracking-tight uppercase leading-none">
                    DECCAN CLEAN TECH
                  </span>
                  <div className="flex items-center gap-1.5 mt-1 font-mono text-[10px] text-[#8A9A5B] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8A9A5B] animate-pulse" />
                    <span>PUNE LAB // BATCH 001</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-stretch font-mono text-sm uppercase font-bold tracking-wider">
              <Link
                href="/shop"
                className="flex items-center px-6 border-l-4 border-black hover:bg-[#FFDE00] transition-colors"
              >
                SHOP
              </Link>
              <Link
                href="/science"
                className="flex items-center px-6 border-l-4 border-black hover:bg-[#8A9A5B] hover:text-white transition-colors"
              >
                SCIENCE
              </Link>
              <button
                onClick={() => setB2bModalOpen(true)}
                className="flex items-center px-6 border-l-4 border-black hover:bg-black hover:text-[#FFDE00] transition-colors cursor-pointer"
              >
                B2B SWAP
              </button>
            </nav>

            {/* Right CTAs */}
            <div className="flex items-stretch">
              {/* Cart Button */}
              <button
                onClick={openCart}
                aria-label="Open dispatch cart"
                className="flex items-center gap-2 px-5 border-l-4 border-black bg-white hover:bg-neutral-100 transition-colors font-mono font-bold text-sm"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-black" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#FF3333] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {totalItems}
                    </span>
                  )}
                </div>
                <span className="hidden lg:inline">CART [{totalItems}]</span>
              </button>

              {/* Start a Project (Yellow Button) */}
              <div className="hidden sm:flex items-stretch border-l-4 border-black">
                <button
                  onClick={() => setB2bModalOpen(true)}
                  className="bg-[#FFDE00] text-black px-6 flex items-center gap-2 font-mono text-xs md:text-sm font-bold uppercase hover:bg-black hover:text-[#FFDE00] transition-colors cursor-pointer select-none"
                >
                  <span>START A PROJECT</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
                className="md:hidden flex items-center px-4 border-l-4 border-black hover:bg-neutral-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t-4 border-black bg-white font-mono text-sm font-bold uppercase divide-y-2 divide-black">
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-4 hover:bg-[#FFDE00]"
            >
              SHOP CONCENTRATE (₹169)
            </Link>
            <Link
              href="/science"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-4 hover:bg-[#8A9A5B]"
            >
              SCIENCE & LAB LOGS
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setB2bModalOpen(true);
              }}
              className="w-full text-left p-4 hover:bg-black hover:text-[#FFDE00] cursor-pointer"
            >
              B2B KITCHEN SWAP (FREE DEMO)
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setB2bModalOpen(true);
              }}
              className="w-full text-left p-4 bg-[#FFDE00] text-black font-bold cursor-pointer"
            >
              START A PROJECT →
            </button>
          </div>
        )}
      </header>

      {/* Global B2B Lead Modal */}
      <B2BModal isOpen={b2bModalOpen} onClose={() => setB2bModalOpen(false)} />
    </>
  );
};
