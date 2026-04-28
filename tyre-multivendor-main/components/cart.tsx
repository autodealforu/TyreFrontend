'use client';

import { useState } from 'react';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  Shield,
  CheckCircle,
  MapPin,
  X,
  Sparkles,
  Star,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useCart } from '@/hooks/useCart';
import { API_URL } from '@/constants';

// Helper function to construct proper image URLs
const getImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) {
    return '/default-image.png';
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  const baseUrl = API_URL || 'http://localhost:8000';
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${baseUrl}/${cleanPath}`;
};

export default function Cart() {
  const router = useRouter();
  const { data: session } = useSession();
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [installationOption, setInstallationOption] = useState('store');
  const [selectedAddress, setSelectedAddress] = useState('home');

  const handleCheckout = () => {
    console.log('Checkout clicked, session:', session);
    console.log('Cart items before checkout:', cart.items.length);
    if (!session) {
      // Redirect to login with checkout redirect parameter
      router.push('/login?redirect=checkout');
    } else {
      router.push('/checkout');
    }
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    updateQuantity(itemId, newQuantity);
  };

  const applyCoupon = () => {
    // Mock coupon validation
    if (couponCode.toLowerCase() === 'save10') {
      setAppliedCoupon('SAVE10');
      setCouponCode('');
    } else if (couponCode.toLowerCase() === 'first20') {
      setAppliedCoupon('FIRST20');
      setCouponCode('');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Calculate totals using dynamic cart data
  const subtotal = cart.totalPrice;
  const totalInstallationFee = cart.items.reduce(
    (sum, item) => sum + (item.installationFee || 0) * item.quantity,
    0
  );
  const deliveryFee =
    deliveryOption === 'express' ? 500 : subtotal >= 15000 ? 0 : 200;

  let discount = 0;
  if (appliedCoupon === 'SAVE10') {
    discount = subtotal * 0.1;
  } else if (appliedCoupon === 'FIRST20') {
    discount = subtotal * 0.2;
  }

  const tax = (subtotal - discount + totalInstallationFee + deliveryFee) * 0.18;
  const total = subtotal - discount + totalInstallationFee + deliveryFee + tax;

  const totalSavings =
    cart.items.reduce(
      (sum, item) =>
        sum + ((item.originalPrice || item.price) - item.price) * item.quantity,
      0
    ) + discount;

  const addresses = [
    {
      id: 'home',
      type: 'Home',
      address: '123 Main Street, Sector 18, Noida, UP 201301',
      phone: '+91 98765 43210',
    },
    {
      id: 'office',
      type: 'Office',
      address: '456 Business Park, Sector 62, Noida, UP 201309',
      phone: '+91 98765 43211',
    },
  ];

  return (
    <div className='min-h-screen bg-[#e5e5e5]'>
      {/* Breadcrumb */}
      <div className='container mx-auto px-4 py-6'>
        <div className='bg-white rounded-lg border border-gray-200 p-4 shadow-sm'>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href='/'
                  className='text-[#14213d] hover:text-[#fca311]'
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className='text-gray-400' />
              <BreadcrumbItem>
                <BreadcrumbPage className='text-[#14213d]'>
                  Shopping Cart
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className='container mx-auto px-4 pb-12'>
        {/* Cart Header */}
        <div className='flex items-center justify-between mb-8'>
          <div className='space-y-2'>
            <div className='flex items-center gap-3'>
              <div className='p-3 rounded-xl bg-gradient-to-r from-[#14213d] to-[#fca311] shadow-lg'>
                <ShoppingCart className='h-6 w-6 text-white' />
              </div>
              <div>
                <h1 className='text-4xl font-bold text-[#14213d]'>
                  Shopping Cart
                </h1>
                <p className='text-gray-600 mt-1 flex items-center gap-2'>
                  <Sparkles className='h-4 w-4' />
                  {cart.totalItems}{' '}
                  {cart.totalItems === 1 ? 'premium item' : 'premium items'} in
                  your cart
                </p>
              </div>
            </div>
          </div>
          <Button
            variant='outline'
            asChild
            className='border-[#14213d] text-[#14213d] hover:bg-[#14213d] hover:text-white'
          >
            <Link href='/' className='flex items-center gap-2'>
              <ArrowLeft className='h-4 w-4' />
              Continue Shopping
            </Link>
          </Button>
        </div>

        {cart.items.length === 0 ? (
          // Empty cart design
          <div className='text-center py-20'>
            <div className='relative'>
              <div className='h-32 w-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-200'>
                <ShoppingCart className='h-16 w-16 text-gray-400' />
              </div>
              <div className='absolute -top-2 -right-2 h-8 w-8 bg-[#fca311] rounded-full flex items-center justify-center'>
                <span className='text-white text-xs font-bold'>0</span>
              </div>
            </div>
            <h2 className='text-3xl font-bold text-[#14213d] mb-3'>
              Your cart is empty
            </h2>
            <p className='text-gray-600 mb-8 text-lg'>
              Discover premium tyres and automotive products
            </p>
            <Button
              asChild
              size='lg'
              className='bg-[#fca311] hover:bg-[#fca311]/90 text-white shadow-lg'
            >
              <Link href='/'>Explore Products</Link>
            </Button>
          </div>
        ) : (
          <div className='grid lg:grid-cols-3 gap-8'>
            {/* Cart Items */}
            <div className='lg:col-span-2 space-y-6'>
              {/* Savings Banner */}
              {totalSavings > 0 && (
                <div className='bg-green-50 border border-green-200 rounded-xl p-6'>
                  <div className='flex items-center gap-3'>
                    <div className='p-2 rounded-lg bg-green-100'>
                      <CheckCircle className='h-6 w-6 text-green-600' />
                    </div>
                    <div>
                      <span className='font-semibold text-green-700 text-lg'>
                        Amazing Savings!
                      </span>
                      <p className='text-green-600 text-sm'>
                        You're saving ₹{totalSavings.toLocaleString('en-IN')} on
                        this order
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Cart Items List */}
              <div className='space-y-4'>
                {cart.items.map((item) => (
                  <Card
                    key={item.id}
                    className='overflow-hidden hover:shadow-xl transition-all duration-300 bg-white border border-gray-200 hover:border-[#fca311]/30'
                  >
                    <CardContent className='p-6'>
                      <div className='grid md:grid-cols-12 gap-6 items-center'>
                        {/* Product Image */}
                        <div className='md:col-span-2'>
                          <div className='relative aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-200'>
                            <Image
                              src={
                                getImageUrl(item.image) || '/placeholder.svg'
                              }
                              alt={item.name}
                              fill
                              className='object-cover hover:scale-105 transition-transform duration-300'
                              sizes='(max-width: 768px) 100px, 120px'
                            />
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className='md:col-span-5'>
                          <div className='space-y-3'>
                            <div className='flex items-center gap-2 flex-wrap'>
                              <Badge
                                variant='outline'
                                className='text-xs bg-[#14213d]/10 border-[#14213d]/20 text-[#14213d]'
                              >
                                {item.brand || 'Premium Brand'}
                              </Badge>
                              <Badge
                                variant='secondary'
                                className='text-xs bg-[#fca311]/10 border-[#fca311]/20 text-[#fca311]'
                              >
                                {item.productType
                                  ? item.productType.replace('_', ' ')
                                  : 'Premium Product'}
                              </Badge>
                              <div className='flex items-center gap-1'>
                                <Star className='h-3 w-3 text-[#fca311] fill-current' />
                                <span className='text-xs text-[#fca311]'>
                                  4.8
                                </span>
                              </div>
                            </div>
                            <h3 className='font-semibold text-xl text-[#14213d]'>
                              {item.name}
                            </h3>

                            {/* Product Type Specific Details */}
                            {item.productType === 'TYRE' && item.size && (
                              <p className='text-sm text-gray-600'>
                                Size: {item.size}
                              </p>
                            )}

                            {item.productType === 'ALLOY_WHEEL' && (
                              <div className='text-sm text-gray-600 space-y-1'>
                                {item.product.diameter && (
                                  <p>Diameter: {item.product.diameter}"</p>
                                )}
                                {item.product.width && (
                                  <p>Width: {item.product.width}"</p>
                                )}
                                {item.product.pcd && (
                                  <p>PCD: {item.product.pcd}</p>
                                )}
                              </div>
                            )}

                            {item.productType === 'SERVICE' && (
                              <div className='text-sm text-gray-600 space-y-1'>
                                {item.product.service_type && (
                                  <p>Type: {item.product.service_type}</p>
                                )}
                                {item.product.estimated_time && (
                                  <p>Duration: {item.product.estimated_time}</p>
                                )}
                                {item.product.location_type && (
                                  <p>Location: {item.product.location_type}</p>
                                )}
                              </div>
                            )}

                            <div className='flex items-center gap-2 text-sm text-gray-600'>
                              <MapPin className='h-4 w-4 text-[#fca311]' />
                              <span className='font-medium'>
                                {item.vendor.name}
                              </span>
                            </div>
                            <p className='text-sm text-gray-500'>
                              {item.vendor.location}
                            </p>
                            <Badge
                              variant={item.inStock ? 'default' : 'destructive'}
                              className={`text-xs ${
                                item.inStock
                                  ? 'bg-green-100 border-green-200 text-green-700'
                                  : 'bg-red-100 border-red-200 text-red-700'
                              }`}
                            >
                              {item.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                            </Badge>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className='md:col-span-2 flex flex-col items-center gap-3'>
                          <div className='flex items-center gap-3 bg-gray-50 rounded-xl p-2 border border-gray-200'>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='h-8 w-8 p-0 cursor-pointer hover:bg-gray-100 text-[#14213d]'
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                            >
                              <Minus className='h-4 w-4' />
                            </Button>
                            <span className='w-12 text-center font-bold text-[#14213d] text-lg'>
                              {item.quantity}
                            </span>
                            <Button
                              size='sm'
                              className='h-8 w-8 p-0 cursor-pointer bg-[#fca311] hover:bg-[#fca311]/90'
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                              disabled={!item.inStock}
                            >
                              <Plus className='h-4 w-4' />
                            </Button>
                          </div>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer'
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className='h-4 w-4 mr-1' />
                            Remove
                          </Button>
                        </div>

                        {/* Price */}
                        <div className='md:col-span-3 text-right'>
                          <div className='space-y-2'>
                            <div className='flex items-center justify-end gap-2'>
                              <span className='text-2xl font-bold text-[#14213d]'>
                                ₹
                                {(item.price * item.quantity).toLocaleString(
                                  'en-IN'
                                )}
                              </span>
                            </div>
                            {item.originalPrice &&
                              item.originalPrice > item.price && (
                                <div className='text-sm text-gray-500 line-through'>
                                  ₹
                                  {(
                                    item.originalPrice * item.quantity
                                  ).toLocaleString('en-IN')}
                                </div>
                              )}
                            <div className='text-sm text-gray-400'>
                              ₹{item.price.toLocaleString('en-IN')} each
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Clear Cart */}
              <div className='flex justify-center pt-4'>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant='outline' className='cursor-pointer'>
                      <Trash2 className='h-4 w-4 mr-2' />
                      Clear Cart
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear Cart</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove all items from your
                        cart? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={clearCart}>
                        Clear Cart
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {/* Order Summary */}
            <div className='lg:col-span-1'>
              <Card className='sticky top-4 bg-white border border-gray-200 shadow-lg'>
                <CardHeader className='bg-gray-50'>
                  <CardTitle className='text-[#14213d] flex items-center gap-2'>
                    <Sparkles className='h-5 w-5' />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-6 p-6'>
                  {/* Coupon Code */}
                  <div className='space-y-3'>
                    <label className='text-sm font-medium text-[#14213d]'>
                      Have a Coupon?
                    </label>
                    <div className='flex gap-2'>
                      <Input
                        placeholder='Enter coupon code'
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className='flex-1 bg-white border-gray-300 text-[#14213d] placeholder:text-gray-500 focus:border-[#fca311]'
                      />
                      <Button
                        onClick={applyCoupon}
                        size='sm'
                        className='cursor-pointer bg-[#fca311] hover:bg-[#fca311]/90'
                      >
                        Apply
                      </Button>
                    </div>
                    {appliedCoupon && (
                      <div className='flex items-center justify-between text-sm bg-green-50 p-3 rounded-lg border border-green-200'>
                        <span className='text-green-700 font-medium'>
                          ✓ {appliedCoupon} applied
                        </span>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={removeCoupon}
                          className='h-auto p-1 text-red-600 hover:text-red-700 cursor-pointer'
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      </div>
                    )}
                  </div>

                  <Separator className='bg-gray-200' />

                  {/* Price Breakdown */}
                  <div className='space-y-3 text-sm'>
                    <div className='flex justify-between text-gray-600'>
                      <span>Subtotal ({cart.totalItems} items)</span>
                      <span className='font-medium'>
                        ₹{subtotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className='flex justify-between text-green-600'>
                        <span>Discount</span>
                        <span className='font-medium'>
                          -₹{discount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                    <div className='flex justify-between text-gray-600'>
                      <span>Installation Fee</span>
                      <span className='font-medium'>
                        ₹{totalInstallationFee.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className='flex justify-between text-gray-600'>
                      <span>Delivery Fee</span>
                      <span className='font-medium'>
                        {deliveryFee === 0 ? (
                          <span className='text-green-600'>FREE</span>
                        ) : (
                          `₹${deliveryFee.toLocaleString('en-IN')}`
                        )}
                      </span>
                    </div>
                    <div className='flex justify-between text-gray-600'>
                      <span>Tax (GST 18%)</span>
                      <span className='font-medium'>
                        ₹{tax.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <Separator className='bg-gray-200' />
                    <div className='flex justify-between font-bold text-xl'>
                      <span className='text-[#14213d]'>Total</span>
                      <span className='text-[#14213d]'>
                        ₹{total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <Button
                    className='w-full mt-6 cursor-pointer bg-[#fca311] hover:bg-[#fca311]/90 text-white shadow-lg text-lg py-6'
                    size='lg'
                    onClick={handleCheckout}
                  >
                    <Shield className='h-5 w-5' />
                    Secure Checkout
                  </Button>

                  {/* Security Badge */}
                  <div className='flex items-center justify-center gap-2 text-xs text-gray-400 mt-4 bg-white/5 p-3 rounded-lg'>
                    <Shield className='h-4 w-4 text-green-400' />
                    <span>256-bit SSL Encrypted</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
