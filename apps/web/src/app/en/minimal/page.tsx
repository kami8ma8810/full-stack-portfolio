// Minimal page with no dependencies
export default async function MinimalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Minimal Test Page</h1>
      <p>Locale from params: <strong>{locale}</strong></p>
      <p>This page has no external dependencies</p>
      <hr />
      <p>
        <a href="/ja/minimal">日本語</a> | <a href="/en/minimal">English</a>
      </p>
    </div>
  );
}