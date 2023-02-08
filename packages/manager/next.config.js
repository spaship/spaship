const { withGlobalCss } = require('next-global-css');

const withConfig = withGlobalCss();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  output: 'standalone'
};

module.exports = withConfig(nextConfig);
