import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint : {
    ignoreDuringBuilds : true
  },
  images : {
    domains : ["ik.imagekit.io"]
  }
};

export default nextConfig;
