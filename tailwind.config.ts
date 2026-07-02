import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0F1117',
        'bg-surface': '#1A1D27',
        'bg-card': '#1E2130',
        'accent': '#00E5A0',
        'accent-dim': '#00B880',
        'text-primary': '#FFFFFF',
        'text-secondary': '#8B8FA8',
        'border-color': '#2A2D3E',
        'red-status': '#FF4D4D',
        'amber-status': '#FFB020',
      },
    },
  },
  plugins: [],
}
export default config
