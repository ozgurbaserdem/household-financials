import { MetadataRoute } from "next";

const robots = (): MetadataRoute.Robots => {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/_vercel/", "/trpc/", "/private/"],
    },
    sitemap: "https://www.budgetkollen.se/sitemap.xml",
  };
};

export default robots;
