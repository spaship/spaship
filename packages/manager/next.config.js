/** @type {import('next').NextConfig} */

const { withGlobalCss } = require('next-global-css');

const nextConfig = {
  distDir: 'build',
  reactStrictMode: true,
}

module.exports = withGlobalCss(nextConfig)
