# DCC (Deccan Clean Tech)

> **"WE CLEAN WITHOUT RULES."**  
> Bio-Enzymatic. Cost-Per-Wash Optimized. Engineered in Pune, Maharashtra.

DCC (Deccan Clean Tech) is a next-generation biological cleaning technology brand. This repository contains the complete brand, e-commerce, and open-science web application.

---

## ⚡ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Strict Neo-Brutalist design system, 0px border radius, 4px black borders)
- **Animation & 3D**: [GSAP](https://gsap.com/) (ScrollTrigger, `@gsap/react`) + HTML5 `<canvas>` 105-frame 360° bottle scrubber
- **Micro-Interactions**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Payments**: [Razorpay](https://razorpay.com/) integration (`kartik8855@fam`)

---

## 🧪 Key Features

1. **300vh Sticky Center Scroll Sequence**:
   - Pinned HTML5 Canvas displaying 105 high-resolution WebP frames.
   - Real-time client-side green screen chroma-keying for transparent render against the technical grid.
   - 4-phase narrative scroll flow (`WE CLEAN` → `WITHOUT RULES` → `BIO-ENZYMATIC` → `BATCH 001 ALLOCATION`).
2. **Shop (`/shop`)**:
   - Interactive 3D CAD bottle viewer with angle presets and hotspot annotations.
   - Variant selection: Single Bottle (₹169), 3x Pack (₹469), 5L Commercial Jerrycan (₹1,299).
   - Glitch-hover Add-to-Cart button with slide-over Cart Drawer.
   - One-click Razorpay / UPI checkout modal with instant confirmation receipt.
3. **Science Lab (`/science`)**:
   - ASMR formulation audio-visual cards with interactive waveforms.
   - Interactive pH testing simulator (pH 1 to 14) showing why pH 7.3 is skin barrier safe.
   - Chronological Pune R&D formulation changelog.
4. **B2B Commercial Program**:
   - Free 10-Minute Kitchen Swap booking funnel with honeypot spam protection.
   - Interactive chemical leakage calculator for commercial restaurants.
5. **Verified Channels**:
   - WhatsApp Direct: [+91 84214 88557](https://wa.me/918421488557)
   - Official Lab Dispatch: `katrixbee@gmail.com`
   - Instagram: [@katrixbee](https://instagram.com/katrixbee)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/KATRIXBEE/DCC.git
cd DCC
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file:
```env
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
NEXT_PUBLIC_UPI_ID=kartik8855@fam
CONTACT_DISPATCH_EMAIL=katrixbee@gmail.com
WHATSAPP_PHONE=918421488557
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📜 License & Ownership
Copyright © 2026 Deccan Clean Tech (DCC). All rights reserved.
