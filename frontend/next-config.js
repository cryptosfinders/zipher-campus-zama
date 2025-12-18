const path = require("node:path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,

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

  experimental: {
    wasm: true,
    serverComponentsExternalPackages: ["@farcaster/miniapp-sdk"],
  },

  webpack(config) {
    config.resolve.alias = config.resolve.alias || {};

    config.resolve.alias["@react-native-async-storage/async-storage"] =
      path.resolve("./src/lib/async-storage-shim.ts");

    config.resolve.alias["@farcaster/frame-sdk"] = "@farcaster/miniapp-sdk";

    config.resolve.alias.punycode = "punycode/";

    config.resolve.alias["@/"] = path.resolve("./src");
    config.resolve.alias["@/lib"] = path.resolve("./src/lib");
    config.resolve.alias["@/components"] = path.resolve("./src/components");
    config.resolve.alias["@/blockchain"] = path.resolve("../blockchain");
    config.resolve.alias["@/relayer"] = path.resolve("../relayer");
    config.resolve.alias["@/convex"] = path.resolve(__dirname, "@/convex");

    config.infrastructureLogging = config.infrastructureLogging || {};
    config.infrastructureLogging.level = "error";

    const ignoreWarnings = Array.isArray(config.ignoreWarnings)
      ? config.ignoreWarnings
      : [];

    config.ignoreWarnings = [
      ...ignoreWarnings,
      (warning) => {
        const message = String(warning?.message || warning || "");
        return (
          message.includes("PackFileCacheStrategy") ||
          message.includes("Serializing big strings")
        );
      },
    ];

    return config;
  },
};

module.exports = nextConfig;

