module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: '#0A1121',
        shoplineOrange: '#FF9900',
        softGray: '#F9FAFB',
      },
      borderRadius: {
        'xl': '20px',
        '2xl': '30px',
      }
    },
  },
  plugins: [],
}