'use client';

import React, { useState } from 'react';
import { ShieldCheck, Plus, Minus, Check, ArrowRight, Sparkles, Droplet, Clock, Box } from 'lucide-react';
import { BottleAnimation } from '@/components/BottleAnimation';
import { GlitchButton } from '@/components/GlitchButton';
import { useCart, defaultProduct } from '@/context/CartContext';
import { RazorpayCheckoutModal } from '@/components/RazorpayCheckoutModal';
import { formatCurrency } from '@/lib/utils';
import { Marquee } from '@/components/Marquee';

export default function ShopPage() {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState('Single Bottle (500ml)');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'usage' | 'safety'>('ingredients');
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);

  // Variant pricing logic
  const variants = [
    {
      id: 'single',
      name: 'Single Bottle (500ml)',
      price: 169,
      originalPrice: 249,
      badge: 'POPULAR',
      doses: '100 Washes',
      savings: 'SAVE ₹80',
    },
    {
      id: 'pack3',
      name: '3x Kitchen Refill Pack (1.5L)',
      price: 469,
      originalPrice: 747,
      badge: 'BEST VALUE',
      doses: '300 Washes',
      savings: 'SAVE ₹278',
    },
    {
      id: 'can5l',
      name: '5L Commercial Jerrycan',
      price: 1299,
      originalPrice: 1999,
      badge: 'RESTAURANTS',
      doses: '1,000 Washes',
      savings: 'SAVE ₹700',
    },
  ];

  const currentVariantObj = variants.find((v) => v.name === selectedVariant) || variants[0];
  const currentPrice = currentVariantObj.price;
  const totalPrice = currentPrice * quantity;

  const handleAddToCart = () => {
    addItem(defaultProduct, quantity, selectedVariant);
  };

  const handleBuyNow = () => {
    setIsRazorpayOpen(true);
  };

  return (
    <div className="bg-white min-h-screen select-none font-mono">
      {/* Top Banner */}
      <div className="border-b-4 border-black bg-black text-white px-4 py-3 flex flex-wrap justify-between items-center text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#8A9A5B] animate-pulse" />
          <span className="font-bold text-[#FFDE00]">BATCH 001 ALLOCATION</span>
          <span>// DISPATCH TIME: 24 HOURS</span>
        </div>
        <div className="text-neutral-400">
          DELIVERY TO ALL PIN CODES IN INDIA
        </div>
      </div>

      {/* Main Two-Column Split Grid */}
      <div className="max-w-7xl mx-auto border-x-4 border-black grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-140px)]">
        {/* Left Column: Interactive 3D Bottle Viewer */}
        <div className="lg:col-span-6 p-6 sm:p-10 border-b-4 lg:border-b-0 lg:border-r-4 border-black flex flex-col justify-between bg-neutral-50">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="bg-[#FFDE00] text-black border-2 border-black px-2 py-0.5 text-xs font-bold uppercase">
                INTERACTIVE 3D CAD VIEWER
              </span>
              <span className="text-xs text-neutral-500 font-bold">
                105 FRAME SEQUENCE
              </span>
            </div>

            {/* Canvas Box */}
            <div className="relative border-4 border-black bg-white p-2 shadow-[8px_8px_0px_0px_#000000]">
              <BottleAnimation
                totalFrames={105}
                interactive={true}
                showHud={true}
                className="h-[460px] md:h-[520px]"
              />

              {/* Hotspot callouts */}
              <div className="hidden sm:block absolute top-6 right-6 bg-black text-white p-2 border-2 border-white text-[10px] pointer-events-none shadow-[2px_2px_0px_0px_#FFDE00]">
                <p className="font-bold text-[#FFDE00]">TAMPER-EVIDENT CAP</p>
                <p className="text-neutral-400">100% Recyclable HDPE</p>
              </div>

              <div className="hidden sm:block absolute bottom-8 left-6 bg-black text-white p-2 border-2 border-white text-[10px] pointer-events-none shadow-[2px_2px_0px_0px_#8A9A5B]">
                <p className="font-bold text-[#8A9A5B]">BIO-POLYMER MATRIX</p>
                <p className="text-neutral-400">Ultra-High Viscosity Gel</p>
              </div>
            </div>
          </div>

          {/* Under bottle specs */}
          <div className="mt-6 border-2 border-black p-4 bg-white grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <span className="text-[10px] text-neutral-500 block uppercase">ORIGIN</span>
              <span className="font-bold">PUNE, MH</span>
            </div>
            <div className="border-x-2 border-black">
              <span className="text-[10px] text-neutral-500 block uppercase">FORM</span>
              <span className="font-bold">ACTIVE GEL</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 block uppercase">TESTED pH</span>
              <span className="font-bold text-[#8A9A5B]">7.30 ± 0.05</span>
            </div>
          </div>
        </div>

        {/* Right Column: Product Commerce Details & Checkout */}
        <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-6">
          <div>
            {/* Header badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-black text-[#FFDE00] px-2.5 py-1 text-xs font-bold uppercase">
                OFFICIAL BATCH 001
              </span>
              <span className="bg-[#8A9A5B] text-black px-2.5 py-1 text-xs font-bold uppercase">
                IN STOCK & READY TO SHIP
              </span>
            </div>

            {/* Product Title */}
            <h1 className="font-heading text-3xl sm:text-5xl uppercase tracking-tighter text-black mb-2 leading-none">
              DCC BIO-DISHWASH CONCENTRATE
            </h1>
            <p className="font-mono text-xs sm:text-sm text-neutral-600 mb-6">
              Engineering grade bio-enzymatic dishwashing formulation. Triple enzyme active matrix (Protease + Amylase + Lipase) with rapid water-sheeting polymer.
            </p>

            {/* Price Box */}
            <div className="border-4 border-black p-4 bg-neutral-50 mb-6 flex items-baseline justify-between shadow-[4px_4px_0px_0px_#000]">
              <div className="flex items-baseline gap-3">
                <span className="font-heading text-4xl sm:text-5xl text-black">
                  {formatCurrency(currentPrice)}
                </span>
                <span className="font-mono text-base text-neutral-400 line-through">
                  {formatCurrency(currentVariantObj.originalPrice)}
                </span>
              </div>
              <span className="bg-[#FF3333] text-white px-3 py-1 font-mono text-xs font-bold uppercase">
                {currentVariantObj.savings}
              </span>
            </div>

            {/* Variant Selector */}
            <div className="space-y-3 mb-6">
              <label className="block text-xs font-bold uppercase text-neutral-700">
                SELECT PACKAGE SPECIFICATION:
              </label>
              <div className="space-y-2">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v.name)}
                    className={`w-full text-left p-3.5 border-2 transition-all flex items-center justify-between cursor-pointer ${
                      selectedVariant === v.name
                        ? 'border-black bg-[#FFDE00] text-black shadow-[4px_4px_0px_0px_#000]'
                        : 'border-neutral-300 bg-white text-neutral-800 hover:border-black'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs sm:text-sm uppercase flex items-center gap-2">
                        <span>{v.name}</span>
                        <span className="text-[10px] bg-black text-white px-1.5 py-0.5">
                          {v.badge}
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-600 block mt-0.5">
                        {v.doses} // 5ml concentrated dose
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-sm sm:text-base">
                        {formatCurrency(v.price)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-bold uppercase">QUANTITY:</span>
              <div className="flex items-center border-4 border-black bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                  className="p-3 hover:bg-[#FFDE00] transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-6 font-bold text-base">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                  className="p-3 hover:bg-[#FFDE00] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-neutral-500">
                TOTAL: <strong className="text-black">{formatCurrency(totalPrice)}</strong>
              </span>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-3 mb-8">
              {/* ADD TO CART Button (Glitch effect: Yellow, turns Black on hover with glitch) */}
              <GlitchButton
                variant="yellow"
                size="lg"
                fullWidth
                glitchHover={true}
                onClick={handleAddToCart}
              >
                + ADD TO CART [{formatCurrency(totalPrice)}]
              </GlitchButton>

              {/* BUY NOW Button (Triggers Razorpay Checkout directly) */}
              <button
                onClick={handleBuyNow}
                className="w-full bg-black text-white border-4 border-black py-4 px-6 font-mono font-bold text-base uppercase hover:bg-[#8A9A5B] hover:text-black transition-colors flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] cursor-pointer"
              >
                <span>INSTANT CHECKOUT WITH RAZORPAY / UPI →</span>
              </button>
            </div>

            {/* Value Props Strip */}
            <div className="grid grid-cols-2 gap-2 border-2 border-black p-3 bg-neutral-50 text-[11px] font-mono mb-8">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#8A9A5B] shrink-0 stroke-[3]" />
                <span>UPI Enabled (kartik8855@fam)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#8A9A5B] shrink-0 stroke-[3]" />
                <span>Zero Caustic Dermatitis</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#8A9A5B] shrink-0 stroke-[3]" />
                <span>Free 24hr Pune Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#8A9A5B] shrink-0 stroke-[3]" />
                <span>Certified Biodegradable</span>
              </div>
            </div>

            {/* Technical Accordion Tabs */}
            <div className="border-4 border-black">
              <div className="grid grid-cols-3 border-b-2 border-black text-xs font-bold text-center">
                <button
                  onClick={() => setActiveTab('ingredients')}
                  className={`p-3 uppercase transition-colors ${
                    activeTab === 'ingredients'
                      ? 'bg-black text-white'
                      : 'bg-white text-black hover:bg-neutral-100'
                  }`}
                >
                  FORMULATION
                </button>
                <button
                  onClick={() => setActiveTab('usage')}
                  className={`p-3 uppercase border-x-2 border-black transition-colors ${
                    activeTab === 'usage'
                      ? 'bg-black text-white'
                      : 'bg-white text-black hover:bg-neutral-100'
                  }`}
                >
                  USAGE / DOSING
                </button>
                <button
                  onClick={() => setActiveTab('safety')}
                  className={`p-3 uppercase transition-colors ${
                    activeTab === 'safety'
                      ? 'bg-black text-white'
                      : 'bg-white text-black hover:bg-neutral-100'
                  }`}
                >
                  SAFETY & LAB
                </button>
              </div>

              <div className="p-4 bg-white text-xs leading-relaxed">
                {activeTab === 'ingredients' && (
                  <div className="space-y-2">
                    <p className="font-bold uppercase text-neutral-800">
                      Full INCI Biochemical Declaration:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-neutral-700">
                      <li><strong>Protease Enzyme Complex:</strong> Cleaves baked protein & burnt grease peptide bonds.</li>
                      <li><strong>Alpha-Amylase:</strong> Liquefies rice, wheat, and potato starch starches into soluble sugars.</li>
                      <li><strong>Lipase:</strong> Hydrolyzes vegetable oils and animal fats into water-washable glycerol.</li>
                      <li><strong>Hydrophilic Sheeting Bio-Polymer:</strong> Eliminates water droplets & mineral spots.</li>
                      <li><strong>Coconut Alkyl Polyglucoside:</strong> Non-ionic biological foaming booster.</li>
                      <li><strong>Deccan Aquifer Purified Water:</strong> Solvent carrier (reverse osmosis filtered).</li>
                    </ul>
                  </div>
                )}

                {activeTab === 'usage' && (
                  <div className="space-y-2">
                    <p className="font-bold uppercase text-neutral-800">
                      Optimal Dilution Guidelines:
                    </p>
                    <div className="space-y-1.5 text-neutral-700">
                      <p><strong>1. Standard Sink Soak:</strong> 1 pump (5ml) per 5 liters of warm water. Soaks 20-30 heavy plates.</p>
                      <p><strong>2. Direct Pan Application:</strong> Apply 2 drops directly onto burnt Kadhais or baking trays. Let enzymes activate for 60 seconds.</p>
                      <p><strong>3. Commercial Dishwasher Pre-Rinse:</strong> Dilute 1:40 in spray tank.</p>
                    </div>
                  </div>
                )}

                {activeTab === 'safety' && (
                  <div className="space-y-2">
                    <p className="font-bold uppercase text-neutral-800">
                      Pune Quality Control & Certifications:
                    </p>
                    <div className="space-y-1 text-neutral-700">
                      <p>• <strong>Dermatologically Neutral:</strong> pH 7.3 ± 0.1 protects human skin lipid barriers.</p>
                      <p>• <strong>OECD 301B:</strong> 99.4% biological degradation within 14 days.</p>
                      <p>• <strong>Septic & Pipe Safe:</strong> Active enzymes prevent fatberg formation in grease traps.</p>
                      <p>• <strong>Batch 001 Cert:</strong> Verified free of arsenic, lead, and synthetic fragrance phthalates.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee ticker */}
      <Marquee text="BATCH 001 ✦ DISPATCHING FROM PUNE ✦ ₹169 PER 500ML ✦ TRIPLE-ENZYME FORMULATION ✦ 100 WASHES ✦" variant="yellow" />

      {/* Razorpay Checkout Modal */}
      <RazorpayCheckoutModal
        isOpen={isRazorpayOpen}
        onClose={() => setIsRazorpayOpen(false)}
        orderData={{
          items: [
            {
              title: defaultProduct.name,
              variant: selectedVariant,
              quantity,
              price: currentPrice,
            },
          ],
          totalAmount: totalPrice,
        }}
        onSuccess={() => {
          setIsRazorpayOpen(false);
        }}
      />
    </div>
  );
}
