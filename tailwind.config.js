/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#DFB15B', // Warm Metallic Gold
        secondary: '#FFFFFF', // White
        background: '#0B0F19', // Premium Slate-Charcoal Blue
        accent: '#1E40AF', // Soft Brand Royal Blue
        danger: '#E50914', // Warning Red
        cardBg: 'rgba(15, 23, 42, 0.65)',
        goldDark: '#B8860B',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        'cinematic-gradient': 'linear-gradient(to top, #0B0F19, rgba(11, 15, 25, 0.8), rgba(11, 15, 25, 0.1))',
        'gold-gradient': 'linear-gradient(135deg, #DFB15B, #FFE4B5)',
      },
      boxShadow: {
        'gold-glow': '0 0 15px rgba(223, 177, 91, 0.3)',
        'gold-glow-intense': '0 0 25px rgba(223, 177, 91, 0.6)',
        'blue-glow': '0 0 15px rgba(30, 64, 175, 0.4)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
