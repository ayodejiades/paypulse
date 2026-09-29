// components/landing/fonts.ts — written by generate_landing.py from brief.json "design.fonts".
// Change the fonts there and re-run: generate_landing.py . --design-only
import { Geist, Geist_Mono } from "next/font/google";

const sans = Geist({ subsets: ["latin"], variable: "--font-landing-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-landing-mono", display: "swap" });

export const fontVariables = [sans.variable, mono.variable].join(" ");
