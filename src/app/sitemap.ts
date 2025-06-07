import { MetadataRoute } from "next";

const sitemap = (): MetadataRoute.Sitemap => {
  const baseUrl = "https://www.budgetkollen.se";
  const currentDate = new Date();

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      alternates: {
        languages: {
          sv: baseUrl,
          en: `${baseUrl}/en`,
        },
      },
    },
    {
      url: `${baseUrl}/en`,
      lastModified: currentDate,
      alternates: {
        languages: {
          sv: baseUrl,
          en: `${baseUrl}/en`,
        },
      },
    },
    {
      url: `${baseUrl}/hushallsbudget`,
      lastModified: currentDate,
      alternates: {
        languages: {
          sv: `${baseUrl}/hushallsbudget`,
          en: `${baseUrl}/en/household-budget`,
        },
      },
    },
    {
      url: `${baseUrl}/en/household-budget`,
      lastModified: currentDate,
      alternates: {
        languages: {
          sv: `${baseUrl}/hushallsbudget`,
          en: `${baseUrl}/en/household-budget`,
        },
      },
    },
    {
      url: `${baseUrl}/hushallskalkyl`,
      lastModified: currentDate,
      alternates: {
        languages: {
          sv: `${baseUrl}/hushallskalkyl`,
          en: `${baseUrl}/en/householdbudget`,
        },
      },
    },
    {
      url: `${baseUrl}/en/householdbudget`,
      lastModified: currentDate,
      alternates: {
        languages: {
          sv: `${baseUrl}/hushallskalkyl`,
          en: `${baseUrl}/en/householdbudget`,
        },
      },
    },
    {
      url: `${baseUrl}/ranta-pa-ranta`,
      lastModified: currentDate,
      alternates: {
        languages: {
          sv: `${baseUrl}/ranta-pa-ranta`,
          en: `${baseUrl}/en/compound-interest`,
        },
      },
    },
    {
      url: `${baseUrl}/en/compound-interest`,
      lastModified: currentDate,
      alternates: {
        languages: {
          sv: `${baseUrl}/ranta-pa-ranta`,
          en: `${baseUrl}/en/compound-interest`,
        },
      },
    },
  ];
};

export default sitemap;
