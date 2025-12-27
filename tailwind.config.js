/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base colors
        'off-white': '#F6F7F4',
        'card-white': '#FFFFFF',
        
        // Green palette
        'sage': '#7A8F6A',
        'sage-muted': '#9EAD94',
        'green-dark': '#5F6F52',
        'green-hover': '#4A5940',
        
        // Text colors
        'text-primary': '#2F2F2F',
        'text-secondary': '#6B7280',
        'text-muted': '#9CA3AF',
        
        // Borders
        'border-soft': '#E5E7EB',
        
        // Badge colors
        'verified-bg': '#E6EFE8',
        'verified-text': '#5F6F52',
        
        // Status colors (minimal use)
        'error': '#DC2626',
        'success': '#059669',
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.08)',
        'soft': '0 2px 4px 0 rgba(0, 0, 0, 0.03)',
      },
      transitionDuration: {
        'card': '150ms',
      },
    },
  },
  plugins: [],
}