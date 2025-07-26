/**
 * 統計情報キャッシュサービス
 * 
 * 外部APIから取得した統計情報をキャッシュ管理するサービスです。
 * Cloudflare KVを使用して、APIレート制限を考慮したキャッシュを実装します。
 */

import type { Bindings } from '../types/bindings';

export class StatsService {
  constructor(private env: Bindings) {}

  /**
   * キャッシュから統計情報を取得
   */
  async getCachedStats<T>(key: string): Promise<T | null> {
    try {
      const cacheKey = `stats:${key}`;
      const cached = await this.env.CACHE.get(cacheKey);
      
      if (!cached) {
        return null;
      }

      return JSON.parse(cached) as T;
    } catch (error) {
      console.error('Failed to get cached stats:', error);
      return null;
    }
  }

  /**
   * 統計情報をキャッシュに保存
   */
  async cacheStats<T>(key: string, data: T, ttlSeconds: number): Promise<void> {
    try {
      const cacheKey = `stats:${key}`;
      await this.env.CACHE.put(
        cacheKey,
        JSON.stringify(data),
        {
          expirationTtl: ttlSeconds,
        }
      );
    } catch (error) {
      console.error('Failed to cache stats:', error);
      // キャッシュの失敗は無視
    }
  }

  /**
   * キャッシュを削除
   */
  async clearCache(key: string): Promise<void> {
    try {
      const cacheKey = `stats:${key}`;
      await this.env.CACHE.delete(cacheKey);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  /**
   * APIアクセスログを記録（分析用）
   */
  async logApiAccess(
    method: string,
    path: string,
    statusCode: number,
    responseTime: number,
    ip: string,
    userAgent: string
  ): Promise<void> {
    try {
      await this.env.DB.prepare(`
        INSERT INTO api_logs (method, path, status_code, response_time, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
        .bind(method, path, statusCode, responseTime, ip, userAgent)
        .run();
    } catch (error) {
      console.error('Failed to log API access:', error);
      // ログの失敗は無視
    }
  }

  /**
   * APIアクセス統計を取得
   */
  async getApiStats(): Promise<{
    totalRequests: number;
    averageResponseTime: number;
    popularEndpoints: Array<{ path: string; count: number }>;
    errorRate: number;
  }> {
    try {
      // 総リクエスト数
      const totalResult = await this.env.DB.prepare(
        'SELECT COUNT(*) as count FROM api_logs'
      ).first<{ count: number }>();

      // 平均レスポンス時間
      const avgResult = await this.env.DB.prepare(
        'SELECT AVG(response_time) as avg FROM api_logs'
      ).first<{ avg: number }>();

      // 人気のエンドポイント
      const popularResult = await this.env.DB.prepare(`
        SELECT path, COUNT(*) as count
        FROM api_logs
        GROUP BY path
        ORDER BY count DESC
        LIMIT 10
      `).all<{ path: string; count: number }>();

      // エラー率
      const errorResult = await this.env.DB.prepare(`
        SELECT 
          COUNT(CASE WHEN status_code >= 400 THEN 1 END) * 100.0 / COUNT(*) as error_rate
        FROM api_logs
      `).first<{ error_rate: number }>();

      return {
        totalRequests: totalResult?.count || 0,
        averageResponseTime: Math.round(avgResult?.avg || 0),
        popularEndpoints: popularResult.results || [],
        errorRate: Math.round((errorResult?.error_rate || 0) * 10) / 10,
      };
    } catch (error) {
      console.error('Failed to get API stats:', error);
      return {
        totalRequests: 0,
        averageResponseTime: 0,
        popularEndpoints: [],
        errorRate: 0,
      };
    }
  }

  /**
   * 古いログを削除（定期実行用）
   */
  async cleanupOldLogs(daysToKeep: number = 30): Promise<void> {
    try {
      await this.env.DB.prepare(`
        DELETE FROM api_logs
        WHERE created_at < datetime('now', '-${daysToKeep} days')
      `).run();

      // 期限切れキャッシュも削除
      await this.env.DB.prepare(`
        DELETE FROM cache_entries
        WHERE expires_at < datetime('now')
      `).run();
    } catch (error) {
      console.error('Failed to cleanup old logs:', error);
    }
  }
}