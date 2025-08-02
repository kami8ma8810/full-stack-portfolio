import { chromium, Page, Browser } from '@playwright/test';

export interface VerifyResult {
  success: boolean;
  url: string;
  status: number;
  error?: string;
  screenshot?: string;
}

export class PageVerifier {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async init() {
    this.browser = await chromium.launch({ headless: true });
    const context = await this.browser.newContext();
    this.page = await context.newPage();
  }

  async verify(url: string): Promise<VerifyResult> {
    if (!this.page || !this.browser) {
      await this.init();
    }

    try {
      const response = await this.page!.goto(url, { waitUntil: 'networkidle' });
      const status = response?.status() || 0;
      
      // スクリーンショットを撮る
      const screenshot = await this.page!.screenshot({ encoding: 'base64' });
      
      // 404エラーページのチェック
      const is404 = await this.page!.locator('text=404').count() > 0;
      
      return {
        success: status === 200 && !is404,
        url,
        status,
        screenshot,
        error: is404 ? 'Page shows 404 error' : undefined,
      };
    } catch (error) {
      return {
        success: false,
        url,
        status: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async verifyMultiple(urls: string[]): Promise<VerifyResult[]> {
    const results: VerifyResult[] = [];
    
    for (const url of urls) {
      const result = await this.verify(url);
      results.push(result);
      console.log(`${result.success ? '✅' : '❌'} ${url} - Status: ${result.status}${result.error ? ` - Error: ${result.error}` : ''}`);
    }
    
    return results;
  }

  async checkElement(selector: string): Promise<boolean> {
    if (!this.page) return false;
    
    try {
      const element = await this.page.locator(selector);
      return await element.isVisible();
    } catch {
      return false;
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
}

// 使用例を実行する関数
export async function quickVerify() {
  const verifier = new PageVerifier();
  
  const urls = [
    'http://localhost:3000/',
    'http://localhost:3000/ja',
    'http://localhost:3000/en',
    'http://localhost:3000/ja/blog',
    'http://localhost:3000/ja/works',
    'http://localhost:3000/ja/about',
    'http://localhost:3000/ja/contact',
  ];
  
  console.log('🔍 Verifying pages...\n');
  const results = await verifier.verifyMultiple(urls);
  
  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    console.log('\n❌ Failed pages:');
    failed.forEach(f => console.log(`  - ${f.url}: ${f.error || `Status ${f.status}`}`));
  } else {
    console.log('\n✅ All pages loaded successfully!');
  }
  
  await verifier.close();
  return results;
}