// Minimal header without next-intl for debugging
export function HeaderMinimal() {
  return (
    <header className="border-b bg-white p-4">
      <nav className="flex items-center justify-between">
        <div className="font-bold">Portfolio Debug</div>
        <div className="flex gap-4">
          <a href="/ja" className="text-blue-500">JA</a>
          <a href="/en" className="text-blue-500">EN</a>
        </div>
      </nav>
    </header>
  );
}