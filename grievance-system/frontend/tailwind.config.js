/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gov: {
          saffron: '#FF9933',
          white: '#FFFFFF',
          green: '#138808',
          navy: '#1A2B6D',
          blue: '#003F87',
          primary: '#1A2B6D',
          primaryLight: '#2A3F8E',
          accent: '#FF9933',
          accentSoft: '#FFF1DB',
          muted: '#E7EEF7'
        }
      }
    }
  },
  plugins: []
};

