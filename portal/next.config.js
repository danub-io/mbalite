const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})
module.exports = {
  ...withNextra(),
  output: 'export',
  basePath: '/mbalite/portal',
  assetPrefix: '/mbalite/portal',
  images: { unoptimized: true },
  trailingSlash: true
}
