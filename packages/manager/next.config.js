/** @type {import('next').NextConfig} */

const { withGlobalCss } = require('next-global-css');

const nextConfig = {
  reactStrictMode: true,
  distDir: 'build',
}

module.exports = withGlobalCss(nextConfig)
