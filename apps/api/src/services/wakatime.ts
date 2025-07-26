/**
 * WakaTime APIサービス
 * 
 * WakaTime APIを使用してコーディング時間の統計情報を取得するサービスです。
 * 週間のコーディング時間、言語別・エディタ別の使用時間などを取得します。
 */

import type { Bindings } from '../types/bindings';
import type { WakaTimeStats } from '@portfolio/types';

/**
 * WakaTime APIのレスポンス型
 */
interface WakaTimeStatsResponse {
  data: {
    total_seconds: number;
    daily_average: number;
    languages: Array<{
      name: string;
      total_seconds: number;
      percent: number;
    }>;
    editors: Array<{
      name: string;
      total_seconds: number;
      percent: number;
    }>;
    projects: Array<{
      name: string;
      total_seconds: number;
      percent: number;
    }>;
  };
}

export class WakaTimeService {
  private readonly apiUrl = 'https://wakatime.com/api/v1';

  constructor(private env: Bindings) {}

  /**
   * 週間の統計情報を取得
   */
  async getWeeklyStats(): Promise<WakaTimeStats> {
    try {
      // 過去7日間の統計を取得
      const response = await fetch(
        `${this.apiUrl}/users/current/stats/last_7_days`,
        {
          headers: {
            'Authorization': `Bearer ${this.env.WAKATIME_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`WakaTime API error: ${response.status}`);
      }

      const result = await response.json<WakaTimeStatsResponse>();
      const data = result.data;

      // 秒を時間に変換
      const totalHours = data.total_seconds / 3600;
      const dailyAverageHours = data.daily_average / 3600;

      return {
        totalHoursThisWeek: Math.round(totalHours * 10) / 10, // 小数点1位まで
        dailyAverage: Math.round(dailyAverageHours * 10) / 10,
        languages: data.languages.slice(0, 5).map((lang) => ({
          name: lang.name,
          hours: Math.round((lang.total_seconds / 3600) * 10) / 10,
          percentage: Math.round(lang.percent * 10) / 10,
        })),
        editors: data.editors.slice(0, 3).map((editor) => ({
          name: editor.name,
          hours: Math.round((editor.total_seconds / 3600) * 10) / 10,
          percentage: Math.round(editor.percent * 10) / 10,
        })),
      };
    } catch (error) {
      console.error('Failed to fetch WakaTime stats:', error);
      throw error;
    }
  }

  /**
   * 日別のコーディング時間を取得（グラフ用）
   */
  async getDailyStats(days: number = 30): Promise<{
    dates: string[];
    hours: number[];
  }> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const response = await fetch(
        `${this.apiUrl}/users/current/summaries?` +
        `start=${this.formatDate(startDate)}&` +
        `end=${this.formatDate(endDate)}`,
        {
          headers: {
            'Authorization': `Bearer ${this.env.WAKATIME_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`WakaTime API error: ${response.status}`);
      }

      const result = await response.json<{
        data: Array<{
          grand_total: {
            total_seconds: number;
          };
          range: {
            date: string;
          };
        }>;
      }>();

      const dates: string[] = [];
      const hours: number[] = [];

      for (const day of result.data) {
        dates.push(day.range.date);
        hours.push(Math.round((day.grand_total.total_seconds / 3600) * 10) / 10);
      }

      return { dates, hours };
    } catch (error) {
      console.error('Failed to fetch daily stats:', error);
      throw error;
    }
  }

  /**
   * プロジェクト別の統計を取得
   */
  async getProjectStats(): Promise<Array<{
    name: string;
    hours: number;
    percentage: number;
  }>> {
    try {
      const response = await fetch(
        `${this.apiUrl}/users/current/stats/last_7_days`,
        {
          headers: {
            'Authorization': `Bearer ${this.env.WAKATIME_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`WakaTime API error: ${response.status}`);
      }

      const result = await response.json<WakaTimeStatsResponse>();
      
      return result.data.projects.slice(0, 10).map((project) => ({
        name: project.name,
        hours: Math.round((project.total_seconds / 3600) * 10) / 10,
        percentage: Math.round(project.percent * 10) / 10,
      }));
    } catch (error) {
      console.error('Failed to fetch project stats:', error);
      throw error;
    }
  }

  /**
   * 今日のコーディング時間を取得
   */
  async getTodayStats(): Promise<{
    hours: number;
    minutes: number;
  }> {
    try {
      const today = this.formatDate(new Date());
      
      const response = await fetch(
        `${this.apiUrl}/users/current/summaries?start=${today}&end=${today}`,
        {
          headers: {
            'Authorization': `Bearer ${this.env.WAKATIME_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`WakaTime API error: ${response.status}`);
      }

      const result = await response.json<{
        data: Array<{
          grand_total: {
            total_seconds: number;
          };
        }>;
      }>();

      if (result.data.length === 0) {
        return { hours: 0, minutes: 0 };
      }

      const totalSeconds = result.data[0].grand_total.total_seconds;
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);

      return { hours, minutes };
    } catch (error) {
      console.error('Failed to fetch today stats:', error);
      throw error;
    }
  }

  /**
   * 日付をWakaTime APIの形式にフォーマット
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * コーディングゴールの進捗を取得
   */
  async getGoalProgress(): Promise<{
    dailyGoal: number;
    weeklyGoal: number;
    dailyProgress: number;
    weeklyProgress: number;
  }> {
    try {
      // ゴール設定を取得
      const goalsResponse = await fetch(
        `${this.apiUrl}/users/current/goals`,
        {
          headers: {
            'Authorization': `Bearer ${this.env.WAKATIME_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!goalsResponse.ok) {
        // ゴールが設定されていない場合はデフォルト値を返す
        return {
          dailyGoal: 4, // デフォルト4時間
          weeklyGoal: 20, // デフォルト20時間
          dailyProgress: 0,
          weeklyProgress: 0,
        };
      }

      const goals = await goalsResponse.json<{
        data: Array<{
          type: string;
          target: number;
        }>;
      }>();

      // 現在の統計を取得
      const stats = await this.getWeeklyStats();
      const todayStats = await this.getTodayStats();

      const dailyGoal = goals.data.find(g => g.type === 'daily')?.target || 4;
      const weeklyGoal = goals.data.find(g => g.type === 'weekly')?.target || 20;

      const todayHours = todayStats.hours + todayStats.minutes / 60;

      return {
        dailyGoal,
        weeklyGoal,
        dailyProgress: Math.round((todayHours / dailyGoal) * 100),
        weeklyProgress: Math.round((stats.totalHoursThisWeek / weeklyGoal) * 100),
      };
    } catch (error) {
      console.error('Failed to fetch goal progress:', error);
      return {
        dailyGoal: 4,
        weeklyGoal: 20,
        dailyProgress: 0,
        weeklyProgress: 0,
      };
    }
  }
}