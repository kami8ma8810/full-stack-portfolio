import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
// import { Inter } from "next/font/google";
import { QueryProvider } from "@/providers/query-provider";
// import { Header } from "@/components/layout/header";
import { HeaderMinimal } from "@/components/layout/header-minimal";
// import { Footer } from "@/components/layout/footer";
import { locales } from "@/config/i18n";

// const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Ensure that the incoming locale is valid
  if (!locales.includes(locale as 'ja' | 'en')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <QueryProvider>
        <div className="relative flex min-h-screen flex-col">
          {/* Temporarily showing locale for debugging */}
          <div className="bg-yellow-200 p-2 text-center">
            Debug: Current locale is "{locale}"
          </div>
          <HeaderMinimal />
          <main className="flex-1">{children}</main>
          {/* <Footer /> */}
        </div>
      </QueryProvider>
    </NextIntlClientProvider>
  );
}