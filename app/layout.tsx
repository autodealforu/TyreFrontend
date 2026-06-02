import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';
import { Toaster } from 'sonner';

import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import NextAuthProvider from '@/components/providers/auth-provider';
import { CartProvider } from '@/hooks/useCart';
import IntroAnimation from '@/components/intro-animation';
import { ESLINT_DEFAULT_DIRS } from 'next/dist/lib/constants';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Premium Tyres & Alloy Wheels | Multi-Vendor Marketplace',
  description:
    'Shop from multiple vendors for premium tyres, alloy wheels, and automotive parts. Compare prices, read reviews, and get professional installation services. Find the perfect fit for your vehicle with expert guidance from trusted vendors.',
  keywords:
    'tyres, alloy wheels, car tyres, bike tyres, tyre shop, multi-vendor, automotive parts, vehicle accessories, professional installation',
  generator: 'v0.app',
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <NextAuthProvider>
          <CartProvider>
            <div className='flex flex-col min-h-screen'>
              <IntroAnimation />
              <SiteHeader />
              <main className='flex-1'>{children}</main>
              <SiteFooter />
            
            </div>
            <Toaster position='bottom-right' />
          </CartProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
