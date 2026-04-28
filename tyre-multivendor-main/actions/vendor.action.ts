'use server';
import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function registerVendor(data: any) {
  try {
    const response = await axios.post(
      `${API_URL}/api/users/register-vendor`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Vendor registration response:', response.data);

    if (response?.data) {
      return {
        data: response.data,
        error: null,
      };
    }
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}
