import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // THESE ARE NOT NEEDED IN VERCEL
  // images: {
  //   unoptimized: true, // Required for static export
  // },
  // output: isProd ? "export" : undefined,
  // // This ensures the app works with GitHub Pages
  // trailingSlash: true,

  // Exclude development extensions in production
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Exclude axe DevTools and other dev extensions
      config.externals = config.externals || [];
      config.externals.push({
        "axe-core": "axe-core",
        "@axe-core/react": "@axe-core/react",
      });
    }
    return config;
  },

  // Doesn't really work with static exports right now, might be usable in the future
  // async rewrites() {
  //   return [
  //     {
  //       source: "/en/householdbudget",
  //       destination: "/en/hushallskalkyl",
  //     },
  //   ];
  // },
};

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: ["./messages/en.json", "./messages/sv.json"],
  },
});

export default withNextIntl(nextConfig);
