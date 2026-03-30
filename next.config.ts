import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Notion 내부 파일 호스팅 도메인 (서명 URL, 1시간 만료)
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
      },
      // Notion 첨부 파일 CDN
      {
        protocol: "https",
        hostname: "**.notion.so",
      },
      // Notion 이미지 리사이징 프록시
      {
        protocol: "https",
        hostname: "www.notion.so",
      },
    ],
  },
};

export default nextConfig;
