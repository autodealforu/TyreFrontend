'use client';

import { useState, useEffect } from 'react';
import {
  ShoppingCart,
  MapPin,
  Plus,
  Edit,
  ArrowLeft,
  Shield,
  Truck,
  CreditCard,
  Lock,
  CheckCircle,
  Home,
  Building,
  Store,
  ChevronRight,
  Loader2,
  Sparkles,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

import { useCart } from '@/hooks/useCart';
import type {
  Address,
  CheckoutState,
  CreateOrderRequest,
} from '@/types/checkout';
import {
  createOrder,
  getUserAddresses,
  addUserAddress,
  validateCoupon,
  initializePayment,
} from '@/actions/order.action';
import { ApiClient } from '@/lib/api-client';
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

export default function CheckoutEnhanced() {
  const router = useRouter();
  const { data: session } = useSession();
  const { cart, clearCart, isCartLoaded } = useCart();

  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    step: 1,
    selectedAddress: 0,
    billingAddress: 0,
    sameAsShipping: true,
    deliveryOption: 'STANDARD',
    installationOption: 'NONE',
    paymentMethod: 'COD',
    isProcessing: false,
  });

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    type: 'Home',
    name: '',
    phone: '',
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    isDefault: false,
  });

  const steps = [
    {
      id: 1,
      title: 'Address',
      description: 'Delivery & Billing',
      isCompleted: false,
      isActive: true,
    },
    {
      id: 2,
      title: 'Payment',
      description: 'Payment Method',
      isCompleted: false,
      isActive: false,
    },
    {
      id: 3,
      title: 'Review',
      description: 'Confirm Order',
      isCompleted: false,
      isActive: false,
    },
  ];

  // Check authentication and redirect if needed
  useEffect(() => {
    if (session === null) {
      // User is not authenticated, redirect to login
      router.push('/login?redirect=checkout');
    }
  }, [session, router]);

  // Load user addresses on mount
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        if (!session?.user?.id || !session?.accessToken) {
          return;
        }
        const result = await ApiClient.getUserAddresses(
          session.user.id,
          session.accessToken
        );
        if (result.success && result.addresses) {
          setAddresses(result.addresses);
        }
      } catch (error) {
        console.error('Error loading addresses:', error);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    loadAddresses();
  }, [session?.user?.id, session?.accessToken]);

  // Redirect to cart if empty (but only after cart has been loaded from localStorage)
  useEffect(() => {
    // Only check and redirect once the cart has been loaded and session is ready
    if (isCartLoaded && session !== undefined && cart.items.length === 0) {
      console.log('Cart is empty after loading, redirecting to cart page');
      router.push('/cart');
    }
  }, [cart.items.length, router, session, isCartLoaded]);

  const updateCheckoutState = (updates: Partial<CheckoutState>) => {
    setCheckoutState((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (checkoutState.step < 3) {
      updateCheckoutState({ step: checkoutState.step + 1 });
    }
  };

  const prevStep = () => {
    if (checkoutState.step > 1) {
      updateCheckoutState({ step: checkoutState.step - 1 });
    }
  };

  const addNewAddress = async () => {
    try {
      if (!session?.user?.id || !session?.accessToken) {
        toast.error('Please login to add address');
        return;
      }

      const result = await ApiClient.addUserAddress(
        session.user.id,
        newAddress,
        session.accessToken
      );
      if (result.success && result.address) {
        setAddresses((prev) => [...prev, result.address!]);
        setIsAddingAddress(false);
        setNewAddress({
          type: 'Home',
          name: '',
          phone: '',
          address_1: '',
          address_2: '',
          city: '',
          state: '',
          pincode: '',
          landmark: '',
          isDefault: false,
        });
        toast.success('Address added successfully');
      } else {
        toast.error(result.message || 'Failed to add address');
      }
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add address');
    }
  };

  const applyCouponCode = async () => {
    try {
      if (!couponCode.trim()) {
        toast.error('Please enter a coupon code');
        return;
      }

      const result = await ApiClient.validateCoupon(
        couponCode,
        getSubtotal(),
        session?.accessToken
      );
      if (result.success && result.discount) {
        setAppliedCoupon({
          code: couponCode,
          discount: result.discount,
        });
        setCouponCode('');
        toast.success('Coupon applied successfully');
      } else {
        toast.error(result.message || 'Invalid coupon code');
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error('Failed to apply coupon');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.success('Coupon removed');
  };

  // Calculate order totals
  const getSubtotal = () => cart.totalPrice;

  const getInstallationFee = () => 0; // No installation fees

  const getDeliveryFee = () => 0; // No delivery fees

  const getDiscount = () => appliedCoupon?.discount || 0;

  const getTax = () => {
    const taxableAmount = getSubtotal() - getDiscount();
    return taxableAmount * 0.18; // 18% GST
  };

  const getTotal = () => {
    return getSubtotal() - getDiscount() + getTax();
  };

  const processOrder = async () => {
    try {
      updateCheckoutState({ isProcessing: true });

      if (!session?.user) {
        toast.error('Please login to place order');
        return;
      }

      const selectedShippingAddress = addresses[checkoutState.selectedAddress];
      const selectedBillingAddress = checkoutState.sameAsShipping
        ? selectedShippingAddress
        : addresses[checkoutState.billingAddress];

      if (!selectedShippingAddress) {
        toast.error('Please select a shipping address');
        return;
      }

      // Transform cart items to order products
      const orderProducts = cart.items.map((item) => ({
        product: item.productId,
        vendor: item.vendorId,
        name: item.name,
        slug: item.productId, // Assuming productId can be used as slug
        brand: item.brand,
        size: item.size,
        regular_price: item.originalPrice || item.price,
        sale_price: item.price,
        image: item.image,
        quantity: item.quantity,
        installation_fee: item.installationFee || 0,
        vendor_details: {
          name: item.vendor.name,
          store_name: item.vendor.store_name || item.vendor.name,
          location: item.vendor.location,
          phone: '',
        },
      }));

      console.log('Order Products to be sent:', orderProducts);

      const orderData: CreateOrderRequest = {
        status: 'PENDING',
        is_paid: false,
        payment_method: checkoutState.paymentMethod,
        total_amount: getTotal(),
        sub_total: getSubtotal(),
        tax: getTax(),
        discount: getDiscount(),
        delivery_charges: 0,

        shipping_address: {
          address_1: selectedShippingAddress.address_1,
          address_2: selectedShippingAddress.address_2,
          city: selectedShippingAddress.city,
          state: selectedShippingAddress.state,
          pin: Number.parseInt(selectedShippingAddress.pincode),
          landmark: selectedShippingAddress.landmark,
        },

        billing_address: {
          address_1: selectedBillingAddress.address_1,
          address_2: selectedBillingAddress.address_2,
          city: selectedBillingAddress.city,
          state: selectedBillingAddress.state,
          pin: Number.parseInt(selectedBillingAddress.pincode),
          landmark: selectedBillingAddress.landmark,
        },

        customer: {
          name: session.user.name || '',
          phone: selectedShippingAddress.phone,
          email: session.user.email || '',
          customer: session.user.id,
        },

        products: orderProducts,

        delivery_details: {
          option: 'STANDARD',
          delivery_charges: 0,
        },

        installation_details: {
          option: 'NONE',
          total_installation_fee: 0,
        },

        created_by: session.user.id,
      };

      const orderResult = await createOrder(orderData);

      console.log('Order Result:', orderResult);
      console.log('Order Products in Response:', orderResult.order?.products);

      if (orderResult.success && orderResult.order) {
        // Handle payment initialization
        if (checkoutState.paymentMethod === 'ONLINE') {
          const paymentResult = await initializePayment(
            orderResult.order._id,
            getTotal(),
            'ONLINE'
          );

          if (paymentResult.success && paymentResult.payment_url) {
            // Redirect to payment gateway
            window.location.href = paymentResult.payment_url;
            return;
          }
        }

        // Clear cart and redirect to order confirmation
        clearCart();
        router.push(
          `/order-confirmation?orderId=${orderResult.order.order_id}`
        );
        toast.success('Order placed successfully!');
      } else {
        toast.error(orderResult.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error('Failed to process order');
    } finally {
      updateCheckoutState({ isProcessing: false });
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <ShoppingCart className='h-16 w-16 text-gray-600 mx-auto mb-4' />
          <h2 className='text-2xl font-semibold mb-2'>Your cart is empty</h2>
          <p className='text-muted-foreground mb-6'>
            Add some items to proceed with checkout
          </p>
          <Button asChild>
            <Link href='/'>Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Show loading while checking authentication or loading cart
  if (session === undefined || !isCartLoaded) {
    return (
      <div className='min-h-screen bg-[#e5e5e5] flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='h-8 w-8 animate-spin text-[#14213d] mx-auto mb-4' />
          <p className='text-gray-600'>
            {session === undefined ? 'Loading...' : 'Loading cart...'}
          </p>
        </div>
      </div>
    );
  }

  // If session is null (not authenticated), the useEffect will redirect
  if (!session) {
    return null;
  }

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
              <BreadcrumbSeparator className='text-gray-600' />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href='/cart'
                  className='text-[#14213d] hover:text-[#fca311]'
                >
                  Cart
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className='text-gray-600' />
              <BreadcrumbItem>
                <BreadcrumbPage className='text-[#14213d]'>
                  Checkout
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className='container mx-auto px-4 pb-12'>
        {/* Checkout Header */}
        <div className='flex items-center justify-between mb-8'>
          <div className='space-y-2'>
            <div className='flex items-center gap-3'>
              <div className='p-3 rounded-xl bg-gradient-to-r from-[#14213d] to-[#fca311] shadow-lg'>
                <Lock className='h-6 w-6 text-white' />
              </div>
              <div>
                <h1 className='text-4xl font-bold text-[#14213d]'>
                  Secure Checkout
                </h1>
                <p className='text-gray-600 mt-1 flex items-center gap-2'>
                  <Shield className='h-4 w-4 text-green-600' />
                  Complete your premium order
                </p>
              </div>
            </div>
          </div>
          <Button
            variant='outline'
            asChild
            className='border-[#14213d] text-[#14213d] hover:bg-[#14213d] hover:text-[#14213d]'
          >
            <Link href='/cart' className='flex items-center gap-2'>
              <ArrowLeft className='h-4 w-4' />
              Back to Cart
            </Link>
          </Button>
        </div>

        {/* Progress Steps */}
        <div className='mb-8'>
          <div className='flex items-center justify-between max-w-4xl mx-auto bg-white rounded-2xl p-6 border border-gray-200 shadow-sm'>
            {steps.map((step, index) => (
              <div key={step.id} className='flex items-center'>
                <div className='flex flex-col items-center'>
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      checkoutState.step >= step.id
                        ? 'bg-[#fca311] text-[#14213d] shadow-lg scale-110'
                        : 'bg-gray-100 text-gray-600 border border-gray-300'
                    }`}
                  >
                    {checkoutState.step > step.id ? (
                      <CheckCircle className='h-6 w-6' />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className='mt-3 text-center'>
                    <div
                      className={`text-sm font-medium ${
                        checkoutState.step >= step.id
                          ? 'text-[#14213d]'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </div>
                    <div className='text-xs text-gray-500'>
                      {step.description}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 w-20 mx-6 rounded-full transition-all duration-300 ${
                      checkoutState.step > step.id
                        ? 'bg-[#fca311]'
                        : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Step 1: Address Selection */}
            {checkoutState.step === 1 && (
              <Card className='bg-white border border-gray-200 shadow-lg'>
                <CardHeader className='bg-gray-50'>
                  <CardTitle className='flex items-center gap-2 text-[#14213d]'>
                    <MapPin className='h-5 w-5' />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4 p-6'>
                  {isLoadingAddresses ? (
                    <div className='flex items-center justify-center py-8'>
                      <Loader2 className='h-6 w-6 animate-spin text-[#14213d]' />
                      <span className='ml-2 text-gray-600'>
                        Loading addresses...
                      </span>
                    </div>
                  ) : addresses.length > 0 ? (
                    <RadioGroup
                      value={checkoutState.selectedAddress.toString()}
                      onValueChange={(value) =>
                        updateCheckoutState({
                          selectedAddress: Number.parseInt(value),
                        })
                      }
                    >
                      {addresses.map((address, index) => (
                        <div
                          key={address.id || index}
                          className='flex items-start space-x-3 p-4 border rounded-lg border-gray-300 bg-gray-50'
                        >
                          <RadioGroupItem
                            value={index.toString()}
                            id={`address-${index}`}
                            className='mt-1'
                          />
                          <div className='flex-1'>
                            <Label
                              htmlFor={`address-${index}`}
                              className='cursor-pointer'
                            >
                              <div className='flex items-center gap-2 mb-1'>
                                <span className='font-medium text-[#14213d]'>
                                  {address.type}
                                </span>
                                {address.isDefault && (
                                  <Badge
                                    variant='secondary'
                                    className='text-xs'
                                  >
                                    Default
                                  </Badge>
                                )}
                              </div>
                              <div className='text-sm font-medium text-gray-600'>
                                {address.name}
                              </div>
                              <div className='text-sm text-gray-600'>
                                {address.address_1}
                                {address.address_2 && `, ${address.address_2}`}
                              </div>
                              <div className='text-sm text-gray-600'>
                                {address.city}, {address.state}{' '}
                                {address.pincode}
                              </div>
                              <div className='text-sm text-gray-600'>
                                {address.phone}
                              </div>
                            </Label>
                          </div>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='text-[#14213d]/80 hover:text-[#14213d]'
                          >
                            <Edit className='h-4 w-4' />
                          </Button>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    <div className='text-center py-8'>
                      <MapPin className='h-12 w-12 text-gray-600 mx-auto mb-4' />
                      <h3 className='text-lg font-medium mb-2 text-[#14213d]'>
                        No addresses found
                      </h3>
                      <p className='text-gray-500 mb-4'>
                        Add your first delivery address to continue
                      </p>
                    </div>
                  )}

                  {/* Add New Address */}
                  <Dialog
                    open={isAddingAddress}
                    onOpenChange={setIsAddingAddress}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant='outline'
                        className='w-full bg-white border-gray-300 text-[#14213d] hover:bg-gray-50'
                      >
                        <Plus className='h-4 w-4 mr-2' />
                        Add New Address
                      </Button>
                    </DialogTrigger>
                    <DialogContent className='max-w-md max-h-[80vh] overflow-y-auto bg-white border border-gray-200 shadow-2xl'>
                      <DialogHeader>
                        <DialogTitle className='text-[#14213d]'>
                          Add New Address
                        </DialogTitle>
                        <DialogDescription className='text-gray-600'>
                          Add a new delivery address to your account
                        </DialogDescription>
                      </DialogHeader>
                      <div className='space-y-4'>
                        <div className='space-y-2'>
                          <Label className='text-[#14213d]'>Address Type</Label>
                          <Select
                            value={newAddress.type}
                            onValueChange={(
                              value: 'Home' | 'Office' | 'Other'
                            ) => setNewAddress({ ...newAddress, type: value })}
                          >
                            <SelectTrigger className='bg-white border-gray-300 text-[#14213d] hover:bg-gray-50'>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className='bg-white border border-gray-200 shadow-2xl'>
                              <SelectItem
                                value='Home'
                                className='text-[#14213d] hover:bg-gray-100'
                              >
                                <div className='flex items-center gap-2'>
                                  <Home className='h-4 w-4' />
                                  Home
                                </div>
                              </SelectItem>
                              <SelectItem
                                value='Office'
                                className='text-[#14213d] hover:bg-gray-100'
                              >
                                <div className='flex items-center gap-2'>
                                  <Building className='h-4 w-4' />
                                  Office
                                </div>
                              </SelectItem>
                              <SelectItem
                                value='Other'
                                className='text-[#14213d] hover:bg-gray-100'
                              >
                                <div className='flex items-center gap-2'>
                                  <MapPin className='h-4 w-4' />
                                  Other
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className='space-y-2'>
                          <Label className='text-[#14213d]'>Full Name</Label>
                          <Input
                            value={newAddress.name}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                name: e.target.value,
                              })
                            }
                            placeholder='Enter full name'
                            className='bg-white border-gray-300 text-[#14213d] hover:bg-gray-50'
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label className='text-[#14213d]'>Phone Number</Label>
                          <Input
                            value={newAddress.phone}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                phone: e.target.value,
                              })
                            }
                            placeholder='Enter phone number'
                            className='bg-white border-gray-300 text-[#14213d] hover:bg-gray-50'
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label className='text-[#14213d]'>
                            Address Line 1
                          </Label>
                          <Textarea
                            value={newAddress.address_1}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                address_1: e.target.value,
                              })
                            }
                            placeholder='House/Flat no, Building name, Street'
                            className='bg-white border-gray-300 text-[#14213d] hover:bg-gray-50'
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label className='text-[#14213d]'>
                            Address Line 2 (Optional)
                          </Label>
                          <Input
                            value={newAddress.address_2}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                address_2: e.target.value,
                              })
                            }
                            placeholder='Area, Locality'
                            className='bg-white border-gray-300 text-[#14213d] hover:bg-gray-50'
                          />
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                          <div className='space-y-2'>
                            <Label className='text-[#14213d]'>City</Label>
                            <Input
                              value={newAddress.city}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  city: e.target.value,
                                })
                              }
                              placeholder='City'
                              className='bg-white border-gray-300 text-[#14213d] hover:bg-gray-50'
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label className='text-[#14213d]'>State</Label>
                            <Input
                              value={newAddress.state}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  state: e.target.value,
                                })
                              }
                              placeholder='State'
                              className='bg-white border-gray-300 text-[#14213d] hover:bg-gray-50'
                            />
                          </div>
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                          <div className='space-y-2'>
                            <Label className='text-[#14213d]'>Pincode</Label>
                            <Input
                              value={newAddress.pincode}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  pincode: e.target.value,
                                })
                              }
                              placeholder='Pincode'
                              className='bg-white border-gray-300 text-[#14213d] hover:bg-gray-50'
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label className='text-[#14213d]'>
                              Landmark (Optional)
                            </Label>
                            <Input
                              value={newAddress.landmark}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  landmark: e.target.value,
                                })
                              }
                              placeholder='Landmark'
                              className='bg-white border-gray-300 text-[#14213d] hover:bg-gray-50'
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant='outline'
                          onClick={() => setIsAddingAddress(false)}
                          className='bg-white border-gray-300 text-[#14213d] hover:bg-gray-50'
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={addNewAddress}
                          className='bg-[#fca311] hover:from-blue-700 hover:to-purple-700 text-[#14213d] shadow-lg'
                        >
                          Add Address
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Billing Address Section */}
                  <div className='space-y-4 pt-4'>
                    <Separator className='bg-gray-200' />
                    <div className='flex items-center space-x-2'>
                      <Checkbox
                        id='same-as-shipping'
                        checked={checkoutState.sameAsShipping}
                        onCheckedChange={(checked) =>
                          updateCheckoutState({
                            sameAsShipping: checked as boolean,
                          })
                        }
                      />
                      <Label
                        htmlFor='same-as-shipping'
                        className='text-[#14213d]'
                      >
                        Billing address same as shipping address
                      </Label>
                    </div>

                    {!checkoutState.sameAsShipping && addresses.length > 0 && (
                      <div>
                        <Label className='text-sm font-medium mb-2 block text-[#14213d]'>
                          Billing Address
                        </Label>
                        <RadioGroup
                          value={checkoutState.billingAddress.toString()}
                          onValueChange={(value) =>
                            updateCheckoutState({
                              billingAddress: Number.parseInt(value),
                            })
                          }
                        >
                          {addresses.map((address, index) => (
                            <div
                              key={`billing-${address.id || index}`}
                              className='flex items-start space-x-3 p-3 border rounded-lg bg-white border-gray-300'
                            >
                              <RadioGroupItem
                                value={index.toString()}
                                id={`billing-address-${index}`}
                                className='mt-1'
                              />
                              <div className='flex-1'>
                                <Label
                                  htmlFor={`billing-address-${index}`}
                                  className='cursor-pointer'
                                >
                                  <div className='text-sm font-medium text-gray-600'>
                                    {address.name}
                                  </div>
                                  <div className='text-sm text-gray-600'>
                                    {address.address_1}, {address.city},{' '}
                                    {address.state} {address.pincode}
                                  </div>
                                </Label>
                              </div>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    )}
                  </div>

                  <div className='flex justify-end pt-4'>
                    <Button
                      onClick={nextStep}
                      disabled={addresses.length === 0}
                      className='cursor-pointer bg-[#fca311] hover:from-blue-700 hover:to-purple-700 text-[#14213d] shadow-lg'
                      size='lg'
                    >
                      Continue to Services
                      <ChevronRight className='h-4 w-4 ml-2' />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment Method */}
            {checkoutState.step === 2 && (
              <Card className='bg-white border border-gray-200 shadow-2xl'>
                <CardHeader className='bg-gradient-to-r from-blue-600/10 to-purple-600/10'>
                  <CardTitle className='flex items-center gap-2 text-[#14213d]'>
                    <CreditCard className='h-5 w-5' />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4 p-6'>
                  <RadioGroup
                    value={checkoutState.paymentMethod}
                    onValueChange={(value: 'ONLINE' | 'COD') =>
                      updateCheckoutState({ paymentMethod: value })
                    }
                  >
                    <div className='flex items-start space-x-3 p-4 border rounded-lg border-gray-300 bg-white'>
                      <RadioGroupItem
                        value='ONLINE'
                        id='payment-online'
                        className='mt-1'
                      />
                      <div className='flex-1'>
                        <Label
                          htmlFor='payment-online'
                          className='cursor-pointer'
                        >
                          <div className='flex items-center justify-between'>
                            <div>
                              <div className='font-medium text-[#14213d]'>
                                Online Payment
                              </div>
                              <div className='text-sm text-gray-600'>
                                Pay securely using UPI, Cards, Net Banking
                              </div>
                            </div>
                            <div className='flex items-center gap-2'>
                              <Lock className='h-4 w-4 text-green-600' />
                              <span className='text-sm text-green-600'>
                                Secure
                              </span>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>

                    <div className='flex items-start space-x-3 p-4 border rounded-lg border-gray-300 bg-white'>
                      <RadioGroupItem
                        value='COD'
                        id='payment-cod'
                        className='mt-1'
                      />
                      <div className='flex-1'>
                        <Label htmlFor='payment-cod' className='cursor-pointer'>
                          <div className='flex items-center justify-between'>
                            <div>
                              <div className='font-medium text-[#14213d]'>
                                Cash on Delivery
                              </div>
                              <div className='text-sm text-gray-600'>
                                Pay when your order is delivered
                              </div>
                            </div>
                            <div className='text-right'>
                              <div className='text-sm text-orange-600'>
                                COD Available
                              </div>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>

                  <div className='flex justify-between pt-4'>
                    <Button
                      variant='outline'
                      onClick={prevStep}
                      className='cursor-pointer bg-white border-gray-300 text-[#14213d] hover:bg-gray-50'
                    >
                      <ArrowLeft className='h-4 w-4 mr-2' />
                      Back to Services
                    </Button>
                    <Button
                      onClick={nextStep}
                      className='cursor-pointer bg-[#fca311] hover:from-blue-700 hover:to-purple-700 text-[#14213d] shadow-lg'
                      size='lg'
                    >
                      Review Order
                      <ChevronRight className='h-4 w-4 ml-2' />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Order Review */}
            {checkoutState.step === 3 && (
              <div className='space-y-6'>
                {/* Order Summary */}
                <Card className='bg-white border border-gray-200 shadow-2xl'>
                  <CardHeader className='bg-gradient-to-r from-blue-600/10 to-purple-600/10'>
                    <CardTitle className='text-[#14213d]'>
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4 p-6'>
                    {cart.items.map((item) => (
                      <div
                        key={item.id}
                        className='flex items-center gap-4 p-4 border rounded-lg border-gray-300 bg-white'
                      >
                        <div className='relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden'>
                          <Image
                            src={getImageUrl(item.image) || '/placeholder.svg'}
                            alt={item.name}
                            fill
                            className='object-cover'
                            sizes='64px'
                          />
                        </div>
                        <div className='flex-1'>
                          <h3 className='font-medium text-[#14213d]'>
                            {item.name}
                          </h3>
                          <p className='text-sm text-gray-600'>
                            Size: {item.size} | {item.vendor.name}
                          </p>
                          <p className='text-sm text-gray-600'>
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className='text-right'>
                          <div className='font-medium text-[#14213d]'>
                            ₹
                            {(item.price * item.quantity).toLocaleString(
                              'en-IN'
                            )}
                          </div>
                          {item.originalPrice &&
                            item.originalPrice > item.price && (
                              <div className='text-sm text-gray-600 line-through'>
                                ₹
                                {(
                                  item.originalPrice * item.quantity
                                ).toLocaleString('en-IN')}
                              </div>
                            )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Address Summary */}
                <Card className='bg-white border border-gray-200 shadow-2xl'>
                  <CardHeader className='bg-gradient-to-r from-blue-600/10 to-purple-600/10'>
                    <CardTitle className='text-[#14213d]'>
                      Delivery Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4 p-6'>
                    <div>
                      <h4 className='font-medium mb-2 text-[#14213d]'>
                        Shipping Address
                      </h4>
                      {addresses[checkoutState.selectedAddress] && (
                        <div className='text-sm text-gray-600'>
                          <p>{addresses[checkoutState.selectedAddress].name}</p>
                          <p>
                            {addresses[checkoutState.selectedAddress].address_1}
                          </p>
                          {addresses[checkoutState.selectedAddress]
                            .address_2 && (
                            <p>
                              {
                                addresses[checkoutState.selectedAddress]
                                  .address_2
                              }
                            </p>
                          )}
                          <p>
                            {addresses[checkoutState.selectedAddress].city},{' '}
                            {addresses[checkoutState.selectedAddress].state}{' '}
                            {addresses[checkoutState.selectedAddress].pincode}
                          </p>
                          <p>
                            {addresses[checkoutState.selectedAddress].phone}
                          </p>
                        </div>
                      )}
                    </div>

                    <Separator className='bg-gray-200' />

                    <div className='grid md:grid-cols-2 gap-4'>
                      <div>
                        <h4 className='font-medium mb-2 text-[#14213d]'>
                          Delivery Option
                        </h4>
                        <p className='text-sm text-gray-600'>
                          {checkoutState.deliveryOption === 'STANDARD' &&
                            'Standard Delivery (3-5 days)'}
                          {checkoutState.deliveryOption === 'EXPRESS' &&
                            'Express Delivery (1-2 days)'}
                          {checkoutState.deliveryOption === 'SAME_DAY' &&
                            'Same Day Delivery'}
                        </p>
                      </div>
                      <div>
                        <h4 className='font-medium mb-2 text-[#14213d]'>
                          Installation
                        </h4>
                        <p className='text-sm text-gray-600'>
                          {checkoutState.installationOption === 'STORE' &&
                            'At Store (FREE)'}
                          {checkoutState.installationOption === 'HOME' &&
                            'At Your Location'}
                          {checkoutState.installationOption === 'NONE' &&
                            'No Installation'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className='flex justify-between'>
                  <Button
                    variant='outline'
                    onClick={prevStep}
                    className='cursor-pointer bg-white border-gray-300 text-[#14213d] hover:bg-gray-50'
                  >
                    <ArrowLeft className='h-4 w-4 mr-2' />
                    Back to Payment
                  </Button>
                  <Button
                    onClick={processOrder}
                    disabled={checkoutState.isProcessing}
                    className='cursor-pointer bg-[#fca311] hover:from-blue-700 hover:to-purple-700 text-[#14213d] shadow-lg'
                    size='lg'
                  >
                    {checkoutState.isProcessing ? (
                      <>
                        <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className='h-4 w-4 mr-2' />
                        Place Order - ₹{getTotal().toLocaleString('en-IN')}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className='lg:col-span-1'>
            <Card className='sticky top-4 bg-white border border-gray-200 shadow-2xl'>
              <CardHeader className='bg-gradient-to-r from-blue-600/10 to-purple-600/10'>
                <CardTitle className='text-[#14213d] flex items-center gap-2'>
                  <Sparkles className='h-5 w-5' />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4 p-6'>
                {/* Items Summary */}
                <div className='space-y-3 text-sm'>
                  <div className='flex justify-between text-gray-600'>
                    <span>Subtotal ({cart.totalItems} items)</span>
                    <span className='font-medium text-[#14213d]'>
                      ₹{getSubtotal().toLocaleString('en-IN')}
                    </span>
                  </div>
                  {getDiscount() > 0 && (
                    <div className='flex justify-between text-green-400'>
                      <span>Discount</span>
                      <span className='font-medium'>
                        -₹{getDiscount().toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                  <div className='flex justify-between text-gray-600'>
                    <span>Tax (GST 18%)</span>
                    <span className='font-medium text-[#14213d]'>
                      ₹{getTax().toLocaleString('en-IN')}
                    </span>
                  </div>
                  <Separator className='bg-gray-200' />
                  <div className='flex justify-between font-bold text-xl'>
                    <span className='text-[#14213d]'>Total</span>
                    <span className='bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
                      ₹{getTotal().toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Coupon Code */}
                {!appliedCoupon && (
                  <div className='space-y-2'>
                    <Label className='text-sm font-medium text-[#14213d]'>
                      Coupon Code
                    </Label>
                    <div className='flex gap-2'>
                      <Input
                        placeholder='Enter coupon'
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className='flex-1 bg-white border-gray-300 text-[#14213d] hover:bg-gray-50'
                      />
                      <Button
                        onClick={applyCouponCode}
                        size='sm'
                        className='cursor-pointer bg-[#fca311] hover:from-blue-700 hover:to-purple-700 text-[#14213d] shadow-lg'
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                )}

                {appliedCoupon && (
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-green-400'>
                      Coupon {appliedCoupon.code} applied
                    </span>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={removeCoupon}
                      className='h-auto p-0 text-red-600 cursor-pointer'
                    >
                      Remove
                    </Button>
                  </div>
                )}

                {/* Security Badge */}
                <div className='flex items-center justify-center gap-2 text-xs text-gray-600 pt-4 bg-gray-50 p-3 rounded-lg border border-gray-200'>
                  <Shield className='h-4 w-4 text-green-400' />
                  <span>256-bit SSL Encrypted</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
