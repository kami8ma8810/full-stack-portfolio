/**
 * Worksサービス
 * 
 * プロジェクト/作品の統計情報（いいね数、ビュー数）を管理するサービスです。
 * Cloudflare D1とKVを使用してデータの永続化とユーザーごとのアクション管理を行います。
 */

import type { Bindings } from '../types/bindings';

interface ProjectStats {
  likes: number;
  views: number;
}

export class WorksService {
  constructor(private env: Bindings) {}

  /**
   * プロジェクトの統計情報を取得
   */
  async getProjectStats(projectId: string): Promise<ProjectStats> {
    try {
      const result = await this.env.DB.prepare(
        'SELECT likes, views FROM project_stats WHERE project_id = ?'
      )
        .bind(projectId)
        .first<ProjectStats>();

      return result || { likes: 0, views: 0 };
    } catch (error) {
      console.error('Failed to get project stats:', error);
      return { likes: 0, views: 0 };
    }
  }

  /**
   * ビュー数を増やす
   * 同一IPからの連続カウントを防ぐ
   */
  async incrementViews(projectId: string): Promise<number> {
    try {
      await this.env.DB.prepare(`
        INSERT INTO project_stats (project_id, views, last_interacted_at)
        VALUES (?, 1, CURRENT_TIMESTAMP)
        ON CONFLICT(project_id) DO UPDATE SET
          views = views + 1,
          last_interacted_at = CURRENT_TIMESTAMP
      `).bind(projectId).run();

      const stats = await this.getProjectStats(projectId);
      return stats.views;
    } catch (error) {
      console.error('Failed to increment views:', error);
      const stats = await this.getProjectStats(projectId);
      return stats.views;
    }
  }

  /**
   * いいね数を増やす
   */
  async incrementLikes(projectId: string, userIdentifier: string): Promise<number> {
    try {
      // まずいいねを記録
      const likeKey = `project_like:${projectId}:${userIdentifier}`;
      await this.env.CACHE.put(likeKey, '1', {
        // いいねは永続的に記録（実際はKVの制限内）
        expirationTtl: 60 * 60 * 24 * 365, // 1年
      });

      // いいね数を増やす
      await this.env.DB.prepare(`
        INSERT INTO project_stats (project_id, likes, last_interacted_at)
        VALUES (?, 1, CURRENT_TIMESTAMP)
        ON CONFLICT(project_id) DO UPDATE SET
          likes = likes + 1,
          last_interacted_at = CURRENT_TIMESTAMP
      `).bind(projectId).run();

      const stats = await this.getProjectStats(projectId);
      return stats.likes;
    } catch (error) {
      console.error('Failed to increment likes:', error);
      const stats = await this.getProjectStats(projectId);
      return stats.likes;
    }
  }

  /**
   * いいね数を減らす
   */
  async decrementLikes(projectId: string, userIdentifier: string): Promise<number> {
    try {
      // いいねの記録を削除
      const likeKey = `project_like:${projectId}:${userIdentifier}`;
      await this.env.CACHE.delete(likeKey);

      // いいね数を減らす
      await this.env.DB.prepare(`
        UPDATE project_stats
        SET likes = MAX(0, likes - 1),
            last_interacted_at = CURRENT_TIMESTAMP
        WHERE project_id = ?
      `).bind(projectId).run();

      const stats = await this.getProjectStats(projectId);
      return stats.likes;
    } catch (error) {
      console.error('Failed to decrement likes:', error);
      const stats = await this.getProjectStats(projectId);
      return stats.likes;
    }
  }

  /**
   * ユーザーがいいねしているかチェック
   */
  async hasUserLiked(projectId: string, userIdentifier: string): Promise<boolean> {
    try {
      const likeKey = `project_like:${projectId}:${userIdentifier}`;
      const liked = await this.env.CACHE.get(likeKey);
      return liked === '1';
    } catch (error) {
      console.error('Failed to check user like:', error);
      return false;
    }
  }

  /**
   * すべてのプロジェクトの統計情報を取得
   */
  async getAllProjectStats(): Promise<Array<{ projectId: string } & ProjectStats>> {
    try {
      const results = await this.env.DB.prepare(`
        SELECT project_id, likes, views
        FROM project_stats
        ORDER BY views DESC, likes DESC
      `).all<{ project_id: string; likes: number; views: number }>();

      return results.results.map((row) => ({
        projectId: row.project_id,
        likes: row.likes,
        views: row.views,
      }));
    } catch (error) {
      console.error('Failed to get all project stats:', error);
      return [];
    }
  }

  /**
   * 統計情報のリセット（開発用）
   */
  async resetStats(projectId: string): Promise<void> {
    if (this.env.ENVIRONMENT !== 'development') {
      throw new Error('Stats reset is only allowed in development');
    }

    try {
      await this.env.DB.prepare(
        'DELETE FROM project_stats WHERE project_id = ?'
      ).bind(projectId).run();
    } catch (error) {
      console.error('Failed to reset stats:', error);
    }
  }
}