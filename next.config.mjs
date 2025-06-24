/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "roamwithapp.s3.ca-central-1.amazonaws.com",
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
