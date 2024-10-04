/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  
};


import withPWA from "@ducanh2912/next-pwa";

const pwaConfig = withPWA({
  aggressiveFrontEndNavCaching: true,
  cacheOnFrontEndNav: true,
  dest: "public",
  reloadOnOnline: true,
  swcMinify: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true
  }
});

export default pwaConfig(nextConfig);
