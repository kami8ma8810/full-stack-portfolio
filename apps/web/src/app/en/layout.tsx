import { getMessages } from "next-intl/server";
import { SharedLocaleLayout } from "@/components/layout/shared-locale-layout";

export default async function EnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <SharedLocaleLayout locale="en" messages={messages}>
      {children}
    </SharedLocaleLayout>
  );
}