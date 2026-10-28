'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Droplets, Zap, ShieldAlert, Check, TrendingDown, ArrowUpRight } from 'lucide-react';
import { ScrollSequenceSection } from '@/components/ScrollSequenceSection';
import { Preloader } from '@/components/Preloader';
import { Marquee } from '@/components/Marquee';
import { GlitchButton } from '@/components/GlitchButton';
import { B2BModal } from '@/components/B2BModal';
import { useCart, defaultProduct } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';

export default function HomePage() {
  const [loadProgress, setLoadProgress] = useState(0);
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false);
  const [b2bModalOpen, setB2bModalOpen] = useState(false);
  const { addItem } = useCart();

  // Interactive savings calculator state
  const [dailyDishes, setDailyDishes] = useState(400);

  // Calculation metrics
  const standardCostPerWash = 3.2; // ₹ per wash
  const dccCostPerWash = 0.84; // ₹ per wash
  const dailyStandardSpend = dailyDishes * standardCostPerWash;
  const dailyDccSpend = dailyDishes * dccCostPerWash;
  const annualSavings = Math.round((dailyStandardSpend - dailyDccSpend) * 365);
  const plasticSavedKg = Math.round((dailyDishes * 365 * 0.015) / 10);

  return (
    <>
      {/* Full-screen Preloader linked to actual image buffer */}
      <Preloader
        progress={loadProgress}
        isLoaded={isAssetsLoaded}
      />

      {/* 300vh Sticky Center Scroll Sequence */}
      <ScrollSequenceSection
        onProgress={(p) => setLoadProgress(p)}
        onLoaded={() => setIsAssetsLoaded(true)}
        onOpenB2B={() => setB2bModalOpen(true)}
      />

      {/* Marquee Banner Section */}
      <Marquee
        text="100% BIO-BASED ✦ BATCH VERIFIED ✦ pH 7.3 ✦ MADE IN PUNE ✦ 0% SYNTHETIC SULFATES ✦ TRIPLE-ENZYME COMPLEX ✦ ZERO RESIDUE ✦"
        variant="sage"
      />

      {/* Features Section (01, 02, 03) */}
      <section id="features" className="py-16 md:py-24 bg-white border-b-4 border-black select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="border-b-4 border-black pb-8 mb-12">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#FF3333] uppercase mb-2">
              <span>● TECHNICAL ARCHITECTURE</span>
              <span>//</span>
              <span>NO TRADE SECRETS</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl uppercase tracking-tighter">
              WHY TRADITIONAL BLUE SOAP IS OBSOLETE.
            </h2>
            <p className="font-mono text-sm sm:text-base text-neutral-600 max-w-2xl mt-2">
              Most dishwashing liquids contain 80% water and caustic petrochemical foaming agents (SLS/SLES) that burn hands and strip plumbing. Here is how DCC replaces chemical friction with biological digestion.
            </p>
          </div>

          {/* 3 Brutalist Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 01: Enzyme Tech */}
            <div className="border-4 border-black p-6 sm:p-8 bg-[#F4F4F0] flex flex-col justify-between shadow-[8px_8px_0px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="font-heading text-5xl sm:text-6xl text-black">
                    01
                  </span>
                  <span className="bg-black text-[#FFDE00] px-2 py-1 font-mono text-xs font-bold uppercase">
                    BIOCATALYSIS
                  </span>
                </div>
                <h3 className="font-heading text-xl sm:text-2xl uppercase tracking-tight mb-3">
                  TRIPLE-ENZYME ACTIVE MATRIX
                </h3>
                <p className="font-mono text-xs sm:text-sm text-neutral-700 leading-relaxed mb-6">
                  Biological enzymes do not scrub; they dissolve. DCC blends targeted <span className="font-bold text-black">Protease</span> (hydrolyzes burnt proteins & egg stains), <span className="font-bold text-black">Amylase</span> (liquefies baked starches & gravies), and <span className="font-bold text-black">Lipase</span> (chops fats into water-soluble glycerol).
                </p>
              </div>

              <div className="border-t-2 border-black pt-4 font-mono text-xs text-neutral-600 space-y-1">
                <div className="flex justify-between">
                  <span>ACTIVATION TEMP:</span>
                  <span className="font-bold text-black">20°C - 65°C</span>
                </div>
                <div className="flex justify-between">
                  <span>RESIDUE RATING:</span>
                  <span className="font-bold text-[#8A9A5B]">0.00% PPM</span>
                </div>
              </div>
            </div>

            {/* 02: Sheeting Polymer */}
            <div className="border-4 border-black p-6 sm:p-8 bg-[#8A9A5B]/15 flex flex-col justify-between shadow-[8px_8px_0px_0px_#8A9A5B] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="font-heading text-5xl sm:text-6xl text-black">
                    02
                  </span>
                  <span className="bg-[#8A9A5B] text-black px-2 py-1 font-mono text-xs font-bold uppercase border-2 border-black">
                    SURFACE PHYSICS
                  </span>
                </div>
                <h3 className="font-heading text-xl sm:text-2xl uppercase tracking-tight mb-3">
                  RAPID SHEETING POLYMER
                </h3>
                <p className="font-mono text-xs sm:text-sm text-neutral-700 leading-relaxed mb-6">
                  Hard water minerals in Pune cause ugly white chalk rings on glassware and cutlery. Our bio-derived hydrophilic sheeting agent drops surface tension to 24 mN/m, causing rinse water to sheet off in seconds rather than beading. Cuts drying towel cycles by 60%.
                </p>
              </div>

              <div className="border-t-2 border-black pt-4 font-mono text-xs text-neutral-600 space-y-1">
                <div className="flex justify-between">
                  <span>WATER SPOTTING:</span>
                  <span className="font-bold text-black">ZERO SPOTS</span>
                </div>
                <div className="flex justify-between">
                  <span>DRYING REDUCTION:</span>
                  <span className="font-bold text-[#8A9A5B]">-60% TIME</span>
                </div>
              </div>
            </div>

            {/* 03: Cost Efficiency */}
            <div className="border-4 border-black p-6 sm:p-8 bg-[#FFDE00]/20 flex flex-col justify-between shadow-[8px_8px_0px_0px_#FFDE00] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="font-heading text-5xl sm:text-6xl text-black">
                    03
                  </span>
                  <span className="bg-[#FFDE00] text-black px-2 py-1 font-mono text-xs font-bold uppercase border-2 border-black">
                    UNIT ECONOMICS
                  </span>
                </div>
                <h3 className="font-heading text-xl sm:text-2xl uppercase tracking-tight mb-3">
                  COST-PER-WASH ARBITRAGE
                </h3>
                <p className="font-mono text-xs sm:text-sm text-neutral-700 leading-relaxed mb-6">
                  Commercial kitchens throw away money on watery blue detergents that require 3 pumps per sink. DCC is an ultra-concentrated gel: <span className="font-bold text-black">just 5ml washes 20+ heavy commercial plates</span>. Costs just ₹0.84 per wash compared to ₹3.20 industry average.
                </p>
              </div>

              <div className="border-t-2 border-black pt-4 font-mono text-xs text-neutral-600 space-y-1">
                <div className="flex justify-between">
                  <span>COST PER WASH:</span>
                  <span className="font-bold text-black">₹0.84</span>
                </div>
                <div className="flex justify-between">
                  <span>CHEMICAL SAVINGS:</span>
                  <span className="font-bold text-[#FF3333]">73% LOWER</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Savings Calculator for Restaurants & Kitchens */}
      <section className="bg-black text-white py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-black font-mono">
        <div className="max-w-5xl mx-auto border-4 border-white p-6 sm:p-10 bg-[#111111] shadow-[10px_10px_0px_0px_#FFDE00]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-neutral-700 pb-6 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#FFDE00] uppercase mb-1">
                <TrendingDown className="w-4 h-4" />
                <span>FINANCIAL AUDIT ENGINE</span>
              </div>
              <h3 className="font-heading text-2xl sm:text-4xl uppercase text-white tracking-tight">
                CALCULATE YOUR ANNUAL CHEMICAL LEAKAGE
              </h3>
            </div>
            <div className="bg-[#8A9A5B] text-black px-3 py-1 font-bold text-xs uppercase">
              PUNE BENCHMARK
            </div>
          </div>

          {/* Slider input */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <label htmlFor="dish-volume-range" className="font-bold text-sm uppercase text-neutral-300">
                Daily Dishwashing Volume:
              </label>
              <span className="font-heading text-2xl text-[#FFDE00]">
                {dailyDishes} DISHES / DAY
              </span>
            </div>
            <input
              id="dish-volume-range"
              type="range"
              min="50"
              max="2500"
              step="50"
              value={dailyDishes}
              onChange={(e) => setDailyDishes(Number(e.target.value))}
              className="w-full h-3 bg-neutral-800 accent-[#FFDE00] border border-white cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
              <span>50 (HOME / CAFE)</span>
              <span>1000 (BUSY RESTAURANT)</span>
              <span>2500 (COMMERCIAL / HOTEL)</span>
            </div>
          </div>

          {/* Output metrics grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="border-2 border-white p-4 bg-black">
              <span className="text-[10px] text-neutral-400 block uppercase">Standard Chemical Cost</span>
              <span className="font-heading text-xl text-neutral-400">
                {formatCurrency(Math.round(dailyStandardSpend * 365))} / yr
              </span>
              <span className="text-[10px] text-neutral-600 block mt-1">@ ₹3.20/wash</span>
            </div>

            <div className="border-2 border-[#8A9A5B] p-4 bg-black">
              <span className="text-[10px] text-[#8A9A5B] block uppercase font-bold">DCC Bio-Enzymatic Cost</span>
              <span className="font-heading text-xl text-[#8A9A5B]">
                {formatCurrency(Math.round(dailyDccSpend * 365))} / yr
              </span>
              <span className="text-[10px] text-neutral-400 block mt-1">@ ₹0.84/wash</span>
            </div>

            <div className="border-2 border-[#FFDE00] p-4 bg-[#FFDE00] text-black">
              <span className="text-[10px] font-bold block uppercase">Net Annual Cash Savings</span>
              <span className="font-heading text-2xl sm:text-3xl text-black">
                {formatCurrency(annualSavings)}
              </span>
              <span className="text-[10px] font-bold block mt-1">
                + {plasticSavedKg} KG PLASTIC ELIMINATED
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-neutral-700 pt-6">
            <p className="text-xs text-neutral-400">
              Want our engineers to verify this calculation on your kitchen rinse line?
            </p>
            <button
              onClick={() => setB2bModalOpen(true)}
              className="bg-[#FFDE00] text-black border-2 border-white px-6 py-3 font-bold uppercase text-xs hover:bg-white hover:text-black transition-colors"
            >
              BOOK 10-MIN ON-SITE AUDIT →
            </button>
          </div>
        </div>
      </section>

      {/* Comparison Matrix Section */}
      <section className="py-16 bg-[#F4F4F0] border-b-4 border-black select-none font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl sm:text-4xl uppercase tracking-tighter mb-2">
              FORMULATION BENCHMARK
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600">
              Head-to-head comparison against market-leading commercial blue detergents.
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border-4 border-black bg-white shadow-[8px_8px_0px_0px_#000]">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b-4 border-black bg-black text-white font-mono uppercase">
                  <th className="p-4 border-r-2 border-white">PARAMETER</th>
                  <th className="p-4 border-r-2 border-white bg-[#FFDE00] text-black font-heading text-base">
                    DCC BIO-ENZYMATIC
                  </th>
                  <th className="p-4 text-neutral-400">TRADITIONAL BLUE SOAPS</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                <tr>
                  <td className="p-4 font-bold border-r-2 border-black bg-neutral-50">
                    Active Cleaning Mechanism
                  </td>
                  <td className="p-4 font-bold text-black border-r-2 border-black bg-[#8A9A5B]/15">
                    Biological Enzyme Cleaving (Protease, Amylase, Lipase)
                  </td>
                  <td className="p-4 text-neutral-600">
                    Synthetic Petrochemical Sulfates (SLS / SLES)
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold border-r-2 border-black bg-neutral-50">
                    pH Level & Hand Safety
                  </td>
                  <td className="p-4 font-bold text-black border-r-2 border-black bg-[#8A9A5B]/15">
                    pH 7.3 (Neutral, Skin Barrier Safe, No Dermatitis)
                  </td>
                  <td className="p-4 text-[#FF3333]">
                    pH 9.5 - 11.5 (Caustic Alkaline, Causes Hand Cracking)
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold border-r-2 border-black bg-neutral-50">
                    Water Sheeting & Spots
                  </td>
                  <td className="p-4 font-bold text-black border-r-2 border-black bg-[#8A9A5B]/15">
                    Bio-sheeting polymer (Zero mineral chalking)
                  </td>
                  <td className="p-4 text-neutral-600">
                    Heavy water spots; requires extra rinse aid agent
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold border-r-2 border-black bg-neutral-50">
                    Cost Per 20-Plate Wash
                  </td>
                  <td className="p-4 font-bold text-black border-r-2 border-black bg-[#8A9A5B]/15">
                    ₹0.84 (Ultra-concentrated 5ml dose)
                  </td>
                  <td className="p-4 text-[#FF3333]">
                    ₹3.20 (Diluted water filler formulation)
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold border-r-2 border-black bg-neutral-50">
                    Drainage Pipe Odor & Build-up
                  </td>
                  <td className="p-4 font-bold text-black border-r-2 border-black bg-[#8A9A5B]/15">
                    Enzymes keep digesting grease in grease trap lines
                  </td>
                  <td className="p-4 text-neutral-600">
                    Congeals into foul fatbergs; requires chemical drain unblockers
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* B2B Restaurant CTA Section */}
      <section id="b2b" className="py-20 bg-[#FFDE00] border-b-4 border-black select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-4 border-black p-8 sm:p-14 bg-white shadow-[12px_12px_0px_0px_#000000]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 bg-black text-[#FFDE00] px-3 py-1 font-mono text-xs font-bold uppercase">
                  <span>● COMMERCIAL PROGRAM</span>
                  <span>//</span>
                  <span>PUNE KITCHENS</span>
                </div>

                <h2 className="font-heading text-3xl sm:text-5xl uppercase tracking-tighter leading-tight text-black">
                  ARE YOU A RESTAURANT? <br />
                  GET A FREE 10-MINUTE KITCHEN SWAP.
                </h2>

                <p className="font-mono text-sm sm:text-base text-neutral-700 leading-relaxed max-w-2xl">
                  We bring our mobile titration kit to your kitchen anywhere in Pune. We test your current dish rinse, wash 10 greasy kadhais side-by-side, and calculate your exact savings. No contract, no sales pitch. Free 5L Jerrycan included for testing.
                </p>

                <div className="flex flex-wrap gap-4 pt-2 font-mono text-xs font-bold text-neutral-800">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#8A9A5B] stroke-[3]" />
                    <span>ZERO SHUTDOWN TIME</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#8A9A5B] stroke-[3]" />
                    <span>FREE 5L CAN ALLOCATED</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#8A9A5B] stroke-[3]" />
                    <span>DIRECT CHEF TRAINING</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-4">
                <a
                  href="https://wa.me/918421488557?text=Hey%20DCC%20Team,%20I%20want%20to%20book%20a%20Free%2010-Minute%20Kitchen%20Swap"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-black border-4 border-black p-5 font-mono text-sm md:text-base font-bold uppercase hover:bg-black hover:text-[#25D366] transition-colors flex items-center justify-center gap-3 shadow-[6px_6px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px]"
                >
                  <span>WHATSAPP INSTANT SWAP</span>
                  <ArrowRight className="w-5 h-5" />
                </a>

                <button
                  onClick={() => setB2bModalOpen(true)}
                  className="bg-black text-white border-4 border-black p-4 font-mono text-xs md:text-sm font-bold uppercase hover:bg-[#FFDE00] hover:text-black transition-colors cursor-pointer"
                >
                  OR FILL ON-SITE BOOKING FORM →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global B2B Lead Modal */}
      <B2BModal isOpen={b2bModalOpen} onClose={() => setB2bModalOpen(false)} />
    </>
  );
}
