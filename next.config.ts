import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Required for static export
  },
  output: isProd ? "export" : undefined,
  // This ensures the app works with GitHub Pages
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: "/en/householdbudget",
        destination: "/en/hushallskalkyl",
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: ["./messages/en.json", "./messages/sv.json"],
  },
});
// const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
