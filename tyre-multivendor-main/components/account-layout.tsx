'use client';

import type { ReactNode } from 'react';
import {
  Package,
  Home,
  LogOut,
  FileText,
  UserCircle,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface AccountLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export default function AccountLayout({
  children,
  title,
  description,
}: AccountLayoutProps) {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();

  // Get user's name and email from auth
  const userName = user?.name || user?.username || 'User';
  const userEmail = user?.email || 'user@example.com';
  const userInitial = userName.charAt(0).toUpperCase();

  // Show loading state if auth is still loading
  if (isLoading) {
    return (
      <div className='container mx-auto px-4 pb-12'>
        <div className='py-4'>
          <div className='h-6 bg-gray-200 rounded animate-pulse w-64'></div>
        </div>
        <div className='mb-8'>
          <div className='h-8 bg-gray-200 rounded animate-pulse w-48 mb-2'></div>
          {description && (
            <div className='h-4 bg-gray-200 rounded animate-pulse w-96'></div>
          )}
        </div>
        <div className='grid lg:grid-cols-4 gap-8'>
          <div className='lg:col-span-1'>
            <div className='bg-gray-200 rounded-lg h-32 animate-pulse'></div>
          </div>
          <div className='lg:col-span-3'>
            <div className='bg-gray-200 rounded-lg h-64 animate-pulse'></div>
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <Home className='h-5 w-5' />,
      href: '/account',
      active: pathname === '/account',
    },
    {
      title: 'My Profile',
      icon: <UserCircle className='h-5 w-5' />,
      href: '/account/profile',
      active: pathname === '/account/profile',
    },
    {
      title: 'My Orders',
      icon: <Package className='h-5 w-5' />,
      href: '/account/orders',
      active: pathname.startsWith('/account/orders'),
    },
    {
      title: 'My Addresses',
      icon: <MapPin className='h-5 w-5' />,
      href: '/account/addresses',
      active: pathname === '/account/addresses',
    },
    {
      title: 'My Job Cards',
      icon: <FileText className='h-5 w-5' />,
      href: '/account/job-cards',
      active: pathname.startsWith('/account/job-cards'),
    },
  ];

  return (
    <div className='container mx-auto px-4 pb-12'>
      {/* Breadcrumb */}
      <div className='py-4'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href='/account'>My Account</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Page Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold'>{title}</h1>
        {description && (
          <p className='text-muted-foreground mt-1'>{description}</p>
        )}
      </div>

      <div className='grid lg:grid-cols-4 gap-8'>
        {/* Sidebar */}
        <div className='lg:col-span-1'>
          <div className='space-y-1 sticky top-24'>
            <div className='bg-gray-50 p-4 rounded-lg mb-4'>
              <div className='flex items-center gap-3 mb-3'>
                <div className='h-12 w-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl'>
                  {userInitial}
                </div>
                <div>
                  <div className='font-medium'>{userName}</div>
                  <div className='text-sm text-muted-foreground'>
                    {userEmail}
                  </div>
                </div>
              </div>
            </div>

            <nav className='space-y-1'>
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    item.active
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              ))}

              <Button
                variant='ghost'
                className='w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50'
                onClick={logout}
              >
                <LogOut className='h-5 w-5 mr-3' />
                Logout
              </Button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className='lg:col-span-3'>{children}</div>
      </div>
    </div>
  );
}
