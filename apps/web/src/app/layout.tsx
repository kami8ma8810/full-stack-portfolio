import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Hank - Frontend Engineer",
    template: "%s | Hank",
  },
  description: "Frontend engineer passionate about creating exceptional web experiences. Specializing in React, TypeScript, and modern web technologies.",
  keywords: ["Frontend Engineer", "React", "TypeScript", "Next.js", "Web Development"],
  authors: [{ name: "Hank" }],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://hankkamy.com",
    siteName: "Hank",
    title: "Hank - Frontend Engineer",
    description: "Frontend engineer passionate about creating exceptional web experiences.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hank - Frontend Engineer",
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
    <html suppressHydrationWarning className="scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
