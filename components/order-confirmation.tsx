'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle,
  Truck,
  Calendar,
  Clock,
  FileText,
  Share2,
  Download,
  ChevronRight,
  Loader2,
  Home,
  Phone,
  Mail,
  MapPin,
  Package,
  CreditCard,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Progress } from '@/components/ui/progress';

import { Order } from '@/types/checkout';
import { getOrderById } from '@/actions/order.action';
import { API_URL } from '@/constants';

// Helper function to construct proper image URLs
const getImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) {
    return '/default-image.png';
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  const baseUrl = API_URL || 'http://localhost:9042';
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${baseUrl}/${cleanPath}`;
};

export default function OrderConfirmation() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orderProgress, setOrderProgress] = useState(25);

  // Load order data when component mounts
  useEffect(() => {
    const loadOrderData = async () => {
      if (!orderId) {
        setIsLoading(false);
        return;
      }

      try {
        const result = await getOrderById(orderId);
        console.log('Order fetch result:', result);
        if (result.success && result.order) {
          console.log('Order data:', result.order);
          console.log('Order products:', result.order.products);
          setOrder(result.order);
        } else {
          // Mock order data for development
          const mockOrder: Order = {
            _id: 'mock_order_123',
            order_id: parseInt(orderId),
            order_date: new Date(),
            status: 'PENDING',
            is_paid: false,
            payment_method: 'COD',
            total_amount: 83996,
            sub_total: 69996,
            tax: 12599,
            delivery_charges: 0,
            discount: 0,
            shipping_address: {
              address_1: '123 Main Street',
              address_2: 'Apartment 4B',
              city: 'Noida',
              state: 'Uttar Pradesh',
              pin: 201301,
              landmark: 'Near Metro Station',
            },
            billing_address: {
              address_1: '123 Main Street',
              address_2: 'Apartment 4B',
              city: 'Noida',
              state: 'Uttar Pradesh',
              pin: 201301,
              landmark: 'Near Metro Station',
            },
            customer: {
              name: 'John Doe',
              phone: '+91 98765 43210',
              email: 'john.doe@example.com',
            },
            products: [
              {
                product: 'product_1',
                vendor: 'vendor_1',
                name: 'Michelin Pilot Sport 4',
                slug: 'michelin-pilot-sport-4',
                brand: 'Michelin',
                size: '225/45R17',
                regular_price: 18999,
                sale_price: 15999,
                image: '/placeholder.svg?height=100&width=100',
                quantity: 2,
                installation_fee: 0,
                vendor_details: {
                  name: 'Autodeal4U Main Store',
                  store_name: 'Autodeal4U Main Store',
                  location: 'Sector 18, Noida',
                  phone: '+91 98765 43210',
                },
              },
              {
                product: 'product_2',
                vendor: 'vendor_2',
                name: 'Continental PremiumContact 6',
                slug: 'continental-premiumcontact-6',
                brand: 'Continental',
                size: '205/55R16',
                regular_price: 14999,
                sale_price: 12999,
                image: '/placeholder.svg?height=100&width=100',
                quantity: 2,
                installation_fee: 500,
                vendor_details: {
                  name: 'TyreMart Express',
                  store_name: 'TyreMart Express',
                  location: 'Sector 62, Noida',
                  phone: '+91 98765 43211',
                },
              },
            ],
            delivery_details: {
              option: 'STANDARD',
              delivery_charges: 0,
            },
            installation_details: {
              option: 'HOME',
              total_installation_fee: 1000,
            },
            published_status: 'PUBLISHED',
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setOrder(mockOrder);
        }
      } catch (error) {
        console.error('Error loading order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrderData();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='h-8 w-8 animate-spin mx-auto mb-4' />
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-semibold mb-2'>Order not found</h2>
          <p className='text-muted-foreground mb-6'>
            The order you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href='/'>Go to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const orderSteps = [
    {
      id: 1,
      title: 'Order Placed',
      date: order.order_date.toLocaleDateString(),
      completed: true,
    },
    {
      id: 2,
      title: 'Processing',
      date: 'Expected within 24 hours',
      completed: [
        'PROCESSING',
        'ACCEPTED',
        'READY_TO_DISPATCH',
        'PICKED_UP',
        'IN_TRANSIT',
        'OUT_FOR_DELIVERY',
        'DELIVERED',
      ].includes(order.status),
    },
    {
      id: 3,
      title: 'Shipped',
      date: 'Expected within 2-3 days',
      completed: [
        'PICKED_UP',
        'IN_TRANSIT',
        'OUT_FOR_DELIVERY',
        'DELIVERED',
      ].includes(order.status),
    },
    {
      id: 4,
      title: 'Delivered',
      date:
        order.delivery_details?.estimated_delivery?.toLocaleDateString() ||
        'Expected within 3-5 days',
      completed: order.status === 'DELIVERED',
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Breadcrumb */}
      <div className='container mx-auto px-4 py-4'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href='/account/orders'>Orders</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Order #{order.order_id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className='container mx-auto px-4 pb-12'>
        {/* Success Header */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4'>
            <CheckCircle className='h-8 w-8 text-green-600' />
          </div>
          <h1 className='text-3xl font-bold mb-2'>Thank You for Shopping, Drive Safely</h1>
          <p className='text-muted-foreground'>
            Your order has been placed successfully. We'll send you a confirmation email
            shortly.
          </p>
        </div>

        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Order Details */}
            <Card>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='flex items-center gap-2'>
                      <Package className='h-5 w-5' />
                      Order #{order.order_id}
                    </CardTitle>
                    <p className='text-sm text-muted-foreground mt-1'>
                      Placed on {order.order_date.toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={getStatusBadgeColor(order.status)}>
                    {order.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {/* Order Progress */}
                  <div>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-sm font-medium'>
                        Order Progress
                      </span>
                      <span className='text-sm text-muted-foreground'>
                        {orderProgress}% Complete
                      </span>
                    </div>
                    <Progress value={orderProgress} className='h-2' />
                  </div>

                  {/* Order Steps */}
                  <div className='space-y-4'>
                    {orderSteps.map((step, index) => (
                      <div key={step.id} className='flex items-center gap-4'>
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full ${
                            step.completed
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {step.completed ? (
                            <CheckCircle className='h-4 w-4' />
                          ) : (
                            <span className='text-sm font-medium'>
                              {step.id}
                            </span>
                          )}
                        </div>
                        <div className='flex-1'>
                          <div className='flex items-center justify-between'>
                            <div>
                              <h4 className='font-medium'>{step.title}</h4>
                              <p className='text-sm text-muted-foreground'>
                                {step.date}
                              </p>
                            </div>
                            {step.completed && (
                              <Clock className='h-4 w-4 text-green-600' />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {order.products.map((item, index) => (
                    <div
                      key={index}
                      className='flex items-center gap-4 p-4 border rounded-lg'
                    >
                      <div className='relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden'>
                        <Image
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          fill
                          className='object-cover'
                          sizes='64px'
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                      <div className='flex-1'>
                        <h3 className='font-medium'>{item.name}</h3>
                        <p className='text-sm text-muted-foreground'>
                          {item.brand} • Size: {item.size}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          Vendor: {item.vendor_details.name || 'Vendor Unavailable'}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className='text-right'>
                        <div className='font-medium'>
                          ₹
                          {(
                            (item.sale_price || item.regular_price || 0) *
                            item.quantity
                          ).toLocaleString('en-IN')}
                        </div>
                        {item.regular_price &&
                          item.sale_price &&
                          item.regular_price > item.sale_price && (
                            <div className='text-sm text-muted-foreground line-through'>
                              ₹
                              {(
                                item.regular_price * item.quantity
                              ).toLocaleString('en-IN')}
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Truck className='h-5 w-5' />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div>
                    <h4 className='font-medium mb-2'>Shipping Address</h4>
                    <div className='text-sm text-muted-foreground space-y-1'>
                      <p className='font-medium text-foreground'>
                        {order.customer.name}
                      </p>
                      <p>{order.shipping_address.address_1}</p>
                      {order.shipping_address.address_2 && (
                        <p>{order.shipping_address.address_2}</p>
                      )}
                      <p>
                        {order.shipping_address.city},{' '}
                        {order.shipping_address.state}{' '}
                        {order.shipping_address.pin}
                      </p>
                      {order.shipping_address.landmark && (
                        <p>Landmark: {order.shipping_address.landmark}</p>
                      )}
                      <p className='flex items-center gap-1'>
                        <Phone className='h-3 w-3' />
                        {order.customer.phone}
                      </p>
                      {order.customer.email && (
                        <p className='flex items-center gap-1'>
                          <Mail className='h-3 w-3' />
                          {order.customer.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className='grid md:grid-cols-2 gap-4'>
                    <div>
                      <h4 className='font-medium mb-2'>Delivery Option</h4>
                      <p className='text-sm text-muted-foreground'>
                        {order.delivery_details?.option === 'STANDARD' &&
                          'Standard Delivery (3-5 days)'}
                        {order.delivery_details?.option === 'EXPRESS' &&
                          'Express Delivery (1-2 days)'}
                        {order.delivery_details?.option === 'SAME_DAY' &&
                          'Same Day Delivery'}
                      </p>
                    </div>
                    <div>
                      <h4 className='font-medium mb-2'>Installation</h4>
                      <p className='text-sm text-muted-foreground'>
                        {order.installation_details?.option === 'STORE' &&
                          'At Store (FREE)'}
                        {order.installation_details?.option === 'HOME' &&
                          'At Your Location'}
                        {order.installation_details?.option === 'NONE' &&
                          'No Installation'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className='lg:col-span-1'>
            <div className='space-y-6'>
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span>Subtotal</span>
                      <span>₹{order.sub_total.toLocaleString('en-IN')}</span>
                    </div>
                    {order.installation_details &&
                      order.installation_details.total_installation_fee > 0 && (
                        <div className='flex justify-between'>
                          <span>Installation Fee</span>
                          <span>
                            ₹
                            {order.installation_details.total_installation_fee.toLocaleString(
                              'en-IN'
                            )}
                          </span>
                        </div>
                      )}
                    <div className='flex justify-between'>
                      <span>Delivery</span>
                      <span>
                        {(order.delivery_charges || 0) === 0
                          ? 'FREE'
                          : `₹${order.delivery_charges?.toLocaleString(
                              'en-IN'
                            )}`}
                      </span>
                    </div>
                    {order.discount && order.discount > 0 && (
                      <div className='flex justify-between text-green-600'>
                        <span>Discount</span>
                        <span>-₹{order.discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className='flex justify-between'>
                      <span>Tax (GST)</span>
                      <span>₹{(order.tax || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <Separator />
                    <div className='flex justify-between font-semibold text-lg'>
                      <span>Total</span>
                      <span>₹{order.total_amount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span>Payment Method</span>
                      <span className='font-medium'>
                        {order.payment_method === 'COD'
                          ? 'Cash on Delivery'
                          : 'Online Payment'}
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span>Payment Status</span>
                      <Badge variant={order.is_paid ? 'default' : 'secondary'}>
                        {order.is_paid ? 'Paid' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className='space-y-3'>
                <Button className='w-full' asChild>
                  <Link href='/account/orders'>
                    <Package className='h-4 w-4 mr-2' />
                    View All Orders
                  </Link>
                </Button>
                <Button variant='outline' className='w-full'>
                  <Download className='h-4 w-4 mr-2' />
                  Download Invoice
                </Button>
                <Button variant='outline' className='w-full'>
                  <Share2 className='h-4 w-4 mr-2' />
                  Share Order Details
                </Button>
              </div>

              {/* Help Section */}
              <Card>
                <CardHeader>
                  <CardTitle className='text-base'>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <p className='text-sm text-muted-foreground'>
                    Have questions about your order? Our customer support team
                    is here to help.
                  </p>
                  <div className='space-y-2'>
                    <Button variant='outline' size='sm' className='w-full'>
                      <Phone className='h-4 w-4 mr-2' />
                      Call Support
                    </Button>
                    <Button variant='outline' size='sm' className='w-full'>
                      <Mail className='h-4 w-4 mr-2' />
                      Email Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
