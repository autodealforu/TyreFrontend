'use server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getBlogs(page: number = 1) {
  try {
    const response = await axios.get(`${API_URL}/api/blogs?pageNumber=${page}`);
    return response.data;
  } catch (error: any) {
    console.error('getBlogs error:', error.response?.data || error.message);
    return { blogs: [], page: 1, pages: 1, count: 0 };
  }
}

export async function getBlogBySlug(slug: string) {
  try {
    const response = await axios.get(`${API_URL}/api/blogs/slug/${slug}`);
    return response.data;
  } catch (error: any) {
    console.error('getBlogBySlug error:', error.response?.data || error.message);
    return null;
  }
}
