import { apiClient } from './client';
import { apiConfig } from '@portfolio/config';
import type { BlogPost, ApiResponse } from '@portfolio/types';

export interface BlogListParams {
  page?: number;
  limit?: number;
  tag?: string;
}

export interface BlogListResponse {
  posts: BlogPost[];
  totalPages: number;
  currentPage: number;
  totalPosts: number;
  tags?: string[];
}

// Server Component用のblog API (Next.jsのキャッシュを活用)
export const blogApiServer = {
  /**
   * ブログ記事一覧を取得
   */
  async getList(params?: BlogListParams): Promise<BlogListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.tag) searchParams.append('tag', params.tag);

    const response = await fetch(
      `${apiConfig.baseUrl}/api/blog?${searchParams}`,
      {
        // Next.js 15のキャッシュ設定
        next: { 
          revalidate: 300, // 5分間キャッシュ
          tags: ['blog-posts']
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch blog posts: ${response.status}`);
    }

    return response.json();
  },

  /**
   * ブログ記事詳細を取得
   */
  async getBySlug(slug: string): Promise<BlogPost> {
    const response = await fetch(
      `${apiConfig.baseUrl}/api/blog/${slug}`,
      {
        next: { 
          revalidate: 300,
          tags: [`blog-post-${slug}`]
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch blog post: ${response.status}`);
    }

    return response.json();
  },
};