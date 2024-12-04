import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        jura: ["Jura"],
        majormono: ["Major Mono Display"],
        reenie: ["Reenie Beanie"],
        nunito: ["Nunito"],
        lato: ["Lato"],
      },
    },
    colors: {
      white: "#FFFFFF",
      black: "#000000",
      black1: "#333333",
      black2: "#565656",
      black3: "#080808",
      black4: "#2A2A2A",
      gray1: "#565656",
      gray2: "#A3A3A3",
      blue1: "#0004FF",
      yellow1: "#FECC31",
      purple1: "#EEEEFF",
      purple2: "#A020F0",
      red1: "#FF0000",
      red2: "#FFEEEE",
    },
  },
  plugins: [],
  important: true,
};
export default config;
