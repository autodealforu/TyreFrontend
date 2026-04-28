'use client';

import { Address } from '@/types/checkout';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  address?: Address;
  addresses?: Address[];
}

export class ApiClient {
  private static async makeRequest<T = any>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  static async getUserAddresses(
    userId: string,
    token: string
  ): Promise<{
    success: boolean;
    addresses?: Address[];
    message?: string;
  }> {
    try {
      const result = await this.makeRequest<Address[]>(
        `/api/users/${userId}/addresses`,
        { method: 'GET' },
        token
      );

      return {
        success: result.success,
        addresses: result.data || result.addresses,
        message: result.message,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch addresses',
      };
    }
  }

  static async addUserAddress(
    userId: string,
    address: Omit<Address, 'id'>,
    token: string
  ): Promise<{
    success: boolean;
    message: string;
    address?: Address;
  }> {
    try {
      const result = await this.makeRequest<Address>(
        `/api/users/${userId}/addresses`,
        {
          method: 'POST',
          body: JSON.stringify(address),
        },
        token
      );

      return {
        success: result.success,
        message: result.message,
        address: result.data || result.address,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to add address',
      };
    }
  }

  static async validateCoupon(
    code: string,
    orderTotal: number,
    token?: string
  ): Promise<{
    success: boolean;
    message: string;
    discount?: number;
  }> {
    try {
      const result = await this.makeRequest<{ discount: number }>(
        '/api/coupons/validate',
        {
          method: 'POST',
          body: JSON.stringify({ code, orderTotal }),
        },
        token
      );

      return {
        success: result.success,
        message: result.message,
        discount: result.data?.discount,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to validate coupon',
      };
    }
  }
}
