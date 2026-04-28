'use client';

import type React from 'react';

import { useState } from 'react';
import {
  Search,
  ShoppingCart,
  User,
  Phone,
  Mail,
  Menu,
  LogOut,
  Package,
  MapPin,
  FileText,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function SiteHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const { cart } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(
        searchQuery.trim()
      )}`;
    }
  };

  // Removed vehicle types and brands; we now show direct category links

  return (
    <header className='bg-white sticky top-0 z-50 shadow-modern border-b border-brand-light-gray'>
      {/* Top Bar */}
      <div className='hidden md:block' style={{ backgroundColor: '#14213d' }}>
        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-between py-3 text-sm text-white'>
            <div className='flex items-center gap-6'>
              <div className='flex items-center gap-2'>
                <Phone className='h-4 w-4' style={{ color: '#fca311' }} />
                <span className='font-medium'>+91 98765 43210</span>
              </div>
              <div className='hidden lg:flex items-center gap-2'>
                <Mail className='h-4 w-4' style={{ color: '#fca311' }} />
                <span className='font-medium'>info@autodeal4u.com</span>
              </div>
            </div>
            <div className='flex items-center gap-6'>
              <span className='hidden lg:block font-medium'>
                🚚 Free shipping on orders over ₹15,000
              </span>
              <span className='lg:hidden font-medium'>
                🚚 Free shipping over ₹15K
              </span>
              <Link
                href='/account/orders'
                className='font-medium transition-colors duration-200'
                style={{ color: 'white' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fca311')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'white')}
              >
                My Orders
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between py-6'>
          {/* Logo */}
          <Link href='/' className='flex items-center gap-3 group'>
            <div
              className='h-12 w-12 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300'
              style={{
                background: 'linear-gradient(135deg, #14213d 0%, #fca311 100%)',
              }}
            >
              <span className='text-white font-bold text-xl'>A</span>
            </div>
            <div className='flex flex-col'>
              <span
                className='text-2xl font-bold transition-colors duration-200'
                style={{ color: '#000000' }}
              >
                Autodeal4U
              </span>
              <span
                className='text-xs font-medium'
                style={{ color: '#666666' }}
              >
                Premium Tyre Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden lg:flex items-center gap-8'>
            <Link
              href='/tyres'
              className='font-medium transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-gray-50'
              style={{ color: '#000000' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fca311')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#000000')}
            >
              Tyres
            </Link>
            <Link
              href='/alloy-wheels'
              className='font-medium transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-gray-50'
              style={{ color: '#000000' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fca311')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#000000')}
            >
              Alloy Wheels
            </Link>
            <Link
              href='/services'
              className='font-medium transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-gray-50'
              style={{ color: '#000000' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fca311')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#000000')}
            >
              Services
            </Link>
            <Link
              href='/about-us'
              className='font-medium transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-gray-50'
              style={{ color: '#000000' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fca311')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#000000')}
            >
              About
            </Link>
            <Link
              href='/contact-us'
              className='font-medium transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-gray-50'
              style={{ color: '#000000' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fca311')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#000000')}
            >
              Contact
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className='flex items-center gap-2 lg:gap-4'>
            {/* Mobile Search */}
            <Button
              variant='ghost'
              size='icon'
              className='md:hidden'
              style={{ backgroundColor: 'transparent' }}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className='h-5 w-5' style={{ color: '#000000' }} />
            </Button>

            {/* Authentication Section */}
            {isLoading ? (
              <div className='flex items-center gap-2'>
                <div className='h-8 w-8 bg-gray-200 rounded-full animate-pulse'></div>
                <div className='hidden md:block h-4 w-20 bg-gray-200 rounded animate-pulse'></div>
              </div>
            ) : isAuthenticated ? (
              <>
                {/* Logged in User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      className='flex items-center gap-3 px-3 hover:bg-brand-light-gray'
                    >
                      <div className='h-10 w-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg'>
                        <span className='text-white font-semibold text-sm'>
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className='hidden md:flex flex-col items-start'>
                        <span className='text-sm font-semibold text-brand-black'>
                          {user?.name || 'User'}
                        </span>
                        <span className='text-xs text-brand-orange font-medium uppercase tracking-wide'>
                          {user?.role?.toLowerCase() || 'customer'}
                        </span>
                      </div>
                      <ChevronDown className='h-4 w-4 hidden md:block text-brand-black' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align='end'
                    className='w-64 shadow-modern border-brand-light-gray'
                  >
                    <div className='px-4 py-3 border-b border-brand-light-gray'>
                      <p className='text-sm font-semibold text-brand-black'>
                        {user?.name}
                      </p>
                      <p className='text-xs text-gray-500 font-medium'>
                        {user?.email}
                      </p>
                    </div>
                    <div className='py-2'>
                      <DropdownMenuItem asChild>
                        <Link
                          href='/account'
                          className='flex items-center gap-3 px-4 py-3 hover:bg-brand-orange hover:text-white transition-colors duration-200'
                        >
                          <User className='h-4 w-4' />
                          <span className='font-medium'>My Account</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href='/account/orders'
                          className='flex items-center gap-3 px-4 py-3 hover:bg-brand-orange hover:text-white transition-colors duration-200'
                        >
                          <Package className='h-4 w-4' />
                          <span className='font-medium'>My Orders</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href='/account/addresses'
                          className='flex items-center gap-3 px-4 py-3 hover:bg-brand-orange hover:text-white transition-colors duration-200'
                        >
                          <MapPin className='h-4 w-4' />
                          <span className='font-medium'>My Addresses</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href='/account/job-cards'
                          className='flex items-center gap-3 px-4 py-3 hover:bg-brand-orange hover:text-white transition-colors duration-200'
                        >
                          <FileText className='h-4 w-4' />
                          <span className='font-medium'>My Job Cards</span>
                        </Link>
                      </DropdownMenuItem>
                    </div>
                    <div className='border-t border-brand-light-gray pt-2'>
                      <DropdownMenuItem
                        onClick={logout}
                        className='flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200'
                      >
                        <LogOut className='h-4 w-4' />
                        <span className='font-medium'>Logout</span>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                {/* Not Logged In - Show Login Buttons */}
                <div className='hidden md:flex items-center gap-3'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='border-brand-dark-blue text-brand-dark-blue hover:bg-brand-dark-blue hover:text-black transition-all duration-200'
                    asChild
                  >
                    <Link href='/login'>Login</Link>
                  </Button>
                  <Button
                    size='sm'
                    className='gradient-accent hover:opacity-90 transition-opacity duration-200 text-black font-medium'
                    asChild
                  >
                    <Link href='/login'>Sign Up</Link>
                  </Button>
                </div>

                {/* Mobile - Single User Icon for Login */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon' className='md:hidden'>
                      <User className='h-5 w-5' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem asChild>
                      <Link href='/login' className='flex items-center gap-2'>
                        <User className='h-4 w-4' />
                        Login
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href='/register-as-vendor'
                        className='flex items-center gap-2'
                      >
                        <User className='h-4 w-4' />
                        Register as Vendor
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {/* Shopping Cart */}
            <Button
              variant='ghost'
              size='icon'
              className='relative'
              style={{ backgroundColor: 'transparent' }}
              asChild
            >
              <Link href='/cart'>
                <ShoppingCart
                  className='h-5 w-5'
                  style={{ color: '#000000' }}
                />
                {cart.totalItems > 0 && (
                  <Badge
                    className='absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs font-semibold border-2 border-white shadow-lg'
                    style={{ backgroundColor: '#fca311', color: '#000000' }}
                  >
                    {cart.totalItems}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='lg:hidden'
                  style={{ backgroundColor: 'transparent' }}
                >
                  <Menu className='h-5 w-5' style={{ color: '#000000' }} />
                </Button>
              </SheetTrigger>
              <SheetContent
                side='right'
                className='w-80 bg-white border-l-brand-light-gray'
              >
                <SheetHeader className='border-b border-brand-light-gray pb-4'>
                  <SheetTitle className='text-brand-black font-bold text-lg'>
                    Menu
                  </SheetTitle>
                </SheetHeader>
                <nav className='flex flex-col gap-4 mt-6'>
                  <Link href='/tyres' className='hover:text-primary'>
                    Tyres
                  </Link>
                  <Link href='/alloy-wheels' className='hover:text-primary'>
                    Alloy Wheels
                  </Link>
                  <Link href='/services' className='hover:text-primary'>
                    Services
                  </Link>
                  <Link href='/about-us' className='hover:text-primary'>
                    About
                  </Link>
                  <Link href='/contact-us' className='hover:text-primary'>
                    Contact
                  </Link>

                  {/* Authentication Section in Mobile Menu */}
                  <div className='pt-4 border-t'>
                    {isAuthenticated ? (
                      <>
                        <div className='mb-4'>
                          <div className='flex items-center gap-3 mb-2'>
                            <div className='h-10 w-10 bg-primary rounded-full flex items-center justify-center'>
                              <span className='text-primary-foreground font-semibold'>
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className='font-medium text-sm'>
                                {user?.name}
                              </p>
                              <p className='text-xs text-muted-foreground'>
                                {user?.role?.toLowerCase()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className='space-y-2'>
                          <Link
                            href='/account'
                            className='flex items-center gap-2 text-sm hover:text-primary'
                          >
                            <User className='h-4 w-4' />
                            My Account
                          </Link>
                          <Link
                            href='/account/orders'
                            className='flex items-center gap-2 text-sm hover:text-primary'
                          >
                            <Package className='h-4 w-4' />
                            My Orders
                          </Link>
                          <Link
                            href='/account/addresses'
                            className='flex items-center gap-2 text-sm hover:text-primary'
                          >
                            <MapPin className='h-4 w-4' />
                            My Addresses
                          </Link>
                          <Link
                            href='/account/job-cards'
                            className='flex items-center gap-2 text-sm hover:text-primary'
                          >
                            <FileText className='h-4 w-4' />
                            My Job Cards
                          </Link>
                          <button
                            onClick={logout}
                            className='flex items-center gap-2 text-sm text-red-600 hover:text-red-700 w-full text-left'
                          >
                            <LogOut className='h-4 w-4' />
                            Logout
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className='space-y-2'>
                        <Link
                          href='/login'
                          className='flex items-center gap-2 text-sm hover:text-primary'
                        >
                          <User className='h-4 w-4' />
                          Login
                        </Link>
                        <Link
                          href='/register-as-vendor'
                          className='flex items-center gap-2 text-sm hover:text-primary'
                        >
                          <User className='h-4 w-4' />
                          Register as Vendor
                        </Link>
                      </div>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div
            className='md:hidden pb-6 pt-2 border-t'
            style={{ borderColor: '#e5e5e5' }}
          >
            <form onSubmit={handleSearch} className='flex shadow-lg'>
              <Input
                type='search'
                placeholder='Search premium tyres...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='rounded-r-none focus:ring-2'
                style={{ borderColor: '#e5e5e5', focusRingColor: '#fca311' }}
                autoFocus
              />
              <Button
                type='submit'
                className='rounded-l-none font-medium'
                style={{
                  background:
                    'linear-gradient(135deg, #fca311 0%, #14213d 100%)',
                  color: '#000000',
                }}
              >
                <Search className='h-4 w-4' />
              </Button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
