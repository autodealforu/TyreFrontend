import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'http://localhost:3003';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'otp-login',
      name: 'OTP Login',
      credentials: {
        phone: { label: 'Phone', type: 'text' },
        otp: { label: 'OTP', type: 'text' },
        token: { label: 'Token', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp || !credentials?.token) {
          throw new Error('Please provide phone, OTP, and token');
        }

        try {
          const response = await axios.post(`${API_URL}/api/users/websites/verify-otp`, {
            otp: credentials.otp,
            token: credentials.token,
          });

          const user = response.data.user;
          const token = response.data.token;

          if (user && token) {
            return {
              id: user._id,
              name: user.name,
              email: user.email || '',
              username: user.username,
              phone: user.phone || '',
              address: user.address || '',
              role: user.role,
              token: token,
            };
          }
          return null;
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Invalid OTP';
          throw new Error(errorMessage);
        }
      },
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Please provide both username and password');
        }

        console.log('Attempting to authenticate user:', credentials);
        console.log('API_URL:', API_URL);
        console.log('Full login URL:', `${API_URL}/api/users/login`);

        try {
          const response = await axios.post(`${API_URL}/api/users/login`, {
            username: credentials.username,
            password: credentials.password,
          });

          console.log('Authentication response:', response.data);

          const user = response.data;

          if (user && user.token) {
            const userObject = {
              id: user._id,
              name: user.name,
              email: user.email,
              username: user.username,
              phone: user.phone || '',
              address: user.address || '',
              role: user.role,
              token: user.token,
            };
            console.log('Returning user object from authorize:', userObject);
            return userObject;
          }
          console.log('No valid user data, returning null');
          return null;
        } catch (error: any) {
          console.error('Authentication error:', error);
          console.error('Error response:', error.response?.data);
          console.error('Error status:', error.response?.status);
          console.error('API_URL:', API_URL);

          // Throw specific error messages
          if (error.response?.status === 401) {
            const errorMessage =
              error.response?.data?.message || 'Invalid username or password';
            console.error('401 Error message:', errorMessage);
            throw new Error(errorMessage);
          }
          if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
          }
          if (error.code === 'ECONNREFUSED') {
            throw new Error(
              'Cannot connect to authentication server. Please try again later.'
            );
          }
          throw new Error('Authentication failed. Please try again.');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      console.log('JWT Callback - trigger:', trigger);
      if (user) {
        console.log('JWT Callback - Setting user data in token:', {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role,
        });
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.username = user.username;
        token.phone = user.phone;
        token.address = user.address;
        token.role = user.role;
        token.accessToken = user.token;
      }
      
      // Handle session updates (e.g. Profile updates)
      if (trigger === 'update' && session?.user) {
        console.log('JWT Callback - Updating token from session:', session.user);
        token.name = session.user.name || token.name;
        token.email = session.user.email || token.email;
        token.phone = session.user.phone || token.phone;
        token.address = session.user.address || token.address;
      }
      
      console.log('JWT Callback - Returning token with id:', token.id);
      return token;
    },
    async session({ session, token }) {
      console.log('Session Callback - token:', {
        id: token.id,
        username: token.username,
        role: token.role,
      });
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.username = token.username as string;
        session.user.phone = token.phone as string;
        session.user.address = token.address as string;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
      }
      console.log(
        'Session Callback - Returning session with user id:',
        session.user?.id
      );
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login', // Redirect errors to login page
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug in all environments for now
};
