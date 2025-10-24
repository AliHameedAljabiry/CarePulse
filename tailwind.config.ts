import type { Config } from "tailwindcss";

const { fontFamily } = require("tailwindcss/defaultTheme");

const config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
       height: {
        'screen-minus-200': 'calc(100vh - 200px)',
      },
      colors: {
        green: {
          500: "#24AE7C",
          600: "#0D2A1F",
        },
        blue: {
          500: "#79B5EC",
          600: "#152432",
        },
        red: {
          500: "#F37877",
          600: "#3E1716",
          700: "#F24E43",
        },
        light: {
         100: "#D6E0FF",
          200: "#EED1AC",
          300: "#F8F8FF",
          400: "#EDF1F1",
          500: "#8D8D8D",
          600: "#F9FAFB",
          700: "#E2E8F0",
          800: "#F8FAFC",
        },
        dark: {
          100: "#16191E",
          200: "#3A354E",
          300: "#232839",
          400: "#1A1D21",
          500: "#363A3D",
          600: "#76828D",
          700: "#ABB8C4",
          800: "#1E2230",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      backgroundImage: {
        appointments: "url('/assets/images/appointments-bg.png')",
        pending: "url('/assets/images/pending-bg.png')",
        cancelled: "url('/assets/images/cancelled-bg.png')",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        borderSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        rotate: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
       
        borderTrain: {
          '0%': { 
            transform: 'translateX(100%)',
            right: '0%',
            top: '0%'
          },
          '25%': { 
            transform: 'translateX(100%)',
            right: '100%',
            top: '0%'
          },
          '50%': { 
            transform: 'translateY(-100%)',
            right: '100%',
            top: '100%',
            
          },
          '75%': { 
            transform: 'translateX(100%)',
            right: '0%',
            top: '90%',
            
          },
          '100%': { 
            transform: 'translateY(100%)',
            right: '0%',
            top: '0%'
          },
        },
        borderTrain1: {
          '0%': { 
            transform: 'translateX(100%)',
            right: '0%',
            top: '0%'
          },
          '25%': { 
            transform: 'translateX(100%)',
            right: '100%',
            top: '0%'
          },
          '50%': { 
            transform: 'translateY(-100%)',
            right: '100%',
            top: '100%',
            
          },
          '75%': { 
            transform: 'translateX(100%)',
            right: '0%',
            top: '90%',
            
          },
          '100%': { 
            transform: 'translateY(100%)',
            right: '0%',
            top: '0%'
          },
        },
        borderTrain2: {
          '0%': { 
            transform: 'translateX(100%)',
            right: '0%',
            top: '0%'
          },
          '25%': { 
            transform: 'translateX(100%)',
            right: '100%',
            top: '0%'
          },
          '50%': { 
            transform: 'translateY(-100%)',
            right: '100%',
            top: '100%',
            
          },
          '75%': { 
            transform: 'translateX(100%)',
            right: '0%',
            top: '90%',
            
          },
          '100%': { 
            transform: 'translateY(100%)',
            right: '0%',
            top: '0%'
          },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        'spin-slow': 'spin 3s linear infinite',
        'border-spin': 'borderSpin 2s linear infinite',
        'rotate': 'rotate 3s linear infinite',
        'border-train': 'borderTrain 2s linear infinite', // ADD THIS LINE
        'border-train1': 'borderTrain1 3s linear infinite', // ADD THIS LINE
        'border-train2': 'borderTrain2 4s linear infinite', // ADD THIS LINE
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;