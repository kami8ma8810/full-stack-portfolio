"use client";

import { usePathname } from "next/navigation";

export function useCurrentLocale(): "ja" | "en" {
  const pathname = usePathname();
  
  // Check if pathname starts with /ja or /en
  if (pathname.startsWith("/ja")) {
    return "ja";
  } else if (pathname.startsWith("/en")) {
    return "en";
  }
  
  // Default to ja if no locale is found
  return "ja";
}

export function useLocalePrefix(): string {
  const locale = useCurrentLocale();
  return `/${locale}`;
}