import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
    rest: ["404"],
  }));
}

export default function CatchAllPage() {
  notFound();
}
