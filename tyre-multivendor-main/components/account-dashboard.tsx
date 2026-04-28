'use client';

import { useEffect, useState } from 'react';
import {
  Package,
  MapPin,
  FileText,
  CreditCard,
  Heart,
  Bell,
  Settings,
  ShoppingBag,
  Truck,
  Calendar,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AccountLayout from './account-layout';

export default function AccountDashboard() {
  const { user, requireAuth } = useAuth();

  // Protect this component - redirect to login if not authenticated
  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  if (!user) {
    return null; // Component will redirect to login
  }
  const recentOrders = [
    {
      id: 'HT-2024-06789',
      date: 'June 7, 2024',
      status: 'Confirmed',
      total: 83996,
      items: [
        {
          name: 'Michelin Pilot Sport 4',
          quantity: 2,
          image: '/placeholder.svg?height=60&width=60',
        },
        {
          name: 'Continental PremiumContact 6',
          quantity: 4,
          image: '/placeholder.svg?height=60&width=60',
        },
      ],
    },
    {
      id: 'HT-2024-06543',
      date: 'May 25, 2024',
      status: 'Delivered',
      total: 45998,
      items: [
        {
          name: 'Bridgestone Turanza T005',
          quantity: 4,
          image: '/placeholder.svg?height=60&width=60',
        },
      ],
    },
  ];

  const upcomingAppointments = [
    {
      id: 'JC-2024-00123',
      date: 'June 12, 2024',
      time: '10:00 AM',
      service: 'Tyre Installation & Wheel Balancing',
      location: 'Autodeal4U Main Store, Sector 18, Noida',
      status: 'Confirmed',
    },
  ];

  const quickLinks = [
    {
      title: 'My Orders',
      icon: <Package className='h-6 w-6' />,
      href: '/account/orders',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'My Addresses',
      icon: <MapPin className='h-6 w-6' />,
      href: '/account/addresses',
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'My Job Cards',
      icon: <FileText className='h-6 w-6' />,
      href: '/account/job-cards',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Payment Methods',
      icon: <CreditCard className='h-6 w-6' />,
      href: '/account/payment-methods',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      title: 'Wishlist',
      icon: <Heart className='h-6 w-6' />,
      href: '/account/wishlist',
      color: 'bg-red-100 text-red-600',
    },
    {
      title: 'Notifications',
      icon: <Bell className='h-6 w-6' />,
      href: '/account/notifications',
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      title: 'Account Settings',
      icon: <Settings className='h-6 w-6' />,
      href: '/account/settings',
      color: 'bg-gray-100 text-gray-600',
    },
  ];

  return (
    <AccountLayout title='My Account' description='Welcome back, Rahul!'>
      {/* Quick Links */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8'>
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <div className='flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow text-center'>
              <div
                className={`h-12 w-12 ${link.color} rounded-full flex items-center justify-center mb-3`}
              >
                {link.icon}
              </div>
              <span className='text-sm font-medium'>{link.title}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className='grid md:grid-cols-2 gap-6'>
        {/* Recent Orders */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <ShoppingBag className='h-5 w-5' />
                Recent Orders
              </CardTitle>
              <CardDescription>Your recent purchases</CardDescription>
            </div>
            <Button variant='ghost' size='sm' asChild>
              <Link href='/account/orders'>View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {recentOrders.map((order) => (
                <div key={order.id} className='border rounded-lg p-4'>
                  <div className='flex justify-between items-start mb-3'>
                    <div>
                      <div className='font-medium'>Order #{order.id}</div>
                      <div className='text-sm text-muted-foreground'>
                        {order.date}
                      </div>
                    </div>
                    <Badge
                      variant='outline'
                      className={
                        order.status === 'Delivered'
                          ? 'bg-green-50 text-green-700 hover:bg-green-50'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-50'
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>

                  <div className='flex items-center gap-3 mb-3'>
                    <div className='flex -space-x-2'>
                      {order.items.slice(0, 2).map((item, index) => (
                        <div
                          key={index}
                          className='h-10 w-10 rounded-full border-2 border-white overflow-hidden'
                        >
                          <Image
                            src={item.image || '/placeholder.svg'}
                            alt={item.name}
                            width={40}
                            height={40}
                          />
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className='h-10 w-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium'>
                          +{order.items.length - 2}
                        </div>
                      )}
                    </div>
                    <div className='text-sm'>
                      {order.items[0].name}
                      {order.items.length > 1 &&
                        ` and ${order.items.length - 1} more item(s)`}
                    </div>
                  </div>

                  <div className='flex justify-between items-center'>
                    <div className='font-medium'>
                      ₹{order.total.toLocaleString('en-IN')}
                    </div>
                    <Button size='sm' variant='outline' asChild>
                      <Link href={`/account/orders/${order.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}

              {recentOrders.length === 0 && (
                <div className='text-center py-6'>
                  <ShoppingBag className='h-12 w-12 text-gray-300 mx-auto mb-3' />
                  <h3 className='font-medium text-gray-600 mb-1'>
                    No orders yet
                  </h3>
                  <p className='text-sm text-muted-foreground mb-4'>
                    Your recent orders will appear here
                  </p>
                  <Button asChild>
                    <Link href='/'>Start Shopping</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <Calendar className='h-5 w-5' />
                Upcoming Appointments
              </CardTitle>
              <CardDescription>Your scheduled services</CardDescription>
            </div>
            <Button variant='ghost' size='sm' asChild>
              <Link href='/account/job-cards'>View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className='border rounded-lg p-4'>
                  <div className='flex justify-between items-start mb-3'>
                    <div>
                      <div className='font-medium'>
                        Job Card #{appointment.id}
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        {appointment.service}
                      </div>
                    </div>
                    <Badge
                      variant='outline'
                      className={
                        appointment.status === 'Confirmed'
                          ? 'bg-green-50 text-green-700 hover:bg-green-50'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-50'
                      }
                    >
                      {appointment.status}
                    </Badge>
                  </div>

                  <div className='space-y-2 mb-3'>
                    <div className='flex items-center gap-2 text-sm'>
                      <Calendar className='h-4 w-4 text-gray-500' />
                      <span>{appointment.date}</span>
                    </div>
                    <div className='flex items-center gap-2 text-sm'>
                      <Clock className='h-4 w-4 text-gray-500' />
                      <span>{appointment.time}</span>
                    </div>
                    <div className='flex items-center gap-2 text-sm'>
                      <MapPin className='h-4 w-4 text-gray-500' />
                      <span>{appointment.location}</span>
                    </div>
                  </div>

                  <div className='flex justify-end'>
                    <Button size='sm' variant='outline' asChild>
                      <Link href={`/account/job-cards/${appointment.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}

              {upcomingAppointments.length === 0 && (
                <div className='text-center py-6'>
                  <Calendar className='h-12 w-12 text-gray-300 mx-auto mb-3' />
                  <h3 className='font-medium text-gray-600 mb-1'>
                    No upcoming appointments
                  </h3>
                  <p className='text-sm text-muted-foreground mb-4'>
                    Your scheduled services will appear here
                  </p>
                  <Button asChild>
                    <Link href='/services'>Book a Service</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Delivery Updates */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <Truck className='h-5 w-5' />
                Delivery Updates
              </CardTitle>
              <CardDescription>Track your shipments</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className='border rounded-lg p-4'>
              <div className='flex justify-between items-start mb-3'>
                <div>
                  <div className='font-medium'>Order #HT-2024-06789</div>
                  <div className='text-sm text-muted-foreground'>
                    Michelin Pilot Sport 4 and 1 more item
                  </div>
                </div>
                <Badge
                  variant='outline'
                  className='bg-blue-50 text-blue-700 hover:bg-blue-50'
                >
                  In Transit
                </Badge>
              </div>

              <div className='space-y-2 mb-3'>
                <div className='flex items-center gap-2 text-sm'>
                  <Truck className='h-4 w-4 text-gray-500' />
                  <span>Expected delivery: June 10-12, 2024</span>
                </div>
                <div className='flex items-center gap-2 text-sm'>
                  <MapPin className='h-4 w-4 text-gray-500' />
                  <span>Last update: Package has left the warehouse</span>
                </div>
              </div>

              <div className='flex justify-end'>
                <Button size='sm' variant='outline' asChild>
                  <Link href='/track-order'>Track Order</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Products */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <Heart className='h-5 w-5' />
                Recommended For You
              </CardTitle>
              <CardDescription>Based on your purchases</CardDescription>
            </div>
            <Button variant='ghost' size='sm' asChild>
              <Link href='/recommendations'>View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 gap-4'>
              <div className='border rounded-lg p-3 hover:shadow-md transition-shadow'>
                <div className='mb-2'>
                  <Image
                    src='/placeholder.svg?height=100&width=100'
                    alt='Bridgestone Potenza Sport'
                    width={100}
                    height={100}
                    className='mx-auto'
                  />
                </div>
                <div className='text-center'>
                  <div className='font-medium text-sm'>
                    Bridgestone Potenza Sport
                  </div>
                  <div className='text-sm text-muted-foreground'>225/45R17</div>
                  <div className='font-medium text-sm mt-1'>₹16,999</div>
                </div>
              </div>
              <div className='border rounded-lg p-3 hover:shadow-md transition-shadow'>
                <div className='mb-2'>
                  <Image
                    src='/placeholder.svg?height=100&width=100'
                    alt='Pirelli P Zero'
                    width={100}
                    height={100}
                    className='mx-auto'
                  />
                </div>
                <div className='text-center'>
                  <div className='font-medium text-sm'>Pirelli P Zero</div>
                  <div className='text-sm text-muted-foreground'>225/45R17</div>
                  <div className='font-medium text-sm mt-1'>₹17,499</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AccountLayout>
  );
}
