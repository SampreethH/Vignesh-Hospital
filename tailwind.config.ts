import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#081C2E",
        aqua: { DEFAULT: "#2CC6D3", dark: "#0B8794", light: "#BFF1F5" },
        blue: "#087BB5",
        mist: "#F2F7F7",
        pearl: "#FBFDFD",
        slate: "#51616C",
        lilac: "#8E6CD1",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      letterSpacing: { tightest: "-0.04em" },
    },
  },
  plugins: [],
};

export default config;
