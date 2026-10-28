'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppFAB: React.FC = () => {
  const phoneNumber = '918421488557';
  const defaultMessage = encodeURIComponent(
    'Hey DCC Team, I want to inquire about Deccan Clean Tech Batch 001 & the Free 10-Minute Restaurant Kitchen Swap.'
  );
  const waUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <aside
      aria-label="Contact options"
      className="fixed bottom-6 right-6 z-40 flex items-center group select-none"
    >
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with DCC Pune Lab"
        className="
          flex items-center gap-3 bg-[#FFDE00] text-black
          border-4 border-black px-4 py-3
          shadow-[4px_4px_0px_0px_#000000]
          hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]
          transition-all duration-150 font-mono text-xs md:text-sm font-bold uppercase
        "
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8A9A5B] opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#8A9A5B]" />
        </span>
        <MessageCircle className="w-5 h-5 text-black fill-black" />
        <span className="hidden sm:inline tracking-wider">WHATSAPP DCC LAB</span>
        <span className="sm:hidden tracking-wider">CHAT</span>
      </a>
    </aside>
  );
};
