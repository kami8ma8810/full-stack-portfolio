/**
 * お問い合わせ関連のAPIルート
 * 
 * お問い合わせフォームの送信処理を行います。
 * スパム対策として、レート制限とバリデーションを実装しています。
 */

import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { HTTPException } from 'hono/http-exception';
import type { Bindings } from '../types/bindings';
import { ContactService } from '../services/contact';

const contactRoutes = new Hono<{ Bindings: Bindings }>();

/**
 * お問い合わせフォームのバリデーションスキーマ
 */
const contactSchema = z.object({
  name: z
    .string()
    .min(1, 'お名前を入力してください')
    .max(100, 'お名前は100文字以内で入力してください'),
  email: z
    .string()
    .email('正しいメールアドレスを入力してください')
    .max(255, 'メールアドレスは255文字以内で入力してください'),
  message: z
    .string()
    .min(10, 'メッセージは10文字以上で入力してください')
    .max(1000, 'メッセージは1000文字以内で入力してください'),
});

/**
 * POST /api/contact
 * お問い合わせを送信
 */
contactRoutes.post('/', zValidator('json', contactSchema), async (c) => {
  const data = c.req.valid('json');
  const contactService = new ContactService(c.env);

  try {
    // IPアドレスとユーザーエージェントを取得
    const ip = c.req.header('CF-Connecting-IP') || 'unknown';
    const userAgent = c.req.header('User-Agent') || 'unknown';

    // 同一IPからの連続送信をチェック（スパム対策）
    const recentSubmission = await contactService.hasRecentSubmission(ip);
    if (recentSubmission) {
      throw new HTTPException(429, {
        message: '連続して送信することはできません。しばらく時間をおいてから再度お試しください。',
      });
    }

    // 禁止ワードチェック（スパム対策）
    const isSpam = await contactService.checkSpamContent(data.message);
    if (isSpam) {
      // スパムの可能性がある場合も正常レスポンスを返す（攻撃者に情報を与えない）
      console.warn('Potential spam detected:', { ip, email: data.email });
      return c.json({
        success: true,
        message: 'お問い合わせを受け付けました。ありがとうございます。',
      });
    }

    // お問い合わせを保存
    const contactId = await contactService.saveContact({
      ...data,
      ip,
      userAgent,
    });

    // 通知を送信（オプション）
    // 実際の運用では、メール送信やSlack通知などを実装
    if (c.env.ENVIRONMENT === 'production') {
      await contactService.sendNotification(contactId, data);
    }

    return c.json({
      success: true,
      message: 'お問い合わせを受け付けました。ありがとうございます。',
      contactId: c.env.ENVIRONMENT === 'development' ? contactId : undefined,
    });
  } catch (error) {
    console.error('Failed to process contact:', error);
    
    // HTTPExceptionの場合はそのままthrow
    if (error instanceof HTTPException) {
      throw error;
    }
    
    // その他のエラーは500エラーとして処理
    throw new HTTPException(500, {
      message: 'お問い合わせの送信に失敗しました。時間をおいて再度お試しください。',
    });
  }
});

/**
 * GET /api/contact/status
 * お問い合わせフォームのステータスを取得（管理者用）
 */
contactRoutes.get('/status', async (c) => {
  // 簡易的な認証（実際の運用では適切な認証を実装）
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new HTTPException(401, { message: 'Unauthorized' });
  }

  const contactService = new ContactService(c.env);

  try {
    const stats = await contactService.getContactStats();
    return c.json(stats);
  } catch (error) {
    console.error('Failed to fetch contact stats:', error);
    throw error;
  }
});

export { contactRoutes };