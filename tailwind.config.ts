import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        nightTop: "#0B253A",
        nightMid: "#164A5E",
        nightCenter: "#2D7D8E",
        nightBottom: "#4B8999",
        amberSoft: "#F6C98F"
      },
      backgroundImage: {
        "winter-vertical":
          "linear-gradient(to bottom, #0B253A, #164A5E, #2D7D8E, #4B8999)"
      },
      boxShadow: {
        "glow-teal": "0 0 40px rgba(45, 125, 142, 0.6)",
        "glow-gold": "0 0 40px rgba(246, 201, 143, 0.6)"
      },
      animation: {
        "snow-fall-slow": "snowFall 18s linear infinite",
        "snow-fall-med": "snowFall 12s linear infinite",
        "snow-fall-fast": "snowFall 8s linear infinite",
        "breath": "breath 8s ease-in-out infinite",
        "envelope-float": "breath 10s ease-in-out infinite"
      },
      keyframes: {
        snowFall: {
          "0%": { transform: "translateY(-100vh)" },
          "100%": { transform: "translateY(100vh)" }
        },
        breath: {
          "0%, 100%": { transform: "translateY(0px) scale(1)" },
          "50%": { transform: "translateY(-6px) scale(1.02)" }
        }
      }
    }
  },
  plugins: []
};

export default config;


