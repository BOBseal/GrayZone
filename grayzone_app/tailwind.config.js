const { url } = require('inspector');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage:{
        'mainBg1': "url('/public/Assets/bgImg.svg')",
      },
      animation:{
        "slowerFlicker" : 'pulse  2s infinite',
        "slowerPing": 'ping 2s infinite',
        "wiggleSlow" : 'wiggle 0.8s infinite',
      },
      keyframes:{
        wiggle: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        }
      }
    },
  },
  plugins: [],
}
