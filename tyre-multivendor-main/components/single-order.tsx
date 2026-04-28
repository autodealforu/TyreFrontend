'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import {
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  Download,
  Share2,
  RotateCcw,
  CheckCircle,
  X,
  Phone,
  Mail,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import AccountLayout from './account-layout';

export default function SingleOrder() {
  // API data fetching and UI rendering
  const params = useParams();
  const orderId = params?.id;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    apiClient
      .get(`/api/orders/${orderId}`)
      .then((res) => {
        setOrder(res.data.order);
        setError('');
      })
      .catch((err) => {
        setError(
          err?.response?.data?.message || err.message || 'Error fetching order'
        );
        setOrder(null);
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  // Helper for address rendering
  const renderAddress = (address) => {
    return (
      <div className='text-sm text-muted-foreground'>
        <div>{address?.address_1}</div>
        {address?.address_2 && <div>{address.address_2}</div>}
        <div>
          {address?.city}, {address?.state} {address?.pin}
        </div>
        {address?.landmark && <div>Landmark: {address.landmark}</div>}
      </div>
    );
  };

  if (loading) {
    return (
      <AccountLayout
        title='Order Details'
        description='Order details and tracking'
      >
        <div className='py-12 text-center'>Loading order...</div>
      </AccountLayout>
    );
  }

  if (error || !order) {
    return (
      <AccountLayout
        title='Order Details'
        description='Order details and tracking'
      >
        <div className='py-12 text-center text-red-600'>
          {error || 'Order not found'}
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout
      title={`Order #${order?.order_id || order?._id || order?.id}`}
      description='Order details and tracking'
    >
      <div className='space-y-6'>
        {/* Back Button */}
        <Button variant='outline' asChild>
          <Link href='/account/orders' className='flex items-center gap-2'>
            <ArrowLeft className='h-4 w-4' />
            Back to Orders
          </Link>
        </Button>

        <div className='grid lg:grid-cols-3 gap-6'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Truck className='h-5 w-5' />
                  Status: {order?.status}
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-2'>
                <div>
                  <strong>Order Date:</strong>{' '}
                  {order?.order_date
                    ? new Date(order.order_date).toLocaleString()
                    : '-'}
                </div>
                <div>
                  <strong>Payment Method:</strong> {order?.payment_method}
                </div>
                <div>
                  <strong>Payment Status:</strong>{' '}
                  {order?.payment_details?.payment_status}
                </div>
                <div>
                  <strong>Delivery Option:</strong>{' '}
                  {order?.delivery_details?.option}
                </div>
              </CardContent>
            </Card>

            {/* Products */}
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {order?.products?.map((item, idx) => (
                  <div
                    key={item._id || idx}
                    className='flex items-center gap-4'
                  >
                    {/* No image in API, so use placeholder */}
                    <img
                      src='/placeholder.svg'
                      alt={item.name}
                      width={60}
                      height={60}
                      className='rounded-lg'
                    />
                    <div className='flex-1'>
                      <div className='font-medium'>{item.name}</div>
                      <div className='text-sm text-muted-foreground'>
                        {item.brand} • Size: {item.size} • Qty: {item.quantity}
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        Vendor: {item.vendor_details?.name}
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
                ))}
              </CardContent>
            </Card>

            {/* Addresses */}
            <div className='grid md:grid-cols-2 gap-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderAddress(order?.shipping_address)}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Billing Address</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderAddress(order?.billing_address)}
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-wrap gap-4'>
              <Button>
                <Download className='h-4 w-4 mr-2' />
                Download Invoice
              </Button>
              <Button variant='outline'>
                <Share2 className='h-4 w-4 mr-2' />
                Share Order
              </Button>
              <Button variant='outline'>
                <RotateCcw className='h-4 w-4 mr-2' />
                Reorder Items
              </Button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className='space-y-2'>
                <div>
                  <strong>Subtotal:</strong> ₹
                  {order?.order_summary?.subtotal?.toLocaleString('en-IN')}
                </div>
                <div>
                  <strong>Delivery Fee:</strong> ₹
                  {order?.order_summary?.delivery_charges?.toLocaleString(
                    'en-IN'
                  )}
                </div>
                <div>
                  <strong>Discount:</strong> -₹
                  {order?.order_summary?.discount?.toLocaleString('en-IN')}
                </div>
                <div>
                  <strong>Tax:</strong> ₹
                  {order?.order_summary?.tax?.toLocaleString('en-IN')}
                </div>
                <div className='font-semibold'>
                  <strong>Total:</strong> ₹
                  {order?.order_summary?.total?.toLocaleString('en-IN')}
                </div>
                <div className='text-green-600'>
                  <strong>Savings:</strong> ₹
                  {order?.order_summary?.savings?.toLocaleString('en-IN')}
                </div>
              </CardContent>
            </Card>

            {/* Need Help */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className='space-y-2'>
                <div>
                  Contact support at{' '}
                  <a href='mailto:support@test.com' className='underline'>
                    support@test.com
                  </a>
                </div>
                <div>
                  Call us: <span className='font-semibold'>1800-000-0000</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}
