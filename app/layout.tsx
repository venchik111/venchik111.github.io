import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { profile } from "@/data/profile";
import "./globals.css";

const sans = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.role}`,
  description: profile.tagline,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* До первой отрисовки: включает скрытие блоков, которые появятся при прокрутке. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
