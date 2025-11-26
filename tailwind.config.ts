import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

export default <Config>{
  content: [
    './app/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'sporty-black': '#ffffff', // White
        'sporty-dark': '#f8fafc',  // Very Light Gray (Slate 50)
        'sporty-text': '#1e293b',  // Slate 800
        'sporty-green': '#10b981', // Emerald 500
        'sporty-orange': '#f97316', // Orange 500
        'sporty-blue': '#0ea5e9',  // Sky 500
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [animate],
}
