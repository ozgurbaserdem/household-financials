import type { FC } from "react";
import { useTranslations } from "next-intl";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { DialogTitle } from "@radix-ui/react-dialog";
import { DialogDescription } from "@radix-ui/react-dialog";

interface Props {
  showBackButton?: boolean;
  showDialogRelatedContent?: boolean;
}

const HushallskalkylContent: FC<Props> = ({
  showBackButton = true,
  showDialogRelatedContent = false,
}) => {
  const t = useTranslations("hushallskalkyl");
  const tips: string[] = t.raw("tips");
  const mistakes: string[] = t.raw("mistakes");
  const facts: string[] = t.raw("facts");
  const faq: { question: string; answer: string }[] = t.raw("faq");
  const backLabel = t("back_to_home");

  return (
    <Box className="max-w-5xl mx-auto w-full px-4 sm:px-6 xl:px-0 py-6 sm:py-10">
      {showBackButton && (
        <Button asChild variant="outline" className="mb-6">
          <Link href="/">{backLabel}</Link>
        </Button>
      )}
      {showDialogRelatedContent && (
        <>
          <DialogTitle className="text-3xl font-bold mb-2">
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-lg text-gray-700 dark:text-gray-200 mb-6">
            {t("intro")}
          </DialogDescription>
        </>
      )}
      <article
        className={`max-w-2xl mx-auto ${showDialogRelatedContent ? "px-0" : "px-4"} py-8`}
      >
        {!showDialogRelatedContent && (
          <header className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
            <p className="text-lg text-gray-700 dark:text-gray-200">
              {t("intro")}
            </p>
          </header>
        )}
        {/* )} */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{t("tips_title")}</h2>
          <ul className="list-disc pl-6 space-y-1">
            {tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{t("mistakes_title")}</h2>
          <ul className="list-disc pl-6 space-y-1">
            {mistakes.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{t("facts_title")}</h2>
          <ul className="list-disc pl-6 space-y-1">
            {facts.map((fact, i) => (
              <li key={i}>{fact}</li>
            ))}
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{t("faq_title")}</h2>
          <ul className="space-y-4">
            {faq.map((item, i) => (
              <li key={i}>
                <strong>{item.question}</strong>
                <p>{item.answer}</p>
              </li>
            ))}
          </ul>
        </section>
        <footer className="mt-8">
          <p className="text-center text-lg font-semibold">{t("footer")}</p>
        </footer>
      </article>
    </Box>
  );
};

export default HushallskalkylContent;
