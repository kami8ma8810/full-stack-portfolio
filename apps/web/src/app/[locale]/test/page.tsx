export default async function TestPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Test Page</h1>
      <p>Current locale: {locale}</p>
      <p>This is a simple test page without next-intl</p>
      <div className="mt-4">
        <a href="/ja/test" className="mr-4 text-blue-500 underline">Japanese</a>
        <a href="/en/test" className="text-blue-500 underline">English</a>
      </div>
    </div>
  );
}