/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        midas: {
          navy: '#0B1F4B',
          blue: '#1A3A7C',
          sky: '#2A5FBD',
          light: '#4A90D9',
          pale: '#E8F0FB',
        },
      },
      fontFamily: {
        sans: ['"Pretendard"', '"Noto Sans KR"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
