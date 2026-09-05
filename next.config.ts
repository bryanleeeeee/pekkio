import type { NextConfig } from "next";
const config: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "dam.mediacorp.sg" },
      { protocol: "https", hostname: "edge.sitecorecloud.io" },
    ],
  },
};
export default config;
