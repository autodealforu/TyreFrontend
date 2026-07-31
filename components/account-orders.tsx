'use client';

import { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Eye,
  Download,
  RotateCcw,
  X,
  Calendar,
  Truck,
  CheckCircle,
  Wrench,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api';
import { Separator } from '@/components/ui/separator';
import AccountLayout from './account-layout';

export default function AccountOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get user from auth context
  const { user, isAuthenticated } = useAuth();
  const customerId = user?.id || null;

  useEffect(() => {
    if (!isAuthenticated || !customerId) return;
    setLoading(true);
    apiClient
      .get(`/api/orders/customer/${customerId}`)
      .then((res) => {
        setOrders(res.data.orders || []);
        setError('');
      })
      .catch((err) => {
        setError(
          err?.response?.data?.message || err.message || 'Error fetching orders'
        );
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, customerId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-50 text-green-700 hover:bg-green-50';
      case 'Confirmed':
        return 'bg-blue-50 text-blue-700 hover:bg-blue-50';
      case 'Shipped':
        return 'bg-purple-50 text-purple-700 hover:bg-purple-50';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 hover:bg-red-50';
      default:
        return 'bg-gray-50 text-gray-700 hover:bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className='h-4 w-4' />;
      case 'Confirmed':
        return <Package className='h-4 w-4' />;
      case 'Shipped':
        return <Truck className='h-4 w-4' />;
      case 'Cancelled':
        return <X className='h-4 w-4' />;
      default:
        return <Package className='h-4 w-4' />;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesStatus =
      statusFilter === 'all' ||
      order.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <AccountLayout title='My Orders' description='Track and manage your orders'>
      <div className='space-y-6'>
        {/* Filters */}
        <Card>
          <CardContent className='p-6'>
            <div className='flex flex-col md:flex-row gap-4'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Search orders by order ID or product name...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-10'
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className='w-full md:w-[180px]'>
                  <SelectValue placeholder='Filter by status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Orders</SelectItem>
                  <SelectItem value='confirmed'>Confirmed</SelectItem>
                  <SelectItem value='shipped'>Shipped</SelectItem>
                  <SelectItem value='delivered'>Delivered</SelectItem>
                  <SelectItem value='cancelled'>Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className='w-full md:w-[180px]'>
                  <SelectValue placeholder='Filter by date' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Time</SelectItem>
                  <SelectItem value='last30'>Last 30 Days</SelectItem>
                  <SelectItem value='last90'>Last 3 Months</SelectItem>
                  <SelectItem value='last365'>Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Loading/Error State */}
        {loading && <div className='text-center py-8'>Loading orders...</div>}
        {error && !loading && (
          <div className='text-center py-8 text-red-600'>{error}</div>
        )}

        {/* Orders List */}
        {!loading && !error && (
          <div className='space-y-4'>
            {filteredOrders.map((order) => (
              <Card key={order._id || order.id}>
                <CardContent className='p-6'>
                  {/* ...existing code for order card... */}
                  <div className='flex flex-col lg:flex-row lg:items-center justify-between mb-4'>
                    <div className='flex items-center gap-4 mb-4 lg:mb-0'>
                      <div>
                        <h3 className='font-semibold'>
                          Order #{order.order_id || order._id || order.id}
                        </h3>
                        <p className='text-sm text-muted-foreground'>
                          Placed on{' '}
                          {order.order_date
                            ? new Date(order.order_date).toLocaleString()
                            : order.createdAt
                            ? new Date(order.createdAt).toLocaleString()
                            : '-'}
                        </p>
                      </div>
                      <Badge
                        variant='outline'
                        className={getStatusColor(order.status)}
                      >
                        <div className='flex items-center gap-1'>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </div>
                      </Badge>
                    </div>
                    <div className='text-right'>
                      <div className='text-lg font-semibold'>
                        ₹
                        {order.total_amount?.toLocaleString('en-IN') ||
                          order.order_summary?.total?.toLocaleString('en-IN')}
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        {order.products?.reduce(
                          (sum, item) => sum + item.quantity,
                          0
                        ) || 0}{' '}
                        item(s)
                      </div>
                    </div>
                  </div>

                  <Separator className='my-4' />

                  {/* Products */}
                  <div className='space-y-3 mb-4'>
                    {order.products?.map((item, index) => {
                      const rawImg =
                        item.image ||
                        item.images?.[0] ||
                        (item.product as any)?.image ||
                        (item.product as any)?.images?.[0] ||
                        (item.product as any)?.product_images?.[0] ||
                        (item.product as any)?.tyre?.productImages?.[0] ||
                        (item.product as any)?.alloy_wheel?.productImages?.[0] ||
                        (item.product as any)?.service?.serviceImages?.[0];

                      const fullImgUrl = rawImg
                        ? rawImg.startsWith('http')
                          ? rawImg
                          : `${(process.env.NEXT_PUBLIC_API_URL || 'https://api.autodeal4u.in').replace(/\/$/, '')}/${rawImg.replace(/^\//, '')}`
                        : null;

                      return (
                        <div
                          key={item._id || index}
                          className='flex items-center gap-4'
                        >
                          {fullImgUrl ? (
                            <img
                              src={fullImgUrl}
                              alt={item.name}
                              className='w-14 h-14 object-cover rounded-lg border border-gray-200 bg-white'
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                                const fallback = (e.target as HTMLElement).nextElementSibling;
                                if (fallback) fallback.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-14 h-14 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 ${
                              fullImgUrl ? 'hidden' : ''
                            }`}
                          >
                            <Wrench className='w-6 h-6' />
                          </div>
                          <div className='flex-1'>
                            <div className='font-medium'>{item.name}</div>
                            <div className='text-sm text-muted-foreground'>
                              {item.brand ? `${item.brand} • ` : ''}
                              {item.size ? `Size: ${item.size} • ` : ''}
                              Qty: {item.quantity}
                            </div>
                            <div className='text-xs text-muted-foreground'>
                              Vendor: {item.vendor_details?.name || 'Vendor Unavailable'}
                            </div>
                          </div>
                          <div className='text-right'>
                            <div className='font-medium'>
                              ₹{item.sale_price?.toLocaleString('en-IN')}
                            </div>
                            <div className='text-sm text-muted-foreground'>
                              per item
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Addresses */}
                  <div className='grid md:grid-cols-2 gap-4 mb-4'>
                    <div className='bg-gray-50 p-4 rounded-lg'>
                      <div className='font-medium mb-2'>Shipping Address</div>
                      <div className='text-sm text-muted-foreground'>
                        <div>{order.shipping_address?.address_1}</div>
                        {order.shipping_address?.address_2 && (
                          <div>{order.shipping_address.address_2}</div>
                        )}
                        <div>
                          {order.shipping_address?.city},{' '}
                          {order.shipping_address?.state}{' '}
                          {order.shipping_address?.pin}
                        </div>
                        {order.shipping_address?.landmark && (
                          <div>Landmark: {order.shipping_address.landmark}</div>
                        )}
                      </div>
                    </div>
                    <div className='bg-gray-50 p-4 rounded-lg'>
                      <div className='font-medium mb-2'>Billing Address</div>
                      <div className='text-sm text-muted-foreground'>
                        <div>{order.billing_address?.address_1}</div>
                        {order.billing_address?.address_2 && (
                          <div>{order.billing_address.address_2}</div>
                        )}
                        <div>
                          {order.billing_address?.city},{' '}
                          {order.billing_address?.state}{' '}
                          {order.billing_address?.pin}
                        </div>
                        {order.billing_address?.landmark && (
                          <div>Landmark: {order.billing_address.landmark}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className='bg-gray-50 p-4 rounded-lg mb-4'>
                    <div className='font-medium mb-2'>Order Summary</div>
                    <div className='grid grid-cols-2 gap-2 text-sm text-muted-foreground'>
                      <div>Subtotal:</div>
                      <div>
                        ₹
                        {order.sub_total?.toLocaleString('en-IN') ||
                          order.order_summary?.subtotal?.toLocaleString(
                            'en-IN'
                          )}
                      </div>
                      <div>Delivery Fee:</div>
                      <div>
                        ₹
                        {order.delivery_charges?.toLocaleString('en-IN') ||
                          order.order_summary?.delivery_charges?.toLocaleString(
                            'en-IN'
                          )}
                      </div>
                      <div>Discount:</div>
                      <div>
                        -₹
                        {order.discount?.toLocaleString('en-IN') ||
                          order.order_summary?.discount?.toLocaleString(
                            'en-IN'
                          )}
                      </div>
                      <div>Tax:</div>
                      <div>
                        ₹
                        {order.tax?.toLocaleString('en-IN') ||
                          order.order_summary?.tax?.toLocaleString('en-IN')}
                      </div>
                      <div>Total:</div>
                      <div className='font-semibold'>
                        ₹
                        {order.total_amount?.toLocaleString('en-IN') ||
                          order.order_summary?.total?.toLocaleString('en-IN')}
                      </div>
                      <div>Savings:</div>
                      <div className='text-green-600'>
                        ₹
                        {order.total_savings?.toLocaleString('en-IN') ||
                          order.order_summary?.savings?.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className='flex flex-wrap gap-2'>
                    <Button variant='outline' size='sm' asChild>
                      <Link href={`/account/orders/${order._id || order.id}`}>
                        <Eye className='h-4 w-4 mr-1' />
                        View Details
                      </Link>
                    </Button>
                    {/* Add more actions as needed */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredOrders.length === 0 && (
          <div className='text-center py-12'>
            <div className='h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6'>
              <Package className='h-12 w-12 text-gray-400' />
            </div>
            <h3 className='text-xl font-semibold mb-2'>No orders found</h3>
            <p className='text-muted-foreground mb-6'>
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : "You haven't placed any orders yet"}
            </p>
            <Button asChild>
              <Link href='/'>Start Shopping</Link>
            </Button>
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
