export default async function TestLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  return (
    <div>
      <div className="bg-gray-100 p-4">
        <p>Test Layout - Locale: {locale}</p>
      </div>
      {children}
    </div>
  );
}