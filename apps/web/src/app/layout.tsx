import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { QueryProvider } from "@/providers/query-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Hiroki Kamiyama - Frontend Engineer",
    template: "%s | Hiroki Kamiyama",
  },
  description: "Frontend engineer passionate about creating exceptional web experiences. Specializing in React, TypeScript, and modern web technologies.",
  keywords: ["Frontend Engineer", "React", "TypeScript", "Next.js", "Web Development"],
  authors: [{ name: "Hiroki Kamiyama" }],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://hirokikamiyama.com",
    siteName: "Hiroki Kamiyama",
    title: "Hiroki Kamiyama - Frontend Engineer",
    description: "Frontend engineer passionate about creating exceptional web experiences.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hiroki Kamiyama - Frontend Engineer",
    description: "Frontend engineer passionate about creating exceptional web experiences.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <QueryProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
