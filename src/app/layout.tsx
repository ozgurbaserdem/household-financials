import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plånkan",
  description: "A comprehensive house hold economy application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
