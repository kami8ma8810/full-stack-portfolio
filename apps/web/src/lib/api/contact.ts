import { apiConfig } from '@portfolio/config';
import type { ContactForm } from '@portfolio/types';
import { apiClient } from './client';

export interface ContactResponse {
  success: boolean;
  message: string;
  contactId?: number;
}

/**
 * お問い合わせ関連のAPI
 */
export const contactApi = {
  /**
   * お問い合わせを送信
   */
  async submit(data: ContactForm): Promise<ContactResponse> {
    const response = await apiClient.post<ContactResponse>(
      apiConfig.endpoints.contact,
      data
    );
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    return response.data!;
  },
};