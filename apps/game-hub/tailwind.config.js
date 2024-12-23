/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'text-green-600',
    'text-blue-600',
    'bg-green-500',
    'bg-blue-500',
    'hover:bg-green-600',
    'hover:bg-blue-600',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

