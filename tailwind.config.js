/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Fury Road Brand Colors
        fury: {
          black: '#000000',
          white: '#FFFFFF',
          lightGray: '#E0E0E0',
          darkGray: '#333333',
          mediumGray: '#666666',
          orange: '#F71B0F', // PrimaryRed
          red: '#F71B0F', // PrimaryRed
        },
        primary: {
          50: '#fff4e6',
          100: '#ffe0b3',
          200: '#ffcc80',
          300: '#ffb84d',
          400: '#ffa31a',
          500: '#F71B0F', // PrimaryRed
          600: '#F71B0F', // PrimaryRed
          700: '#cc140a',
          800: '#990e07',
          900: '#660905',
        },
        dark: {
          100: '#190002', // Dark100
        },
        secondary: {
          yellow: '#F6D009', // SecondaryYellow
        },
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#E0E0E0', // Light gray from logo
          300: '#bdbdbd',
          400: '#9e9e9e',
          500: '#757575',
          600: '#666666', // Medium gray from logo
          700: '#616161',
          800: '#424242',
          900: '#333333', // Dark gray from logo
          950: '#000000', // Black from logo
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-bebas-neue)', 'system-ui', 'sans-serif'],
        display: ['var(--font-bebas-neue)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
