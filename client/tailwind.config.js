/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neon: {
          blue: '#00f5ff',
          purple: '#bf00ff',
          green: '#39ff14',
          pink: '#ff007f',
          yellow: '#ffff00',
          orange: '#ff6b35'
        },
        cyber: {
          dark: '#0a0a0f',
          darker: '#050507',
          light: '#1a1a2e',
          accent: '#16213e',
          gray: '#2a2a3e'
        }
      },
      fontFamily: {
        'cyber': ['Orbitron', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace']
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'pulse-neon': 'pulse-neon 1.5s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.5s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'bounce-neon': 'bounce-neon 1s infinite',
        'rotate-slow': 'rotate-slow 3s linear infinite',
        'gradient': 'gradient 15s ease infinite',
        'shimmer': 'shimmer 2.5s linear infinite'
      },
      keyframes: {
        glow: {
          '0%': { 
            boxShadow: '0 0 5px theme(colors.neon.blue), 0 0 10px theme(colors.neon.blue), 0 0 15px theme(colors.neon.blue)' 
          },
          '100%': { 
            boxShadow: '0 0 10px theme(colors.neon.blue), 0 0 20px theme(colors.neon.blue), 0 0 30px theme(colors.neon.blue)' 
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'pulse-neon': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 }
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 }
        },
        'slide-down': {
          '0%': { transform: 'translateY(-20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 }
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        },
        'bounce-neon': {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
          '40%, 43%': { transform: 'translate3d(0,-10px,0)' },
          '70%': { transform: 'translate3d(0,-5px,0)' },
          '90%': { transform: 'translate3d(0,-2px,0)' }
        },
        'rotate-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
      backdropBlur: {
        xs: '2px'
      },
      backgroundImage: {
        'cyber-grid': `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300f5ff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        'neon-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'cyber-gradient': 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
        'hero-gradient': 'linear-gradient(135deg, rgba(0,245,255,0.1) 0%, rgba(191,0,255,0.1) 100%)'
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 245, 255, 0.5)',
        'neon-lg': '0 0 30px rgba(0, 245, 255, 0.6)',
        'purple-neon': '0 0 20px rgba(191, 0, 255, 0.5)',
        'green-neon': '0 0 20px rgba(57, 255, 20, 0.5)',
        'cyber': '0 8px 32px 0 rgba(0, 245, 255, 0.1)',
        'glass': '0 8px 32px 0 rgba(255, 255, 255, 0.1)'
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px'
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      }
    },
  },
  plugins: [],
}
