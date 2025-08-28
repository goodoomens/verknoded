export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  safelist: [
    {
      pattern: /bg-./,
      variants: ['hover']
    },
    {
      pattern: /stroke-./
    },
    {
      pattern: /fill-./
    }
  ]
}
