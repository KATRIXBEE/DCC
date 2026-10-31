import type { Metadata } from 'next';
import { Archivo_Black, JetBrains_Mono, Space_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppFAB } from '@/components/WhatsAppFAB';
import { CartDrawer } from '@/components/CartDrawer';
import { Preloader } from '@/components/Preloader';

const archivoBlack = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  weight: ['400', '700', '800'],
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-spacemono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DCC // DECCAN CLEAN TECH — Bio-Enzymatic Clean Tech',
  description:
    'Pune-engineered bio-enzymatic cleaning formulations. Triple enzyme active matrix (Protease, Amylase, Lipase), pH 7.3, sheeting polymer technology. Commercial and kitchen grade.',
  keywords: [
    'Deccan Clean Tech',
    'DCC',
    'Bio-Enzymatic Dishwash',
    'Commercial Kitchen Cleaner Pune',
    'Enzyme Cleaner',
    'Batch 001',
  ],
  authors: [{ name: 'Deccan Clean Tech' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${archivoBlack.variable} ${jetbrainsMono.variable} ${spaceMono.variable}`}>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>" />
        {/* Anti-flash script: immediately hides preloader on subsequent visits in the same session */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(sessionStorage.getItem('dcc_intro_seen')==='true'){document.documentElement.classList.add('dcc-preloader-skip');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-black font-mono antialiased selection:bg-[#FFDE00] selection:text-black">
        {/* Critical full-screen preloader rendered in initial SSR HTML */}
        <Preloader />
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFAB />
        </CartProvider>
        {/* Lazy load Razorpay Checkout Script */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
