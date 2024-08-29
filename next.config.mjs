// next.config.js

/** @type {import('next').NextConfig} */

import nextPwa from "next-pwa";

const withPWA = nextPwa({
  dest: "public",
  cacheOnFrontEndNav: true,
  register: true,
  skipWaiting: true,
  reloadOnOnline: true,
  disable: false,
});

export default withPWA({
  // other congigs
  reactStrictMode: false,
});
