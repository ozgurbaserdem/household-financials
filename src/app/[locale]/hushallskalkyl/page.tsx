"use client";

import { use } from "react";
import type { FC } from "react";
import HushallskalkylContent from "@/components/hushallskalkyl/HushallskalkylContent";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

interface Props {
  params: Promise<{ locale: string }>;
}

const HushallskalkylPage: FC<Props> = ({ params }) => {
  const { locale } = use(params);

  return (
    <Box className="max-w-5xl mx-auto w-full px-4 sm:px-6 xl:px-0 py-6 sm:py-10">
      <Button asChild variant="outline" className="mb-6">
        <Link href="/">
          {locale === "sv" ? "← Tillbaka till startsidan" : "← Back to Home"}
        </Link>
      </Button>
      <HushallskalkylContent />
    </Box>
  );
};

export default HushallskalkylPage;
