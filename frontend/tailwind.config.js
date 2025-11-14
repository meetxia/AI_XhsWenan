/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // 启用 'class' 策略进行暗黑模式切换
  theme: {
    extend: {
      colors: {
        // 自定义主色调 - 符合PRD规范
        'primary-dark': '#10B981',   // 活力绿 (暗黑模式)
        'primary-light': '#047857',  // 沉稳深绿 (浅色模式)
      },
      ringColor: {
        'primary-dark': '#10B981',
        'primary-light': '#047857',
      },
      animation: {
        'pulse-green-dark': 'pulse-dark 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-green-light': 'pulse-light 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-dark': {
          '0%, 100%': { opacity: 1, backgroundColor: '#10B981' },
          '50%': { opacity: .5, backgroundColor: '#059669' },
        },
        'pulse-light': {
          '0%, 100%': { opacity: 1, backgroundColor: '#047857' },
          '50%': { opacity: .5, backgroundColor: '#059669' },
        },
      }
    },
  },
  plugins: [],
}
