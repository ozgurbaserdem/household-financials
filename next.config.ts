import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const isProd = process.env.NODE_ENV === "production";
const repoName = "household-financials"; // Your actual GitHub repository name

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Required for static export
  },
  assetPrefix: isProd ? `/${repoName}/` : "",
  basePath: isProd ? `/${repoName}` : "",
  output: isProd ? "export" : undefined,
  // This ensures the app works with GitHub Pages
  trailingSlash: true,
};

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: ["./messages/en.json", "./messages/sv.json"],
  },
});
// const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
