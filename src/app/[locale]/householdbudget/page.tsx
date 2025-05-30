"use client";

import { Main } from "@/components/ui/main";
import { Box } from "@/components/ui/box";
import { Navbar } from "@/components/shared/Navbar";
import HushallskalkylContent from "@/features/hushallskalkyl/HushallskalkylContent";

export default function HouseHoldBudgetPage() {
  return (
    <Main className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col items-center">
      <Navbar />
      <Box className="w-full max-w-5xl px-4 sm:px-6 xl:px-0 py-6 sm:py-10">
        <HushallskalkylContent />
      </Box>
    </Main>
  );
}
