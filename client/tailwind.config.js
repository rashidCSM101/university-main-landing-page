/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // WenClims brand palette
        primary: {
          DEFAULT: '#0B1E3D',   // deep navy
          light:   '#1A3461',   // lighter navy
          dark:    '#060F1F',   // darkest navy
          50:  '#EBF0F8',
          100: '#C7D4EC',
          200: '#9FB4DE',
          300: '#6F8FCA',
          400: '#3D6AB5',
          500: '#0B1E3D',
          600: '#091831',
          700: '#071226',
          800: '#040C1A',
          900: '#02060D',
        },
        teal: {
          DEFAULT: '#00C8C8',   // electric teal accent
          light:   '#33D4D4',
          dark:    '#009A9A',
          50:  '#E0FAFA',
          100: '#B3F2F2',
          200: '#80E8E8',
          300: '#4DDDDD',
          400: '#1AD1D1',
          500: '#00C8C8',
          600: '#009A9A',
          700: '#007070',
          800: '#004848',
          900: '#002424',
        },
        secondary: {
          DEFAULT: '#1A3461',
          light:   '#2A4A7F',
          dark:    '#0B1E3D',
        },
        accent: {
          gold:  '#E8C547',   // warm gold for highlights
          cream: '#F0F7FF',   // sky-tinted off-white
          sky:   '#B8D8F0',   // light sky blue
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float':    'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in':  'fadeIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%':   { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)',   opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern':    'linear-gradient(135deg, rgba(11,30,61,0.92) 0%, rgba(0,200,200,0.25) 100%)',
        'teal-gradient':   'linear-gradient(135deg, #00C8C8 0%, #009A9A 100%)',
        'navy-gradient':   'linear-gradient(135deg, #0B1E3D 0%, #1A3461 100%)',
      },
    },
  },
  plugins: [],
}

