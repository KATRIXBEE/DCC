import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dcc: {
          white: "#FFFFFF",
          black: "#000000",
          sage: "#8A9A5B",
          yellow: "#FFDE00",
          red: "#FF3333",
          surface: "#F4F4F0",
          darkSurface: "#111111",
          muted: "#71717A",
        },
      },
      fontFamily: {
        heading: ["var(--font-archivo)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      boxShadow: {
        brutal: "4px 4px 0px 0px #000000",
        "brutal-lg": "8px 8px 0px 0px #000000",
        "brutal-xl": "12px 12px 0px 0px #000000",
        "brutal-sm": "2px 2px 0px 0px #000000",
        "brutal-yellow": "4px 4px 0px 0px #FFDE00",
        "brutal-sage": "4px 4px 0px 0px #8A9A5B",
        "brutal-red": "4px 4px 0px 0px #FF3333",
        "brutal-white": "4px 4px 0px 0px #FFFFFF",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        glitch: {
          "0%, 100%": { transform: "translate(0)" },
          "20%": { transform: "translate(-3px, 3px)" },
          "40%": { transform: "translate(-3px, -3px)" },
          "60%": { transform: "translate(3px, 3px)" },
          "80%": { transform: "translate(3px, -3px)" },
        },
      },
      animation: {
        marquee: "marquee 25s linear infinite",
        "marquee-fast": "marquee 12s linear infinite",
        glitch: "glitch 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94) both",
      },
      borderRadius: {
        none: "0px",
      },
    },
  },
  plugins: [],
};

export default config;
