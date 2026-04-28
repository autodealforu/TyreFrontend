'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const logout = async () => {
    try {
      await signOut({
        redirect: false,
        callbackUrl: '/',
      });
      toast.success('Logged out successfully');
      router.push('/');
      router.refresh();
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const requireAuth = (redirectTo = '/login') => {
    if (status === 'loading') return null;
    if (!session) {
      router.push(redirectTo);
      return null;
    }
    return session;
  };

  return {
    user: session?.user || null,
    session,
    isAuthenticated: !!session,
    isLoading: status === 'loading',
    logout,
    requireAuth,
    accessToken: session?.accessToken || null,
  };
}
