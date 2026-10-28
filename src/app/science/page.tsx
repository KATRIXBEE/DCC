'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Play, Volume2, Sparkles, Activity, FileText, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { GlitchButton } from '@/components/GlitchButton';
import { Marquee } from '@/components/Marquee';

export default function SciencePage() {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const [testPh, setTestPh] = useState(7.3);

  // ASMR Reels mock data
  const asmrReels = [
    {
      id: 1,
      title: 'ASMR // HIGH-VISCOSITY ENZYME DRIP',
      tag: 'VISCOSITY 0.18X',
      duration: '0:42',
      audioSpec: '48kHz Stereo Binaural',
      description:
        'Listening to the slow, heavy drip of the calibrated bio-polymer matrix into reverse-osmosis Deccan aquifer water. Zero synthetic thickening gums.',
      color: '#FFDE00',
    },
    {
      id: 2,
      title: 'ASMR // PHENOLPHTHALEIN pH 7.3 TITRATION',
      tag: 'BUFFER TEST',
      duration: '1:15',
      audioSpec: 'Droplet Impact Micro-Audio',
      description:
        'Precise drop-by-drop titration measuring skin neutrality. Notice zero pink color change — confirming 100% absence of caustic lye/sodium hydroxide.',
      color: '#8A9A5B',
    },
    {
      id: 3,
      title: 'ASMR // RAPID SHEETING HYDRODYNAMICS',
      tag: 'SURFACE TENSION',
      duration: '0:38',
      audioSpec: 'Water Sheeting Flow',
      description:
        'Water flowing over a restaurant wine glass. Water sheets off like a monolithic curtain in 3.2 seconds without leaving a single mineral drop.',
      color: '#FF3333',
    },
    {
      id: 4,
      title: 'ASMR // 60-SECOND KADHAI GREASE MELT',
      tag: 'LIPASE REACTION',
      duration: '1:02',
      audioSpec: 'Micro-Effervescence',
      description:
        'Microphone submerged beside a burnt ghee crust on iron kadhai. Triple enzymes cleaving carbonized grease at room temperature without wire scrubbing.',
      color: '#000000',
    },
  ];

  // pH interpretation logic
  const getPhEffect = (val: number) => {
    if (val < 4) {
      return {
        label: 'HIGHLY ACIDIC // CORROSIVE',
        skin: 'Severe chemical burn to keratin layer',
        cutlery: 'Etches stainless steel and silver',
        dccVerdict: 'DANGEROUS // NOT DCC',
        color: '#FF3333',
      };
    }
    if (val >= 4 && val < 6.5) {
      return {
        label: 'MILDLY ACIDIC',
        skin: 'Tolerable short term, strips natural sebum oils',
        cutlery: 'Ineffective against animal fats',
        dccVerdict: 'LOW GREASE CAPACITY',
        color: '#FF9900',
      };
    }
    if (val >= 6.5 && val <= 8.0) {
      return {
        label: 'NEUTRAL SWEET SPOT // DCC pH 7.3',
        skin: '100% Skin Barrier Safe. Zero eczema/dermatitis flare-ups.',
        cutlery: 'Flawless sheeting. Protects chef knives and glassware luster.',
        dccVerdict: 'OPTIMAL ENZYME STABILITY (PROTEASE/AMYLASE/LIPASE)',
        color: '#8A9A5B',
      };
    }
    if (val > 8.0 && val <= 11) {
      return {
        label: 'ALKALINE // COMMERCIAL BLUE SOAPS',
        skin: 'Dissolves skin mantle. Causes cracked, bleeding hands.',
        cutlery: 'Leaves chalky silicate residue without rinse-aid.',
        dccVerdict: 'CONVENTIONAL DETERGENT (CAUSTIC)',
        color: '#FF3333',
      };
    }
    return {
      label: 'HEAVY CAUSTIC // INDUSTRIAL BLEACH',
      skin: 'Immediate chemical peeling and necrosis',
      cutlery: 'Destroys non-stick coatings and glaze',
      dccVerdict: 'HAZARDOUS CHEMICAL',
      color: '#FF0000',
    };
  };

  const phEffect = getPhEffect(testPh);

  return (
    <div className="bg-white min-h-screen select-none font-mono">
      {/* Hero Header */}
      <section className="border-b-4 border-black bg-black text-white p-8 sm:p-14">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#FFDE00] text-black px-3 py-1 font-mono text-xs font-bold uppercase mb-4">
            <span>● BUILD IN PUBLIC ARCHIVE</span>
            <span>//</span>
            <span>PUNE LAB</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tighter text-white mb-4 leading-none">
            OPEN-SOURCE <br />
            <span className="text-[#8A9A5B]">CLEANING</span> BIOCHEMISTRY.
          </h1>

          <p className="font-mono text-sm sm:text-base text-neutral-400 max-w-3xl leading-relaxed">
            Commercial cleaning companies hide toxic formulations behind proprietary trade secrets and synthetic perfume. We publish our titration results, stability curves, raw batch numbers, and testing ASMR reels for anyone to inspect.
          </p>

          <div className="flex flex-wrap gap-4 mt-8 font-mono text-xs font-bold">
            <div className="bg-neutral-900 border-2 border-white px-4 py-2">
              <span className="text-neutral-500 block text-[10px]">CURRENT FORMULATION</span>
              <span className="text-[#FFDE00]">V2.4 (BATCH 001)</span>
            </div>
            <div className="bg-neutral-900 border-2 border-white px-4 py-2">
              <span className="text-neutral-500 block text-[10px]">ENZYME REACTION RATE</span>
              <span className="text-[#8A9A5B]">1,400 BONDS / SEC</span>
            </div>
            <div className="bg-neutral-900 border-2 border-white px-4 py-2">
              <span className="text-neutral-500 block text-[10px]">BIODEGRADABILITY</span>
              <span className="text-white">99.4% (OECD 301B)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <Marquee text="OPEN BIOCHEMISTRY ✦ ZERO TRADE SECRETS ✦ ASMR LAB REELS ✦ BATCH VERIFIED ✦ pH 7.3 SWEET SPOT ✦" variant="yellow" />

      {/* Section 1: ASMR Formulation & Testing Reels */}
      <section className="py-16 md:py-24 border-b-4 border-black bg-[#F4F4F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b-4 border-black pb-6 mb-12 flex flex-col md:flex-row justify-between md:items-end gap-4">
            <div>
              <span className="text-xs font-bold uppercase text-[#FF3333]">
                AUDIOVISUAL TELEMETRY
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl uppercase tracking-tighter">
                ASMR FORMULATION & TESTING REELS
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-md">
              High-fidelity audio captures from our Pune batching vats and microscopic enzyme substrate baths.
            </p>
          </div>

          {/* Video / Reel Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {asmrReels.map((reel) => (
              <div
                key={reel.id}
                className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_#000000] flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span
                      className="px-2.5 py-1 text-xs font-bold uppercase border-2 border-black"
                      style={{ backgroundColor: reel.color, color: reel.id === 4 ? '#fff' : '#000' }}
                    >
                      {reel.tag}
                    </span>
                    <span className="text-xs text-neutral-500 font-bold">
                      {reel.duration} // {reel.audioSpec}
                    </span>
                  </div>

                  {/* Simulated Video Player Screen */}
                  <div
                    onClick={() => setActiveVideo(activeVideo === reel.id ? null : reel.id)}
                    className="relative aspect-video bg-black border-4 border-black flex items-center justify-center cursor-pointer group overflow-hidden mb-4"
                  >
                    {/* Background audio wave bars */}
                    <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-25 px-8">
                      {Array.from({ length: 32 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 bg-[#FFDE00] transition-all"
                          style={{
                            height: activeVideo === reel.id ? `${20 + Math.sin(i) * 60}%` : `${15 + (i % 5) * 12}%`,
                          }}
                        />
                      ))}
                    </div>

                    {/* Play button */}
                    <div className="relative z-10 w-16 h-16 bg-[#FFDE00] border-4 border-black flex items-center justify-center group-hover:scale-110 transition-transform shadow-[4px_4px_0px_0px_#000]">
                      {activeVideo === reel.id ? (
                        <Volume2 className="w-8 h-8 text-black animate-pulse" />
                      ) : (
                        <Play className="w-8 h-8 text-black fill-black ml-1" />
                      )}
                    </div>

                    <div className="absolute bottom-3 left-3 bg-black/80 text-white px-2 py-0.5 text-[10px] border border-white">
                      {activeVideo === reel.id ? 'NOW STREAMING STEREO AUDIO' : 'CLICK TO PREVIEW ASMR AUDIO'}
                    </div>
                  </div>

                  <h3 className="font-heading text-lg sm:text-xl uppercase tracking-tight mb-2">
                    {reel.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed mb-4">
                    {reel.description}
                  </p>
                </div>

                <div className="border-t-2 border-black pt-3 flex justify-between items-center text-xs">
                  <a
                    href="https://instagram.com/katrixbee"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 font-bold text-black hover:text-[#FF3333] transition-colors"
                  >
                    <span>WATCH FULL REEL ON @KATRIXBEE</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <span className="text-neutral-400">PUNE R&D LOG</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Interactive pH Testing Lab Simulator */}
      <section className="py-16 md:py-24 border-b-4 border-black bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-4 border-black p-6 sm:p-12 shadow-[12px_12px_0px_0px_#8A9A5B] bg-[#FAFAF8]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#8A9A5B] uppercase mb-2">
              <Activity className="w-4 h-4" />
              <span>LAB TESTING SIMULATOR</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-5xl uppercase tracking-tighter mb-4">
              WHY pH 7.3 IS THE GOLDILOCKS FREQUENCY
            </h2>

            <p className="text-xs sm:text-sm text-neutral-600 mb-8 max-w-2xl">
              Traditional dish detergents boost pH above 10 using lye (NaOH) to saponify grease. This caustic alkali strips the moisture barrier of your skin, causing chef dermatitis. DCC keeps the pH at human skin neutrality (7.3) while using biological enzymes to cleave grease.
            </p>

            {/* Slider */}
            <div className="mb-8 p-6 border-4 border-black bg-white shadow-[4px_4px_0px_0px_#000]">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-sm uppercase">CALIBRATE pH VALUE:</span>
                <span
                  className="font-heading text-3xl px-3 py-1 border-2 border-black"
                  style={{ backgroundColor: phEffect.color, color: testPh < 8 ? '#000' : '#fff' }}
                >
                  pH {testPh.toFixed(1)}
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="14"
                step="0.1"
                value={testPh}
                onChange={(e) => setTestPh(parseFloat(e.target.value))}
                className="w-full h-4 bg-gradient-to-r from-red-500 via-green-500 to-purple-600 border-2 border-black cursor-pointer appearance-none"
              />

              <div className="flex justify-between text-[10px] font-bold text-neutral-500 mt-2">
                <span>0.0 (BATTERY ACID)</span>
                <span className="text-[#8A9A5B]">7.3 (DCC NEUTRAL)</span>
                <span>10.5 (BLUE DETERGENT)</span>
                <span>14.0 (DRAIN LYE)</span>
              </div>
            </div>

            {/* Live readout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-2 border-black p-4 bg-white text-xs">
              <div>
                <span className="text-[10px] text-neutral-500 block uppercase">CHEMICAL CLASSIFICATION</span>
                <span className="font-bold text-sm" style={{ color: phEffect.color }}>
                  {phEffect.label}
                </span>
              </div>
              <div className="border-t-2 md:border-t-0 md:border-l-2 border-black/20 pt-2 md:pt-0 md:pl-4">
                <span className="text-[10px] text-neutral-500 block uppercase">IMPACT ON HUMAN HANDS</span>
                <span className="font-bold text-neutral-900">{phEffect.skin}</span>
              </div>
              <div className="border-t-2 md:border-t-0 md:border-l-2 border-black/20 pt-2 md:pt-0 md:pl-4">
                <span className="text-[10px] text-neutral-500 block uppercase">DCC LAB CONCLUSION</span>
                <span className="font-bold text-neutral-900">{phEffect.dccVerdict}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Pune Build-in-Public Logbook */}
      <section className="py-16 md:py-24 border-b-4 border-black bg-black text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b-4 border-white pb-6 mb-12">
            <span className="text-xs font-bold uppercase text-[#FFDE00]">
              CHRONOLOGICAL ENGINEERING LOGBOOK
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl uppercase tracking-tighter text-white">
              PUNE R&D FORMULATION CHANGELOG
            </h2>
          </div>

          <div className="space-y-6 font-mono text-xs sm:text-sm">
            {/* Log 03 */}
            <div className="border-4 border-white p-6 bg-[#111111] shadow-[6px_6px_0px_0px_#8A9A5B]">
              <div className="flex justify-between items-center border-b border-neutral-700 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="bg-[#8A9A5B] text-black px-2 py-0.5 font-bold">
                    RELEASE BATCH 001
                  </span>
                  <span className="text-neutral-400">STATUS: PRODUCTION ACTIVE</span>
                </div>
                <span className="text-neutral-500">PUNE LAB // OCT 2026</span>
              </div>
              <h4 className="font-heading text-lg sm:text-xl uppercase text-white mb-2">
                COMMERCIAL KITCHEN STRESS TEST PASSED // 500L MASTER RUN
              </h4>
              <p className="text-neutral-300 leading-relaxed mb-4">
                Tested against 4 commercial restaurant kitchens in Koregaon Park and FC Road. Washed over 3,200 heavy grease dishes across 7 days. Dishwashing staff reported zero hand irritation or dryness. Cut hot water consumption by 35% since enzymes function at 25°C tap water.
              </p>
              <div className="flex gap-4 text-[11px] text-[#FFDE00]">
                <span>✓ Zero Water Spotting on Glassware</span>
                <span>✓ 5ml Dosage Verified</span>
                <span>✓ Ready for Public Dispatch</span>
              </div>
            </div>

            {/* Log 02 */}
            <div className="border-4 border-neutral-700 p-6 bg-[#111111]">
              <div className="flex justify-between items-center border-b border-neutral-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="bg-neutral-800 text-white px-2 py-0.5 font-bold">
                    PATCH 000.4
                  </span>
                  <span className="text-neutral-500">HEAT STABILITY AUDIT</span>
                </div>
                <span className="text-neutral-500">PUNE LAB // AUG 2026</span>
              </div>
              <h4 className="font-heading text-base sm:text-lg uppercase text-white mb-2">
                THERMAL STABILIZATION IN DECCAN SUMMER STORAGE
              </h4>
              <p className="text-neutral-400 leading-relaxed">
                Problem: Protease enzyme activity degraded by 18% when stored above 42°C in non-air-conditioned delivery vans. Fix: Incorporated plant-derived bio-polyols that shield the enzyme molecular folding structure. Tested up to 55°C for 30 consecutive days with zero denaturation.
              </p>
            </div>

            {/* Log 01 */}
            <div className="border-4 border-neutral-700 p-6 bg-[#111111]">
              <div className="flex justify-between items-center border-b border-neutral-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="bg-neutral-800 text-white px-2 py-0.5 font-bold">
                    PATCH 000.1
                  </span>
                  <span className="text-neutral-500">HARD WATER FAILURE</span>
                </div>
                <span className="text-neutral-500">PUNE LAB // JUN 2026</span>
              </div>
              <h4 className="font-heading text-base sm:text-lg uppercase text-white mb-2">
                PUNE BOREWELL WATER (450 PPM TDS) WHITE RESIDUE
              </h4>
              <p className="text-neutral-400 leading-relaxed">
                Initial batch left micro calcium rings on black ceramic plates. Eliminated sodium-based builders and synthesized a biodegradable bio-polymer sheeting agent that forces water to sheet off before droplets evaporate. Result: 100% spot-free drying.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/shop">
              <GlitchButton variant="yellow" size="lg">
                TEST BATCH 001 IN YOUR SINK [₹169] →
              </GlitchButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
