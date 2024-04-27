const { withContentlayer } = require("next-contentlayer");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // async redirects() {
  //   return [
  //     {
  //       source: "/",
  //       destination: "https://emblor.jaleelbennett.com",
  //       permanent: true,
  //     },
  //   ];
  // },
};

module.exports = withContentlayer(nextConfig);
