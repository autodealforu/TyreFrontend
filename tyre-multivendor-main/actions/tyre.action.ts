'use server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getTyres() {
  const response = await fetch(`${API_URL}/tyres`, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tyres');
  }

  return response.json();
}

export async function getTyre(id: string) {
  const response = await fetch(`${API_URL}/tyres/${id}`, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tyre');
  }

  return response.json();
}
