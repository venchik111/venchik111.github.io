import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  // Разрешает dev-серверу отдавать HMR и чанки при открытии сайта по IP с других устройств.
  allowedDevOrigins: ["192.168.15.49", "192.168.15.*"],
};

export default nextConfig;
