import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

export default function Home() {
  // Behövs denna? Räcker kanske med redirect(`/sv`);?
  redirect(`/${routing.defaultLocale}`);
}
