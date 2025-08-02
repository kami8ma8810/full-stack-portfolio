#!/usr/bin/env tsx

import { quickVerify } from './helpers/verify-page';

// 開発サーバーが起動しているか確認して、ページを検証
(async () => {
  console.log('🚀 Starting page verification...\n');
  
  try {
    await quickVerify();
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }
})();