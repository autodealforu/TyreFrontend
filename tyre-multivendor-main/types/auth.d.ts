import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username: string;
      phone: string;
      address: string;
      role: string;
    } & DefaultSession['user'];
    accessToken: string;
  }

  interface User extends DefaultUser {
    username: string;
    phone: string;
    address: string;
    role: string;
    token: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    username: string;
    phone: string;
    address: string;
    role: string;
    accessToken: string;
  }
}
