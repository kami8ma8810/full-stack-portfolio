import { NextIntlClientProvider } from "next-intl";
import { QueryProvider } from "@/providers/query-provider";
import { HeaderMinimal } from "@/components/layout/header-minimal";

interface SharedLocaleLayoutProps {
  children: React.ReactNode;
  locale: "ja" | "en";
  messages: any;
}

export function SharedLocaleLayout({
  children,
  locale,
  messages,
}: SharedLocaleLayoutProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
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