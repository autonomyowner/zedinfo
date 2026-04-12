import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Material Design 3 — Zed Informatique
        primary: "#0035d0",
        "primary-container": "#1a4bff",
        "primary-fixed": "#dee1ff",
        "primary-fixed-dim": "#bac3ff",
        "on-primary": "#ffffff",
        "on-primary-container": "#dbdeff",
        "on-primary-fixed": "#001159",
        "on-primary-fixed-variant": "#0031c4",
        secondary: "#4951c3",
        "secondary-container": "#838bff",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#111692",
        tertiary: "#8f2300",
        "tertiary-container": "#b93000",
        "on-tertiary": "#ffffff",
        error: "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
        background: "#f7f9fc",
        "on-background": "#191c1e",
        surface: "#f7f9fc",
        "surface-bright": "#f7f9fc",
        "surface-dim": "#d8dadd",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f4f7",
        "surface-container": "#eceef1",
        "surface-container-high": "#e6e8eb",
        "surface-container-highest": "#e0e3e6",
        "surface-variant": "#e0e3e6",
        "on-surface": "#191c1e",
        "on-surface-variant": "#434656",
        outline: "#747688",
        "outline-variant": "#c4c5d9",
        "inverse-surface": "#2d3133",
        "inverse-on-surface": "#eff1f4",
        "inverse-primary": "#bac3ff",
      },
      borderRadius: {
        // Brand language stays sharp by default (sections, panels, images).
        // Explicit tokens below are reserved for CTAs, cards and pills.
        DEFAULT: "0px",
        none: "0px",
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "18px",
        "2xl": "24px",
        "3xl": "32px",
        full: "9999px",
      },
      boxShadow: {
        zed: "0 40px 40px -15px rgba(26,75,255,0.06)",
        card: "0 1px 2px rgba(17,24,39,0.04), 0 8px 24px -8px rgba(17,24,39,0.08)",
        "card-hover":
          "0 2px 6px rgba(26,75,255,0.08), 0 30px 60px -20px rgba(26,75,255,0.25)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        headline: ["var(--font-inter)", "Inter", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "sans-serif"],
        display: [
          "var(--font-orbitron)",
          "Orbitron",
          "Eurostile",
          "Microgramma",
          "sans-serif",
        ],
      },
      maxWidth: {
        container: "1400px",
      },
      keyframes: {
        "hero-shine": {
          "0%": { backgroundPosition: "200% 50%" },
          "100%": { backgroundPosition: "-200% 50%" },
        },
      },
      animation: {
        "hero-shine": "hero-shine 8s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-rtl")],
};

export default config;
