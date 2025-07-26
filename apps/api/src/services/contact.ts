/**
 * お問い合わせサービス
 * 
 * お問い合わせフォームの処理とスパム対策を行うサービスです。
 * Cloudflare D1でデータを保存し、KVでレート制限を実装します。
 */

import type { Bindings } from '../types/bindings';
import type { ContactForm } from '@portfolio/types';

interface ContactSubmission extends ContactForm {
  ip: string;
  userAgent: string;
}

export class ContactService {
  constructor(private env: Bindings) {}

  /**
   * お問い合わせを保存
   */
  async saveContact(data: ContactSubmission): Promise<number> {
    try {
      const result = await this.env.DB.prepare(`
        INSERT INTO contacts (name, email, message, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?)
      `)
        .bind(data.name, data.email, data.message, data.ip, data.userAgent)
        .run();

      // 挿入されたIDを返す
      return result.meta.last_row_id as number;
    } catch (error) {
      console.error('Failed to save contact:', error);
      throw new Error('Failed to save contact submission');
    }
  }

  /**
   * 同一IPからの最近の送信をチェック
   * 5分以内の連続送信を防ぐ
   */
  async hasRecentSubmission(ip: string): Promise<boolean> {
    try {
      const key = `contact_submission:${ip}`;
      const recent = await this.env.CACHE.get(key);
      
      if (recent) {
        return true;
      }

      // 送信記録を保存（5分間有効）
      await this.env.CACHE.put(key, '1', {
        expirationTtl: 300, // 5分
      });

      return false;
    } catch (error) {
      console.error('Failed to check recent submission:', error);
      // エラー時は安全のため送信を許可
      return false;
    }
  }

  /**
   * スパムコンテンツのチェック
   * 簡易的な実装（実際の運用では、より高度なスパムフィルターを使用）
   */
  async checkSpamContent(message: string): Promise<boolean> {
    // スパムキーワードのリスト
    const spamKeywords = [
      'viagra',
      'casino',
      'lottery',
      'prize',
      'winner',
      'click here',
      'buy now',
      'limited time',
      '100% free',
      'act now',
      'call now',
      'order now',
    ];

    // URLの過剰な含有をチェック
    const urlPattern = /https?:\/\//gi;
    const urlMatches = message.match(urlPattern) || [];
    if (urlMatches.length > 3) {
      return true;
    }

    // スパムキーワードのチェック（大文字小文字を無視）
    const lowerMessage = message.toLowerCase();
    for (const keyword of spamKeywords) {
      if (lowerMessage.includes(keyword)) {
        return true;
      }
    }

    // 過剰な大文字使用のチェック
    const upperCaseRatio = (message.match(/[A-Z]/g) || []).length / message.length;
    if (upperCaseRatio > 0.5 && message.length > 20) {
      return true;
    }

    return false;
  }

  /**
   * 通知を送信（実装例）
   * 実際の運用では、SendGridやSlack APIなどを使用
   */
  async sendNotification(contactId: number, data: ContactForm): Promise<void> {
    try {
      // Slack Webhook URLが設定されている場合
      if (this.env.SLACK_WEBHOOK_URL) {
        const response = await fetch(this.env.SLACK_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: '新しいお問い合わせがありました',
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*新しいお問い合わせ #${contactId}*`,
                },
              },
              {
                type: 'section',
                fields: [
                  {
                    type: 'mrkdwn',
                    text: `*お名前:*\n${data.name}`,
                  },
                  {
                    type: 'mrkdwn',
                    text: `*メール:*\n${data.email}`,
                  },
                ],
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*メッセージ:*\n${data.message}`,
                },
              },
            ],
          }),
        });

        if (!response.ok) {
          console.error('Failed to send Slack notification');
        }
      }
    } catch (error) {
      console.error('Failed to send notification:', error);
      // 通知の失敗は無視（メインの処理には影響させない）
    }
  }

  /**
   * お問い合わせの統計情報を取得
   */
  async getContactStats(): Promise<{
    total: number;
    unread: number;
    today: number;
    thisWeek: number;
  }> {
    try {
      // 総数
      const totalResult = await this.env.DB.prepare(
        'SELECT COUNT(*) as count FROM contacts'
      ).first<{ count: number }>();

      // 未読数
      const unreadResult = await this.env.DB.prepare(
        'SELECT COUNT(*) as count FROM contacts WHERE status = ?'
      ).bind('unread').first<{ count: number }>();

      // 今日の件数
      const todayResult = await this.env.DB.prepare(`
        SELECT COUNT(*) as count FROM contacts
        WHERE date(created_at) = date('now')
      `).first<{ count: number }>();

      // 今週の件数
      const weekResult = await this.env.DB.prepare(`
        SELECT COUNT(*) as count FROM contacts
        WHERE date(created_at) >= date('now', '-7 days')
      `).first<{ count: number }>();

      return {
        total: totalResult?.count || 0,
        unread: unreadResult?.count || 0,
        today: todayResult?.count || 0,
        thisWeek: weekResult?.count || 0,
      };
    } catch (error) {
      console.error('Failed to get contact stats:', error);
      return {
        total: 0,
        unread: 0,
        today: 0,
        thisWeek: 0,
      };
    }
  }

  /**
   * お問い合わせを既読にする
   */
  async markAsRead(contactId: number): Promise<void> {
    try {
      await this.env.DB.prepare(
        'UPDATE contacts SET status = ? WHERE id = ?'
      ).bind('read', contactId).run();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  }

  /**
   * お問い合わせ一覧を取得（管理用）
   */
  async getContacts(options: {
    page: number;
    limit: number;
    status?: 'unread' | 'read' | 'replied';
  }): Promise<{
    contacts: Array<{
      id: number;
      name: string;
      email: string;
      message: string;
      status: string;
      createdAt: string;
    }>;
    total: number;
  }> {
    try {
      const offset = (options.page - 1) * options.limit;
      let query = 'SELECT * FROM contacts';
      const params: any[] = [];

      if (options.status) {
        query += ' WHERE status = ?';
        params.push(options.status);
      }

      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(options.limit, offset);

      const results = await this.env.DB.prepare(query)
        .bind(...params)
        .all();

      // 総数を取得
      let countQuery = 'SELECT COUNT(*) as count FROM contacts';
      if (options.status) {
        countQuery += ' WHERE status = ?';
      }
      
      const countResult = await this.env.DB.prepare(countQuery)
        .bind(...(options.status ? [options.status] : []))
        .first<{ count: number }>();

      return {
        contacts: results.results.map((row: any) => ({
          id: row.id,
          name: row.name,
          email: row.email,
          message: row.message,
          status: row.status,
          createdAt: row.created_at,
        })),
        total: countResult?.count || 0,
      };
    } catch (error) {
      console.error('Failed to get contacts:', error);
      return {
        contacts: [],
        total: 0,
      };
    }
  }
}