import { apiConfig } from '@portfolio/config';
import type { BlogPost, Pagination } from '@portfolio/types';
import { apiClient } from './client';

export interface BlogListParams {
  page?: number;
  limit?: number;
  status?: 'all' | 'published' | 'draft';
  tag?: string;
}

export interface BlogListResponse {
  posts: BlogPost[];
  pagination: Pagination;
}

/**
 * ブログ関連のAPI
 */
export const blogApi = {
  /**
   * ブログ記事一覧を取得
   */
  async getList(params?: BlogListParams): Promise<BlogListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.tag) searchParams.append('tag', params.tag);
    
    const endpoint = `${apiConfig.endpoints.blog}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    const response = await apiClient.get<BlogListResponse>(endpoint);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    return response.data!;
  },

  /**
   * ブログ記事詳細を取得
   */
  async getPost(slug: string): Promise<BlogPost> {
    const response = await apiClient.get<BlogPost>(`${apiConfig.endpoints.blog}/${slug}`);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    return response.data!;
  },

  /**
   * ビュー数を増やす
   */
  async incrementView(slug: string): Promise<{ viewCount: number }> {
    const response = await apiClient.post<{ viewCount: number }>(
      `${apiConfig.endpoints.blog}/${slug}/view`
    );
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    return response.data!;
  },

  /**
   * タグ一覧を取得
   */
  async getTags(): Promise<string[]> {
    const response = await apiClient.get<{ tags: string[] }>(`${apiConfig.endpoints.blog}/tags`);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    return response.data!.tags;
  },
};