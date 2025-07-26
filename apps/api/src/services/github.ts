/**
 * GitHub APIサービス
 * 
 * GitHub GraphQL APIを使用してユーザーの統計情報を取得するサービスです。
 * コントリビューション数、言語使用率、リポジトリ情報などを取得します。
 */

import type { Bindings } from '../types/bindings';
import type { GitHubStats } from '@portfolio/types';

/**
 * GitHub GraphQLのレスポンス型
 */
interface GitHubGraphQLResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
        };
      };
      repositories: {
        totalCount: number;
        nodes: Array<{
          stargazerCount: number;
          primaryLanguage: {
            name: string;
            color: string;
          } | null;
          languages: {
            edges: Array<{
              size: number;
              node: {
                name: string;
                color: string;
              };
            }>;
          };
        }>;
      };
      followers: {
        totalCount: number;
      };
    };
  };
}

export class GitHubService {
  private readonly apiUrl = 'https://api.github.com/graphql';

  constructor(private env: Bindings) {}

  /**
   * GitHubユーザーの統計情報を取得
   */
  async getUserStats(): Promise<GitHubStats> {
    try {
      const query = `
        query($username: String!) {
          user(login: $username) {
            contributionsCollection {
              contributionCalendar {
                totalContributions
              }
            }
            repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC) {
              totalCount
              nodes {
                stargazerCount
                primaryLanguage {
                  name
                  color
                }
                languages(first: 10) {
                  edges {
                    size
                    node {
                      name
                      color
                    }
                  }
                }
              }
            }
            followers {
              totalCount
            }
          }
        }
      `;

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.env.GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Portfolio-API',
        },
        body: JSON.stringify({
          query,
          variables: {
            username: this.env.GITHUB_USERNAME,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const result = await response.json<GitHubGraphQLResponse>();
      
      if (!result.data?.user) {
        throw new Error('User not found');
      }

      const user = result.data.user;
      
      // 言語使用統計を集計
      const languageStats = this.calculateLanguageStats(user.repositories.nodes);
      
      // 総スター数を計算
      const totalStars = user.repositories.nodes.reduce(
        (sum, repo) => sum + repo.stargazerCount,
        0
      );

      return {
        username: this.env.GITHUB_USERNAME,
        totalContributions: user.contributionsCollection.contributionCalendar.totalContributions,
        totalStars,
        followers: user.followers.totalCount,
        languages: languageStats,
      };
    } catch (error) {
      console.error('Failed to fetch GitHub stats:', error);
      throw error;
    }
  }

  /**
   * 言語使用統計を計算
   */
  private calculateLanguageStats(
    repositories: GitHubGraphQLResponse['data']['user']['repositories']['nodes']
  ): GitHubStats['languages'] {
    const languageMap = new Map<string, { size: number; color: string }>();

    // 各リポジトリの言語情報を集計
    for (const repo of repositories) {
      if (!repo.languages.edges.length) continue;

      for (const edge of repo.languages.edges) {
        const { name, color } = edge.node;
        const current = languageMap.get(name) || { size: 0, color };
        languageMap.set(name, {
          size: current.size + edge.size,
          color,
        });
      }
    }

    // サイズでソートして上位言語を取得
    const sortedLanguages = Array.from(languageMap.entries())
      .sort((a, b) => b[1].size - a[1].size)
      .slice(0, 10); // 上位10言語

    // 総サイズを計算
    const totalSize = sortedLanguages.reduce((sum, [, data]) => sum + data.size, 0);

    // パーセンテージを計算して返す
    return sortedLanguages.map(([name, data]) => ({
      name,
      percentage: Math.round((data.size / totalSize) * 1000) / 10, // 小数点1位まで
      color: data.color,
    }));
  }

  /**
   * 特定のリポジトリ情報を取得
   */
  async getRepository(owner: string, name: string): Promise<{
    name: string;
    description: string;
    stars: number;
    forks: number;
    language: string;
    topics: string[];
  }> {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
        headers: {
          'Authorization': `Bearer ${this.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-API',
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const repo = await response.json<any>();

      return {
        name: repo.name,
        description: repo.description || '',
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language || 'Unknown',
        topics: repo.topics || [],
      };
    } catch (error) {
      console.error('Failed to fetch repository:', error);
      throw error;
    }
  }

  /**
   * コントリビューショングラフデータを取得
   */
  async getContributionGraph(): Promise<{
    weeks: Array<{
      days: Array<{
        date: string;
        count: number;
        level: number;
      }>;
    }>;
  }> {
    try {
      const query = `
        query($username: String!) {
          user(login: $username) {
            contributionsCollection {
              contributionCalendar {
                weeks {
                  contributionDays {
                    date
                    contributionCount
                    contributionLevel
                  }
                }
              }
            }
          }
        }
      `;

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.env.GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Portfolio-API',
        },
        body: JSON.stringify({
          query,
          variables: {
            username: this.env.GITHUB_USERNAME,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const result = await response.json<any>();
      const weeks = result.data.user.contributionsCollection.contributionCalendar.weeks;

      return {
        weeks: weeks.map((week: any) => ({
          days: week.contributionDays.map((day: any) => ({
            date: day.date,
            count: day.contributionCount,
            level: this.contributionLevelToNumber(day.contributionLevel),
          })),
        })),
      };
    } catch (error) {
      console.error('Failed to fetch contribution graph:', error);
      throw error;
    }
  }

  /**
   * コントリビューションレベルを数値に変換
   */
  private contributionLevelToNumber(level: string): number {
    const levels: Record<string, number> = {
      'NONE': 0,
      'FIRST_QUARTILE': 1,
      'SECOND_QUARTILE': 2,
      'THIRD_QUARTILE': 3,
      'FOURTH_QUARTILE': 4,
    };
    return levels[level] || 0;
  }
}