module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}','./components/**/*.{js,jsx,ts,tsx}'],
  theme: { extend: { colors: { zamaYellow: '#FFD400', zamaCream: '#FFF4CC', zamaYellowDark: '#FFB900' } } },
  plugins: [require('@tailwindcss/forms')],
}
