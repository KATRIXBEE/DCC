'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, Instagram, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { GlitchButton } from './GlitchButton';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
  };

  return (
    <footer className="bg-black text-white border-t-4 border-black select-none">
      {/* Top Banner strip */}
      <div className="border-b-4 border-white bg-[#FFDE00] text-black px-6 py-4 flex flex-col md:flex-row justify-between items-center font-mono text-xs md:text-sm font-bold gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#FF3333] animate-ping" />
          <span>BATCH 001 NOW DISPATCHING WORLDWIDE FROM PUNE</span>
        </div>
        <div className="flex items-center gap-4">
          <span>pH: 7.3 ± 0.1</span>
          <span>•</span>
          <span>DILUTION: 1:40</span>
          <span>•</span>
          <span className="bg-black text-[#FFDE00] px-2 py-0.5">UPI: kartik8855@fam</span>
        </div>
      </div>

      {/* Main 4-column brutalist grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-b-4 border-white">
        {/* Col 1: Brand & Origin */}
        <div className="p-8 border-b-4 md:border-b-0 md:border-r-4 border-white flex flex-col justify-between space-y-6">
          <div>
            <div className="inline-block bg-white text-black px-3 py-1 font-heading text-3xl mb-4 border-2 border-white">
              DCC
            </div>
            <h3 className="font-heading text-xl uppercase tracking-tight text-white mb-2">
              DECCAN CLEAN TECH
            </h3>
            <p className="font-mono text-xs text-neutral-400 leading-relaxed">
              Engineering biological enzyme formulations to replace caustic commercial dishwashing chemicals. Zero synthetic sulfates, zero petrochemical residue.
            </p>
          </div>

          <div className="font-mono text-xs text-neutral-400 space-y-1 border-t border-neutral-800 pt-4">
            <p className="text-[#8A9A5B] font-bold">R&D FACILITY // PUNE, IN</p>
            <p>18.5204° N, 73.8567° E</p>
            <p className="text-[10px] text-neutral-500">ISO 9001:2015 AUDITED STANDARDS</p>
          </div>
        </div>

        {/* Col 2: Direct Contact Channels */}
        <div className="p-8 border-b-4 md:border-b-0 lg:border-r-4 border-white space-y-6 font-mono text-xs">
          <div className="text-[#FFDE00] font-bold tracking-widest uppercase border-b border-neutral-800 pb-2">
            [ VERIFIED CHANNELS ]
          </div>

          <div className="space-y-4">
            {/* Email */}
            <div className="group">
              <span className="text-neutral-500 block text-[10px] uppercase">Official Lab Dispatch</span>
              <a
                href="mailto:katrixbee@gmail.com"
                className="flex items-center gap-2 text-sm font-bold text-white group-hover:text-[#FFDE00] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#FFDE00]" />
                <span>katrixbee@gmail.com</span>
              </a>
            </div>

            {/* Phone */}
            <div className="group">
              <span className="text-neutral-500 block text-[10px] uppercase">Pune Engineering Helpline</span>
              <a
                href="tel:+918421488557"
                className="flex items-center gap-2 text-sm font-bold text-white group-hover:text-[#FFDE00] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#8A9A5B]" />
                <span>+91 84214 88557</span>
              </a>
            </div>

            {/* Instagram */}
            <div className="group">
              <span className="text-neutral-500 block text-[10px] uppercase">Build in Public & Reels</span>
              <a
                href="https://instagram.com/katrixbee"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-bold text-white group-hover:text-[#FF3333] transition-colors"
              >
                <Instagram className="w-4 h-4 text-[#FF3333]" />
                <span>@katrixbee</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* WhatsApp */}
            <div className="group">
              <span className="text-neutral-500 block text-[10px] uppercase">Instant B2B Chat</span>
              <a
                href="https://wa.me/918421488557"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-[#8A9A5B] hover:underline"
              >
                wa.me/918421488557 ↗
              </a>
            </div>
          </div>
        </div>

        {/* Col 3: Navigation Grid */}
        <div className="p-8 border-b-4 md:border-b-0 md:border-r-4 border-white space-y-6 font-mono text-xs">
          <div className="text-[#8A9A5B] font-bold tracking-widest uppercase border-b border-neutral-800 pb-2">
            [ SITEMAP & LAB DATA ]
          </div>

          <ul className="space-y-3 uppercase font-bold">
            <li>
              <Link href="/shop" className="hover:text-[#FFDE00] transition-colors flex items-center justify-between">
                <span>01. SHOP CONCENTRATE</span>
                <span className="text-neutral-500">₹169</span>
              </Link>
            </li>
            <li>
              <Link href="/science" className="hover:text-[#8A9A5B] transition-colors flex items-center justify-between">
                <span>02. SCIENCE & ASMR REELS</span>
                <span className="text-neutral-500">R&D</span>
              </Link>
            </li>
            <li>
              <Link href="/#features" className="hover:text-white transition-colors flex items-center justify-between">
                <span>03. TRIPLE ENZYME MATRIX</span>
                <span className="text-neutral-500">SPEC</span>
              </Link>
            </li>
            <li>
              <Link href="/#b2b" className="hover:text-[#FFDE00] transition-colors flex items-center justify-between">
                <span>04. RESTAURANT 10-MIN SWAP</span>
                <span className="text-[#FFDE00]">FREE</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Batch Alert Signup */}
        <div className="p-8 space-y-6 font-mono text-xs">
          <div className="text-[#FF3333] font-bold tracking-widest uppercase border-b border-neutral-800 pb-2">
            [ BATCH 002 RADAR ]
          </div>

          <p className="text-neutral-400">
            Sign up to receive raw lab titration reports, formulation patch updates, and priority allocation for upcoming batch releases.
          </p>

          {subscribed ? (
            <div className="bg-[#8A9A5B] text-black p-3 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>RADAR LOGGED: BATCH 002 NOTIFY</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                required
                placeholder="YOUR EMAIL..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full bg-neutral-900 border-2 border-white p-3 text-white focus:outline-none focus:border-[#FFDE00]"
              />
              <GlitchButton variant="yellow" size="sm" fullWidth type="submit">
                SUBSCRIBE TO LAB LOGS →
              </GlitchButton>
            </form>
          )}

          <p className="text-[10px] text-neutral-500 uppercase">
            No spam. No promotional fluff. Pure biochemistry notes.
          </p>
        </div>
      </div>

      {/* Bottom Sub-bar */}
      <div className="px-6 py-4 flex flex-col md:flex-row justify-between items-center font-mono text-xs text-neutral-500 gap-2">
        <div>
          © 2026 DECCAN CLEAN TECH (DCC) // ALL RIGHTS RESERVED.
        </div>
        <div className="flex gap-4 uppercase font-bold text-neutral-400">
          <span>BIO-ENZYMATIC</span>
          <span>•</span>
          <span>ZERO CAUSTIC ACIDS</span>
          <span>•</span>
          <span className="text-[#8A9A5B]">PUNE, MAHARASHTRA</span>
        </div>
      </div>
    </footer>
  );
};
