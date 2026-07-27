import type { Config } from "tailwindcss";

export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Jost", "sans-serif"],
      },
      colors: {
        primary: "#991B1B",
        background: "#FFFFFF",
        foreground: "#6B7280",
      },
    },
  },
} satisfies Config;