import { heroui } from "@heroui/react";

export default heroui({
  defaultTheme: "dark",
  themes: {
    dark: {
      colors: {
        background: {
          DEFAULT: "#0a0a0a",
        },
        foreground: {
          DEFAULT: "#e0e0e0",
          50: "#fafafa",
          100: "#f0f0f0",
          200: "#e0e0e0",
          300: "#c0c0c0",
          400: "#a0a0a0",
          500: "#808080",
          600: "#606060",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
        primary: {
          50: "#fef2f2",
          100: "#fde8e8",
          200: "#fbd5d5",
          300: "#f8a4a4",
          400: "#f47272",
          500: "#dc2626",
          600: "#b91c1c",
          700: "#991b1b",
          800: "#7f1d1d",
          900: "#631111",
          DEFAULT: "#dc2626",
          foreground: "#ffffff",
        },
        secondary: {
          50: "#f5f5f5",
          100: "#e5e5e5",
          200: "#d4d4d4",
          300: "#a3a3a3",
          400: "#737373",
          500: "#525252",
          600: "#404040",
          700: "#303030",
          800: "#262626",
          900: "#1a1a1a",
          DEFAULT: "#525252",
          foreground: "#e0e0e0",
        },
        success: {
          DEFAULT: "#22c55e",
          foreground: "#ffffff",
        },
        warning: {
          DEFAULT: "#f59e0b",
          foreground: "#000000",
        },
        danger: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        focus: {
          DEFAULT: "#dc2626",
        },
        content1: {
          DEFAULT: "#141414",
          foreground: "#e0e0e0",
        },
        content2: {
          DEFAULT: "#1c1c1c",
          foreground: "#d4d4d4",
        },
        content3: {
          DEFAULT: "#262626",
          foreground: "#a3a3a3",
        },
        content4: {
          DEFAULT: "#303030",
          foreground: "#737373",
        },
        divider: {
          DEFAULT: "rgba(220, 38, 38, 0.15)",
        },
      },
      layout: {
        radius: {
          small: "4px",
          medium: "6px",
          large: "8px",
        },
        borderWidth: {
          small: "1px",
          medium: "1.5px",
          large: "2px",
        },
      },
    },
  },
});
