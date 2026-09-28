import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../components/Providers";
import { GeistSans } from "geist/font/sans";
import { cn } from "@/lib/utils";

import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export const metadata: Metadata = {
  title: "SentinelX — AI Assistant for Indian Standards & Services",
  description:
    "Evidence-backed AI decision-support platform for Indian Standards, BIS Certification, Testing Laboratories, and Hallmarking.",
  keywords:
    "BIS, Indian Standards, ISI Mark, Hallmarking, HUID, BIS Certification, Compulsory Registration Scheme, Lab Testing",
  icons: {
    icon: "/BIS-LOGO.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", GeistSans.variable)}
    >
      <body className="min-h-screen flex flex-col font-sans bg-[#f3faf6] text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
