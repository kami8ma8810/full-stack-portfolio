import { getMessages } from "next-intl/server";
import { SharedLocaleLayout } from "@/components/layout/shared-locale-layout";

export default async function JaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <SharedLocaleLayout locale="ja" messages={messages}>
      {children}
    </SharedLocaleLayout>
  );
}