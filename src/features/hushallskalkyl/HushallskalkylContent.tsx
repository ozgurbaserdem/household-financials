"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import type { FC } from "react";

import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

const HushallskalkylContent: FC = () => {
  const t = useTranslations("hushallskalkyl");
  const tips: string[] = t.raw("tips");
  const mistakes: string[] = t.raw("mistakes");
  const facts: string[] = t.raw("facts");
  const faq: { question: string; answer: string }[] = t.raw("faq");

  return (
    <Box className="max-w-5xl mx-auto w-full">
      <article className="max-w-2xl mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
          <p className="text-lg text-gray-700 dark:text-gray-200">
            {t("intro")}
          </p>
        </header>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{t("tips_title")}</h2>
          <ul className="list-disc pl-6 space-y-1">
            {tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{t("mistakes_title")}</h2>
          <ul className="list-disc pl-6 space-y-1">
            {mistakes.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{t("facts_title")}</h2>
          <ul className="list-disc pl-6 space-y-1">
            {facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{t("faq_title")}</h2>
          <ul className="space-y-4">
            {faq.map((item) => (
              <li key={item.question}>
                <strong>{item.question}</strong>
                <p>{item.answer}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className="mt-8 text-center space-y-4">
          <p className="text-lg font-semibold">{t("cta_text")}</p>
          <div className="flex justify-center">
            <Button asChild size="lg" variant="default">
              <Link href="/hushallsbudget">
                {t("cta_button")}
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>
      </article>
    </Box>
  );
};

export default HushallskalkylContent;
