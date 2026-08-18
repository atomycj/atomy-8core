import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // 프로필 사진 업로드(최대 2MB)가 기본 1MB 제한을 넘지 않도록 여유를 둡니다.
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
