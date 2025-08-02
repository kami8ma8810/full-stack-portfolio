import { test, expect } from '@playwright/test';

test.describe('Basic Navigation', () => {
  test('should redirect root to Japanese locale', async ({ page }) => {
    // ルートにアクセス
    await page.goto('/');
    
    // /ja にリダイレクトされることを確認
    await expect(page).toHaveURL(/\/ja$/);
    
    // ページが正しく表示されていることを確認（404ではない）
    const response = await page.goto('/ja');
    expect(response?.status()).toBe(200);
  });

  test('should load Japanese home page', async ({ page }) => {
    await page.goto('/ja');
    
    // タイトルが存在することを確認
    await expect(page).toHaveTitle(/Hank/);
    
    // ヘッダーが表示されていることを確認
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // ナビゲーションリンクが存在することを確認
    await expect(page.locator('nav a[href="/ja"]')).toBeVisible();
    await expect(page.locator('nav a[href="/ja/blog"]')).toBeVisible();
    await expect(page.locator('nav a[href="/ja/works"]')).toBeVisible();
    await expect(page.locator('nav a[href="/ja/about"]')).toBeVisible();
    await expect(page.locator('nav a[href="/ja/contact"]')).toBeVisible();
  });

  test('should load English home page', async ({ page }) => {
    await page.goto('/en');
    
    // ページが正しく表示されていることを確認
    const response = await page.goto('/en');
    expect(response?.status()).toBe(200);
    
    // ヘッダーが表示されていることを確認
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  test('should switch language', async ({ page }) => {
    await page.goto('/ja');
    
    // 言語切り替えボタンを探してクリック
    const languageSwitcher = page.locator('button:has-text("English")');
    await expect(languageSwitcher).toBeVisible();
    await languageSwitcher.click();
    
    // 英語版にリダイレクトされることを確認
    await expect(page).toHaveURL(/\/en$/);
    
    // 英語版でも言語切り替えボタンが機能することを確認
    const japaneseButton = page.locator('button:has-text("日本語")');
    await expect(japaneseButton).toBeVisible();
    await japaneseButton.click();
    
    // 日本語版に戻ることを確認
    await expect(page).toHaveURL(/\/ja$/);
  });

  test('should navigate to all main pages without 404', async ({ page }) => {
    const pages = [
      { path: '/ja', title: 'Hank' },
      { path: '/ja/blog', title: 'Blog' },
      { path: '/ja/works', title: 'Works' },
      { path: '/ja/about', title: 'About' },
      { path: '/ja/contact', title: 'Contact' },
      { path: '/en', title: 'Hank' },
      { path: '/en/blog', title: 'Blog' },
      { path: '/en/works', title: 'Works' },
      { path: '/en/about', title: 'About' },
      { path: '/en/contact', title: 'Contact' },
    ];

    for (const pageInfo of pages) {
      const response = await page.goto(pageInfo.path);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(new RegExp(pageInfo.title));
    }
  });
});