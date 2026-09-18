/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark Emerald Theme
        background: {
          primary: '#0B1915',
          secondary: '#132B24',
          tertiary: '#16342B',
        },
        card: {
          surface: '#132B24',
          border: '#1E4338',
        },
        accent: {
          emerald: '#10B981',
          emeraldHover: '#059669',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#9CA3AF',
          muted: '#A7F3D0',
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
        },
        // Additional colors for badges
        primary: '#10B981',
        secondary: '#3B82F6',
        success: '#10B981',
        info: '#3B82F6',
        danger: '#EF4444',
        warning: '#F59E0B',
        // Ring colors
        ring: {
          accent: '#10B981',
        },
        // Focus ring
        'ring-offset': '#0B1915',
        // Background colors
        'destructive-foreground': '#FFFFFF',
        'secondary-foreground': '#FFFFFF',
        'primary-foreground': '#FFFFFF',
        // Input background
        input: {
          bg: '#0B1915',
        }
      },
      fontFamily: {
        sans: ['Avenir Next', 'Helvetica Neue', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
