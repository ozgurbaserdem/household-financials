"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Box } from "@/components/ui/box";

export default function NotFound() {
  const t = useTranslations();

  return (
    <Box className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <Box className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-6xl font-extrabold text-gray-900 dark:text-gray-100">
          404
        </h1>
        <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
          {t("not_found.title") || "Page not found"}
        </h2>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          {t("not_found.description") ||
            "The page you are looking for does not exist."}
        </p>
        <Box className="mt-6">
          <Link
            href="/"
            className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
          >
            {t("not_found.back_home") || "Go back home"}
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
