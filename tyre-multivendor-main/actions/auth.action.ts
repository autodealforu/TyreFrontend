'use server';
import axios from 'axios';
import { signOut } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function registerUser(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
}) {
  try {
    const response = await axios.post(
      `${API_URL}/api/users/register`,
      {
        ...data,
        username: data.email, // Use email as username as per your API
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Registration response:', response.data);

    if (response?.data) {
      return {
        data: response.data,
        error: null,
      };
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    return {
      data: null,
      error:
        error?.response?.data?.message ||
        error?.message ||
        'An unexpected error occurred',
    };
  }
}

export async function getUserProfile(token: string) {
  try {
    const response = await axios.get(`${API_URL}/api/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response?.data) {
      return {
        data: response.data,
        error: null,
      };
    }
  } catch (error: any) {
    return {
      data: null,
      error:
        error?.response?.data?.message ||
        error?.message ||
        'Failed to fetch user profile',
    };
  }
}

export async function updateUserProfile(
  token: string,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    address?: {
      address_1: string;
      address_2: string;
      city: string;
      state: string;
      pin: string;
      landmark: string;
    };
  }
) {
  try {
    const response = await axios.put(`${API_URL}/api/users/profile`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response?.data) {
      return {
        data: response.data,
        error: null,
      };
    }
  } catch (error: any) {
    return {
      data: null,
      error:
        error?.response?.data?.message ||
        error?.message ||
        'Failed to update user profile',
    };
  }
}

export async function logoutUser() {
  try {
    // Perform any necessary cleanup here, like revoking tokens, etc.

    // Sign out the user from next-auth
    signOut({ redirect: true, callbackUrl: '/' });
  } catch (error) {
    console.error('Logout error:', error);
  }
}
