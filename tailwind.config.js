/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F7F6F2',
        hairline: '#E4E0D8',
        ink: {
          DEFAULT: '#141619',
          muted: '#5C626E',
          faint: '#9E9A90',
        },
        navy: {
          DEFAULT: '#1B365D',
          dark: '#11233D',
          light: '#2A4D80',
        },
        price: {
          tier1: '#157A5B', // Deep Emerald (< 55k / < 210)
          tier2: '#47A87D', // Medium Sage (55-75k / 210-259)
          tier3: '#D9822B', // Amber (75-95k / 260-309)
          tier4: '#D1493F', // Terracotta (95-120k / 310-369)
          tier5: '#8E1C2E', // Burgundy (>= 120k / >= 370)
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
