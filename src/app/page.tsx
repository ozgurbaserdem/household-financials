import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

export default function Home() {
  // Only redirect if the locale is not the default one
  redirect(`/${routing.defaultLocale}`);
}
