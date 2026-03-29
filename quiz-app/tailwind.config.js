/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#1a1a1a',
        surface: '#2a2a2a',
        border: '#3a3a3a',
        text: '#f5f5f5',
        muted: '#a0a0a0',
        accent: '#FF6B35',
        'accent-hover': '#e55a25',
        secondary: '#4a4a4a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
