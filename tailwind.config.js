/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0F172A',
        'dark-card': '#1E293B',
        'dark-border': '#334155',
        'neon-purple': '#A78BFA',
        'neon-violet': '#C084FC',
        'neon-amber': '#F59E0B',
        'neon-crimson': '#EF4444',
        'dark-slate': '#1A1F36',
        'purple-light': '#E9D5FF',
        'purple-dark': '#6D28D9',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
