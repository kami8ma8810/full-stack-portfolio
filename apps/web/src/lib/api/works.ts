import { apiConfig } from '@portfolio/config';
import type { Work } from '@portfolio/types';
import { apiClient } from './client';

/**
 * Works（プロジェクト）関連のAPI
 */
export const worksApi = {
  /**
   * プロジェクト一覧を取得
   */
  async getList(): Promise<Work[]> {
    const response = await apiClient.get<{ works: Work[] }>(apiConfig.endpoints.works);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    return response.data!.works;
  },

  /**
   * プロジェクト詳細を取得
   */
  async getWork(id: string): Promise<Work> {
    const response = await apiClient.get<Work>(`${apiConfig.endpoints.works}/${id}`);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    return response.data!;
  },

  /**
   * いいねをつける
   */
  async like(id: string): Promise<{ likes: number }> {
    const response = await apiClient.post<{ likes: number }>(
      `${apiConfig.endpoints.works}/${id}/like`
    );
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    return response.data!;
  },

  /**
   * いいねを取り消す
   */
  async unlike(id: string): Promise<{ likes: number }> {
    const response = await apiClient.delete<{ likes: number }>(
      `${apiConfig.endpoints.works}/${id}/like`
    );
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    return response.data!;
  },
};