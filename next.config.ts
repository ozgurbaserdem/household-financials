import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const isProd = process.env.NODE_ENV === "production";
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Disable default image optimization
  },
  assetPrefix: isProd ? "/household-financials" : "",
  basePath: isProd ? "/your-repository-name" : "",
  output: "export",
};

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: ["./messages/en.json", "./messages/sv.json"],
  },
});

// const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
