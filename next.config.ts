/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3030",
      },
      {
        protocol: "https",
        hostname: "api.firstfemale.in",
      },
    ],
  },
};

module.exports = nextConfig;
