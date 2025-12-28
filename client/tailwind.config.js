/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#A91D3A',
          light: '#C73659',
          dark: '#8B1830',
          50: '#FDF2F4',
          100: '#FCE7EB',
          200: '#F9CED6',
          300: '#F4A5B5',
          400: '#EC7089',
          500: '#A91D3A',
          600: '#8B1830',
          700: '#751428',
          800: '#621324',
          900: '#541422',
        },
        secondary: {
          DEFAULT: '#1E1E1E',
          light: '#333333',
          dark: '#0A0A0A',
        },
        accent: {
          gold: '#D4AF37',
          cream: '#FFF8E7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'linear-gradient(135deg, rgba(169, 29, 58, 0.9) 0%, rgba(139, 24, 48, 0.8) 100%)',
      },
    },
  },
  plugins: [],
}
