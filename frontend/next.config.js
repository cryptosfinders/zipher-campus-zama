const path = require("node:path");

const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },

  eslint: { ignoreDuringBuilds: true },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), usb=(), payment=(), accelerometer=(), autoplay=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=15552000; includeSubDomains",
          },
        ],
      },
    ];
  },

  // ✅ FIX FOR NEXT 15
  serverExternalPackages: ["@farcaster/miniapp-sdk", "convex"],

  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,

      // shared aliases
      "@react-native-async-storage/async-storage": path.resolve(
        "./src/lib/async-storage-shim.ts"
      ),

      "@farcaster/frame-sdk": "@farcaster/miniapp-sdk",
      punycode: "punycode/",

      "@/": path.resolve("."),
      "@/lib": path.resolve("./lib"),
      "@/components": path.resolve("./components"),
      "@/features": path.resolve("./features"),
      "@/hooks": path.resolve("/hooks"),
      "@/providers": path.resolve("/providers"),

      // 🚀 FINAL FIX: absolute convex alias
      "@/convex": path.resolve(process.cwd(), "../convex"),
      tslib: require.resolve("tslib"),
  };

    return config;
  },
};

module.exports = nextConfig;
