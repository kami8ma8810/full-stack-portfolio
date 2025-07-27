import { apiConfig } from '@portfolio/config';
import type { GitHubStats, WakaTimeStats } from '@portfolio/types';
import { apiClient } from './client';

export interface StatsSummary {
  github: {
    contributions: number;
    stars: number;
    followers: number;
    topLanguage: string;
  };
  wakatime: {
    weeklyHours: number;
    dailyAverage: number;
    topLanguage: string;
  } | null;
  lastUpdated: string;
}

/**
 * 統計情報関連のAPI
 */
export const statsApi = {
  /**
   * GitHub統計を取得
   */
  async getGitHubStats(): Promise<GitHubStats> {
    const response = await apiClient.get<GitHubStats>(apiConfig.endpoints.stats.github);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    return response.data!;
  },

  /**
   * WakaTime統計を取得
   */
  async getWakaTimeStats(): Promise<WakaTimeStats> {
    const response = await apiClient.get<WakaTimeStats>(apiConfig.endpoints.stats.wakatime);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    return response.data!;
  },

  /**
   * 統計サマリーを取得
   */
  async getSummary(): Promise<StatsSummary> {
    const response = await apiClient.get<StatsSummary>(`${apiConfig.endpoints.stats}/summary`);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    return response.data!;
  },
};