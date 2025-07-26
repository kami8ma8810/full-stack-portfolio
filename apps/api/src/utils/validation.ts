/**
 * バリデーションユーティリティ
 * 
 * セキュリティを考慮した入力値検証のヘルパー関数
 */

/**
 * 危険なHTMLタグやスクリプトが含まれていないかチェック
 * 
 * @param input - チェックする文字列
 * @returns 危険な内容が含まれている場合はtrue
 */
export function containsDangerousContent(input: string): boolean {
  // 危険なパターンのリスト
  const dangerousPatterns = [
    /<script[\s\S]*?<\/script>/gi, // scriptタグ
    /<iframe[\s\S]*?<\/iframe>/gi, // iframeタグ
    /<object[\s\S]*?<\/object>/gi, // objectタグ
    /<embed[\s\S]*?>/gi, // embedタグ
    /javascript:/gi, // javascriptプロトコル
    /on\w+\s*=/gi, // イベントハンドラ属性
    /<img[^>]+src[\\s]*=[\\s]*["\']javascript:/gi, // img内のjavascript
    /vbscript:/gi, // vbscriptプロトコル
    /data:text\/html/gi, // data URLでのHTML
  ];

  return dangerousPatterns.some(pattern => pattern.test(input));
}

/**
 * URLの検証とサニタイズ
 * 
 * @param url - 検証するURL
 * @returns 安全なURLの場合はそのまま、危険な場合はnull
 */
export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    
    // 許可するプロトコル
    const allowedProtocols = ['http:', 'https:'];
    
    if (!allowedProtocols.includes(parsed.protocol)) {
      return null;
    }
    
    // その他の危険なパターンをチェック
    if (url.includes('javascript:') || url.includes('data:') || url.includes('vbscript:')) {
      return null;
    }
    
    return url;
  } catch {
    return null;
  }
}

/**
 * メールアドレスの詳細な検証
 * 
 * @param email - 検証するメールアドレス
 * @returns 有効な場合はtrue
 */
export function isValidEmail(email: string): boolean {
  // 基本的なフォーマットチェック
  const basicPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!basicPattern.test(email)) {
    return false;
  }
  
  // より詳細なチェック
  const parts = email.split('@');
  if (parts.length !== 2) {
    return false;
  }
  
  const [localPart, domain] = parts;
  
  // ローカル部の長さチェック（64文字まで）
  if (localPart.length > 64) {
    return false;
  }
  
  // ドメイン部の長さチェック（253文字まで）
  if (domain.length > 253) {
    return false;
  }
  
  // 危険な文字が含まれていないかチェック
  const dangerousChars = ['<', '>', '"', "'", '&', '\n', '\r', '\t'];
  if (dangerousChars.some(char => email.includes(char))) {
    return false;
  }
  
  return true;
}

/**
 * ファイル名のサニタイズ
 * 
 * @param filename - サニタイズするファイル名
 * @returns 安全なファイル名
 */
export function sanitizeFilename(filename: string): string {
  // 危険な文字を除去
  let safe = filename
    .replace(/[^a-zA-Z0-9._-]/g, '_') // 英数字、ピリオド、アンダースコア、ハイフン以外を置換
    .replace(/\.{2,}/g, '.') // 連続するピリオドを単一に
    .replace(/^\.+|\.+$/g, ''); // 先頭と末尾のピリオドを除去
  
  // 空になった場合はデフォルト名
  if (!safe) {
    safe = 'unnamed';
  }
  
  // 長さ制限（255文字）
  if (safe.length > 255) {
    const ext = safe.lastIndexOf('.');
    if (ext > 0) {
      const name = safe.substring(0, ext);
      const extension = safe.substring(ext);
      safe = name.substring(0, 255 - extension.length) + extension;
    } else {
      safe = safe.substring(0, 255);
    }
  }
  
  return safe;
}

/**
 * SQLインジェクション対策用の文字列エスケープ
 * ※ 基本的にはプリペアドステートメントを使用すること
 * 
 * @param input - エスケープする文字列
 * @returns エスケープされた文字列
 */
export function escapeSqlString(input: string): string {
  return input
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "''")
    .replace(/"/g, '""')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\x00/g, '\\0')
    .replace(/\x1a/g, '\\Z');
}