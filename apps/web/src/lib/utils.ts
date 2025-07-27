import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * クラス名を結合するユーティリティ関数
 * clsxとtailwind-mergeを組み合わせて、Tailwindクラスの競合を解決
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 日付をフォーマットする関数
 */
export function formatDate(date: string | Date, locale = 'ja-JP'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

/**
 * 相対時間を取得する関数（例：3日前）
 */
export function getRelativeTime(date: string | Date, locale = 'ja-JP'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  
  const units: Array<[number, Intl.RelativeTimeFormatUnit]> = [
    [60, 'second'],
    [60, 'minute'],
    [24, 'hour'],
    [7, 'day'],
    [4, 'week'],
    [12, 'month'],
    [Infinity, 'year'],
  ];
  
  let value = diffInSeconds;
  for (const [divisor, unit] of units) {
    if (Math.abs(value) < divisor) {
      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
      return rtf.format(-Math.floor(value), unit);
    }
    value /= divisor;
  }
  
  return formatDate(d, locale);
}

/**
 * 数値を短縮形式で表示（例：1.2K、3.4M）
 */
export function formatNumber(num: number): string {
  if (num < 1000) {
    return num.toString();
  }
  
  const units = ['K', 'M', 'B'];
  const unitIndex = Math.floor(Math.log10(num) / 3) - 1;
  const unit = units[Math.min(unitIndex, units.length - 1)];
  const value = num / Math.pow(1000, unitIndex + 1);
  
  return `${value.toFixed(value < 10 ? 1 : 0)}${unit}`;
}

/**
 * URLからドメイン名を抽出
 */
export function getDomainFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

/**
 * スクロールを無効化/有効化
 */
export function toggleBodyScroll(disable: boolean): void {
  if (typeof document === 'undefined') return;
  
  if (disable) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}