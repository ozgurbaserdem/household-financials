import type { FC } from "react";
import { useTranslations } from "next-intl";

interface Props {
  hideTitle?: boolean;
}

const HushallskalkylContent: FC<Props> = ({ hideTitle }) => {
  const t = useTranslations("hushallskalkyl");
  const tips: string[] = t.raw("tips");
  const mistakes: string[] = t.raw("mistakes");
  const facts: string[] = t.raw("facts");
  const faq: { question: string; answer: string }[] = t.raw("faq");

  return (
    <article className="max-w-2xl mx-auto px-4 py-8">
      <header className="mb-6">
        {!hideTitle && (
          <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
        )}
        <p className="text-lg text-gray-700 dark:text-gray-200">{t("intro")}</p>
      </header>
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
  );
};

export default HushallskalkylContent;
