import type { NextConfig } from "next";
const config: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "dam.mediacorp.sg" },
      { protocol: "https", hostname: "edge.sitecorecloud.io" },
      { protocol: "https", hostname: "eatbook.sg" },
      { protocol: "https", hostname: "danielfooddiary.com" },
      { protocol: "https", hostname: "sethlui.com" },
      { protocol: "https", hostname: "static.wixstatic.com" },
      { protocol: "https", hostname: "media.timeout.com" },
      { protocol: "https", hostname: "www.daizucafe.com" },
      { protocol: "https", hostname: "www.littledayout.com" },
      { protocol: "https", hostname: "cdn.heartroomgallery.com" },
      { protocol: "https", hostname: "isomer-user-content.by.gov.sg" },
    ],
  },
};
export default config;
