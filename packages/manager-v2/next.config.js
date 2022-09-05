const { withGlobalCss } = require('next-global-css');

const withConfig = withGlobalCss();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true
};

module.exports = withConfig(nextConfig);
