module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        app: 'var(--bg-app)',
        glass: 'var(--bg-glass)',
        'glass-panel': 'var(--bg-glass-panel)',
        border: 'var(--border-glass)',
        primary: 'var(--primary)',
        'text-main': 'var(--text-main)',
        'text-muted': 'var(--text-muted)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}