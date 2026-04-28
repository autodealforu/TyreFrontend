'use client';

import { useState, useEffect } from 'react';
import {
  Star,
  MapPin,
  Check,
  ChevronUp,
  Share2,
  Heart,
  Truck,
  Shield,
  BarChart4,
  Zap,
  Eye,
  X,
  ShoppingCart,
  Minus,
  Plus,
  Award,
  Users,
} from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { API_URL } from '@/constants';
import { useCart } from '@/hooks/useCart';

// Helper function to construct proper image URLs
const getImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) {
    return '/default-image.png';
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    try {
      const url = new URL(imagePath);
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        return imagePath;
      }
    } catch (error) {
      console.error('Invalid external URL:', imagePath);
      return '/default-image.png';
    }
  }

  if (!API_URL || API_URL.trim() === '') {
    console.error(
      'API_URL environment variable is not set. Please configure NEXT_PUBLIC_API_URL'
    );
    return '/default-image.png';
  }

  try {
    const cleanPath = imagePath.replace(/^[/\\]+/, '').replace(/\\/g, '/');
    const baseUrl = API_URL.replace(/\/$/, '');
    const fullUrl = `${baseUrl}/${cleanPath}`;

    if (fullUrl.includes('undefined') || fullUrl.includes('null')) {
      console.error('Invalid URL contains undefined or null values:', fullUrl);
      return '/default-image.png';
    }

    if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
      console.error('URL does not start with http:// or https://:', fullUrl);
      return '/default-image.png';
    }

    return fullUrl;
  } catch (error) {
    console.error('Error constructing image URL:', {
      imagePath,
      API_URL,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return '/default-image.png';
  }
};

export default function StaticProductDetails({
  tyre,
  vendorProducts = [],
  minPrice = null,
  totalVendors = 0,
}: {
  tyre: any;
  vendorProducts?: any[];
  minPrice?: number | null;
  totalVendors?: number;
}) {
  console.log('tyre', tyre);

  const [mainImage, setMainImage] = useState(
    tyre?.productImages?.length > 0
      ? getImageUrl(tyre?.productImages?.[0])
      : '/default-image.png'
  );
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(0);
  const [filteredVendors, setFilteredVendors] = useState(vendorProducts);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [currentModalImage, setCurrentModalImage] = useState(0);

  // Cart functionality
  const {
    addToCart,
    isInCart,
    getCartItemQuantity,
    removeItemByProductAndVendor,
  } = useCart();

  // Initialize filtered vendors when vendorProducts change
  useEffect(() => {
    setFilteredVendors(vendorProducts);
  }, [vendorProducts]);

  const handlePincodeCheck = () => {
    if (pincode.trim()) {
      const filtered = vendorProducts.filter((product: any) => {
        const vendorPincode = product.vendor?.vendor?.pickup_address?.[0]?.pin;
        return (
          vendorPincode?.includes(pincode) || pincode.includes(vendorPincode)
        );
      });
      setFilteredVendors(filtered);
      setPincodeChecked(true);
    } else {
      setFilteredVendors(vendorProducts);
      setPincodeChecked(false);
    }
  };

  const clearPincodeFilter = () => {
    setPincode('');
    setPincodeChecked(false);
    setFilteredVendors(vendorProducts);
  };

  const openImageModal = (images: string[], startIndex = 0) => {
    setModalImages(images);
    setCurrentModalImage(startIndex);
    setIsImageModalOpen(true);
  };

  const nextModalImage = () => {
    setCurrentModalImage((prev) => (prev + 1) % modalImages.length);
  };

  const prevModalImage = () => {
    setCurrentModalImage(
      (prev) => (prev - 1 + modalImages.length) % modalImages.length
    );
  };

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => setQuantity(Math.max(1, quantity - 1));

  // Cart handlers
  const handleAddToCart = (product: any, selectedQuantity = 1) => {
    addToCart({
      productId: product._id,
      vendorId: product.vendor?.id || product.vendor?._id || product.vendor_id,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      tyreId: tyre._id,
      quantity: selectedQuantity,
      price: product.tyre_price_auto_deal,
      originalPrice: product.tyre_price_rcp,
      vendorProduct: product,
    });
  };

  const handleQuantityChange = (product: any, change: number) => {
    const currentQuantity = getItemQuantityInCart(product);
    const newQuantity = currentQuantity + change;

    if (newQuantity <= 0) {
      // Remove item completely from cart
      removeItemByProductAndVendor(
        product._id,
        product.vendor?.id || product.vendor?._id || product.vendor_id
      );
    } else {
      // Add the change in quantity
      handleAddToCart(product, change);
    }
  };

  const getItemQuantityInCart = (product: any) => {
    return getCartItemQuantity(
      product._id,
      product.vendor?.id || product.vendor?._id || product.vendor_id
    );
  };

  const isItemInCart = (product: any) => {
    return isInCart(
      product._id,
      product.vendor?.id || product.vendor?._id || product.vendor_id
    );
  };

  return (
    <div className='min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100'>
      <div className='bg-white/80 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-30'>
        <div className='container mx-auto px-4 py-4'>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href='/'
                  className='text-slate-600 hover:text-blue-600 transition-colors'
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href='/tyres'
                  className='text-slate-600 hover:text-blue-600 transition-colors'
                >
                  Tyres
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href='/brands/michelin'
                  className='text-slate-600 hover:text-blue-600 transition-colors'
                >
                  {tyre?.productBrand?.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className='text-slate-900 font-medium'>
                  {tyre?.productBrand?.name} {tyre?.tyreWidth?.name}
                  {tyre?.tyreWidthType === 'IN MM'
                    ? `/${tyre?.aspectRatio?.name}`
                    : ''}
                  {tyre?.construction}
                  {tyre?.rimDiameter?.name}
                  {tyre?.plyRating?.name}
                  {tyre?.loadIndex?.name}
                  {tyre?.speedSymbol?.name}
                  {tyre?.productThreadPattern?.name}
                  {tyre?.unit}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className='container mx-auto px-4 py-8'>
        <div className='grid lg:grid-cols-5 gap-8 mb-12'>
          <div className='lg:col-span-2 space-y-6'>
            <div className='relative aspect-square bg-white rounded-2xl border border-slate-200/50 overflow-hidden shadow-lg group'>
              <div className='absolute inset-0 bg-linear-to-br from-blue-50/30 to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
              <Image
                src={mainImage || '/placeholder.svg'}
                alt={`${tyre?.productBrand?.name} Tyre`}
                width={500}
                height={500}
                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-700'
                priority
              />
              <button
                onClick={() =>
                  openImageModal(
                    tyre?.productImages?.map(getImageUrl) || [mainImage],
                    0
                  )
                }
                className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100'
              >
                <div className='bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300'>
                  <Eye className='h-6 w-6 text-slate-700' />
                </div>
              </button>
            </div>

            {tyre?.productImages?.length > 1 && (
              <div className='grid grid-cols-4 gap-3'>
                {tyre.productImages
                  .slice(0, 4)
                  .map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setMainImage(getImageUrl(image))}
                      className={`aspect-square bg-white rounded-xl border overflow-hidden transition-all duration-300 hover:shadow-lg ${
                        mainImage === getImageUrl(image)
                          ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <Image
                        src={getImageUrl(image) || '/placeholder.svg'}
                        alt={`Product ${index + 1}`}
                        width={120}
                        height={120}
                        className='w-full h-full object-cover hover:scale-110 transition-transform duration-300'
                      />
                    </button>
                  ))}
              </div>
            )}
          </div>

          <div className='lg:col-span-3 space-y-8'>
            <div>
              <div className='flex items-center gap-3 mb-4'>
                <Badge className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 text-sm font-semibold'>
                  {tyre?.productBrand?.name}
                </Badge>
                <Badge
                  variant='outline'
                  className='border-slate-300 text-slate-600 px-3 py-1'
                >
                  {tyre?.productType?.name}
                </Badge>
                <div className='flex items-center gap-1 text-sm text-amber-600'>
                  <Star className='h-4 w-4 fill-current' />
                  <span className='font-medium'>4.8</span>
                  <span className='text-slate-500'>(2.1k reviews)</span>
                </div>
              </div>

              <h1 className='text-3xl lg:text-4xl font-bold text-slate-900 mb-3 leading-tight'>
                {tyre?.tyreWidth?.name}
                {tyre?.tyreWidthType === 'IN MM'
                  ? `/${tyre?.aspectRatio?.name}`
                  : ''}
                {tyre?.construction}
                {tyre?.rimDiameter?.name}
                {tyre?.plyRating?.name}
                {tyre?.loadIndex?.name}
                {tyre?.speedSymbol?.name}
                {tyre?.productThreadPattern?.name}
                {tyre?.unit}
              </h1>
              <p className='text-lg text-slate-600 mb-6'>
                {tyre?.productThreadPattern?.name} • Premium Performance Tyre
              </p>
            </div>

            <div className='bg-linear-to-br from-white to-slate-50 p-8 rounded-2xl border border-slate-200/50 shadow-lg'>
              <div className='flex items-center justify-between mb-6'>
                <div>
                  <div className='text-sm text-slate-500 mb-2 flex items-center gap-2'>
                    <Award className='h-4 w-4' />
                    Best Price Guaranteed
                  </div>
                  {minPrice ? (
                    <div className='flex items-baseline gap-3'>
                      <span className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                        ₹{minPrice?.toLocaleString()}
                      </span>
                      <div className='text-sm text-slate-500'>
                        <div>
                          from {totalVendors} vendor
                          {totalVendors > 1 ? 's' : ''}
                        </div>
                        <div className='flex items-center gap-1 mt-1'>
                          <Users className='h-3 w-3' />
                          <span>Compare all options</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className='text-3xl font-semibold text-slate-500'>
                      Price not available
                    </span>
                  )}
                </div>
                <div className='text-right'>
                  <Badge className='bg-green-500 text-white px-4 py-2 text-sm font-semibold mb-2'>
                    Best Deal
                  </Badge>
                  <div className='text-xs text-slate-500'>Save up to 25%</div>
                </div>
              </div>

              <div className='flex gap-4'>
                <Button className='flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'>
                  <ShoppingCart className='h-5 w-5 mr-2' />
                  View All Vendors
                </Button>
                <Button
                  variant='outline'
                  size='icon'
                  className='shrink-0 rounded-xl border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all duration-300'
                >
                  <Heart className='h-5 w-5' />
                </Button>
                <Button
                  variant='outline'
                  size='icon'
                  className='shrink-0 rounded-xl border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all duration-300'
                >
                  <Share2 className='h-5 w-5' />
                </Button>
              </div>
            </div>

            <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
              <div className='bg-white p-4 rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow duration-300'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center'>
                    <Shield className='h-5 w-5 text-green-600' />
                  </div>
                  <div>
                    <div className='font-semibold text-slate-900 text-sm'>
                      Warranty
                    </div>
                    <div className='text-xs text-slate-500'>
                      {tyre?.warranty || '2 Years'}
                    </div>
                  </div>
                </div>
              </div>
              <div className='bg-white p-4 rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow duration-300'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                    <Truck className='h-5 w-5 text-blue-600' />
                  </div>
                  <div>
                    <div className='font-semibold text-slate-900 text-sm'>
                      Installation
                    </div>
                    <div className='text-xs text-slate-500'>Free Service</div>
                  </div>
                </div>
              </div>
              <div className='bg-white p-4 rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow duration-300'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center'>
                    <Zap className='h-5 w-5 text-yellow-600' />
                  </div>
                  <div>
                    <div className='font-semibold text-slate-900 text-sm'>
                      Load Index
                    </div>
                    <div className='text-xs text-slate-500'>
                      {tyre?.loadIndex?.name}
                    </div>
                  </div>
                </div>
              </div>
              <div className='bg-white p-4 rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow duration-300'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center'>
                    <BarChart4 className='h-5 w-5 text-purple-600' />
                  </div>
                  <div>
                    <div className='font-semibold text-slate-900 text-sm'>
                      Speed Rating
                    </div>
                    <div className='text-xs text-slate-500'>
                      {tyre?.speedSymbol?.name}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-slate-200/50'>
              <div className='flex items-center gap-4'>
                <div className='w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm'>
                  <MapPin className='h-6 w-6 text-blue-600' />
                </div>
                <div className='flex-1'>
                  <Input
                    placeholder='Enter your pincode to find nearby vendors'
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className='bg-white border-slate-200 rounded-xl'
                  />
                </div>
                <Button
                  onClick={handlePincodeCheck}
                  className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-semibold'
                >
                  Find Vendors
                </Button>
              </div>
              {pincodeChecked && (
                <div className='mt-4 flex items-center gap-2 text-sm'>
                  <div className='w-6 h-6 bg-green-100 rounded-full flex items-center justify-center'>
                    <Check className='h-4 w-4 text-green-600' />
                  </div>
                  <span className='text-green-700 font-medium'>
                    Found vendors near {pincode}
                  </span>
                  <Button
                    variant='link'
                    size='sm'
                    onClick={clearPincodeFilter}
                    className='p-0 ml-2 h-auto text-xs text-slate-500 hover:text-slate-700'
                  >
                    Clear filter
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Vendor Products Section */}
        {vendorProducts.length > 0 && (
          <div className='mb-8'>
            <div className='flex items-center justify-between mb-6'>
              <div>
                <h2 className='text-2xl font-bold'>
                  Available from {totalVendors} Vendor
                  {totalVendors > 1 ? 's' : ''}
                </h2>
                {pincodeChecked && (
                  <p className='text-sm text-muted-foreground mt-1'>
                    Showing {filteredVendors.length} vendor
                    {filteredVendors.length > 1 ? 's' : ''} near pincode{' '}
                    {pincode}
                  </p>
                )}
              </div>
            </div>

            {filteredVendors.length === 0 ? (
              <Card className='border-dashed'>
                <CardContent className='p-8 text-center'>
                  <div className='text-muted-foreground'>
                    No vendors found near pincode {pincode}
                  </div>
                  <Button
                    variant='outline'
                    onClick={clearPincodeFilter}
                    className='mt-3'
                  >
                    Show all vendors
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className='grid gap-3'>
                {filteredVendors.map((product: any, index: number) => (
                  <Card
                    key={product._id}
                    className='border hover:shadow-lg transition-all overflow-hidden'
                  >
                    <CardContent className='p-4'>
                      <div className='grid md:grid-cols-12 gap-4 items-center'>
                        {/* Product Images - Compact Thumbnails */}
                        <div className='md:col-span-2'>
                          <div className='flex gap-1'>
                            {product.tyre?.productImages
                              ?.slice(0, 2)
                              .map((image: any, imgIndex: number) => (
                                <div
                                  key={imgIndex}
                                  className='relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all group'
                                  onClick={() =>
                                    openImageModal(
                                      product.tyre?.productImages?.map(
                                        getImageUrl
                                      ) || [],
                                      imgIndex
                                    )
                                  }
                                >
                                  <Image
                                    src={
                                      getImageUrl(image?.image) ||
                                      '/placeholder.svg'
                                    }
                                    alt={`Tyre ${imgIndex + 1}`}
                                    fill
                                    className='object-cover group-hover:scale-110 transition-transform'
                                    sizes='48px'
                                  />
                                  <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center'>
                                    <Eye className='h-3 w-3 text-white opacity-0 group-hover:opacity-100 transition-opacity' />
                                  </div>
                                </div>
                              )) || (
                              <div className='w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center'>
                                <span className='text-xs text-gray-400'>
                                  No Image
                                </span>
                              </div>
                            )}
                            {product.tyre?.productImages &&
                              product.tyre.productImages.length > 2 && (
                                <div
                                  className='w-12 h-12 bg-linear-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center cursor-pointer hover:from-primary/20 hover:to-primary/30 transition-all'
                                  onClick={() =>
                                    openImageModal(
                                      product.tyre?.productImages?.map(
                                        getImageUrl
                                      ) || [],
                                      0
                                    )
                                  }
                                >
                                  <span className='text-xs font-semibold text-primary'>
                                    +{product.tyre.productImages.length - 2}
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>

                        {/* Vendor Info - Compact */}
                        <div className='md:col-span-4'>
                          <div className='flex items-center gap-3 mb-2'>
                            <div className='h-10 w-10 bg-linear-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center'>
                              <span className='text-sm font-semibold text-blue-600'>
                                {product.vendor?.name?.charAt(0) || 'V'}
                              </span>
                            </div>
                            <div>
                              <h3 className='font-semibold text-sm'>
                                {product.vendor?.name ||
                                  'Vendor Name Not Available'}
                              </h3>
                              {product.vendor?.vendor?.store_name && (
                                <p className='text-xs text-gray-600'>
                                  {product.vendor.vendor.store_name}
                                </p>
                              )}
                            </div>
                          </div>

                          {product.vendor?.vendor?.pickup_address?.[0] && (
                            <div className='flex items-center gap-1 text-xs text-gray-500 mb-2'>
                              <MapPin className='h-3 w-3' />
                              <span className='truncate'>
                                {product.vendor.vendor.pickup_address[0].city},
                                {product.vendor.vendor.pickup_address[0].state}{' '}
                                -{product.vendor.vendor.pickup_address[0].pin}
                              </span>
                            </div>
                          )}

                          <div className='flex items-center gap-2'>
                            <Badge
                              variant={
                                product.in_stock ? 'default' : 'destructive'
                              }
                              className='text-xs'
                            >
                              {product.in_stock ? 'In Stock' : 'Out of Stock'}
                            </Badge>
                            <span className='text-xs text-gray-500'>
                              Stock: {product.stock}
                            </span>
                          </div>
                        </div>

                        {/* Pricing - Compact */}
                        <div className='md:col-span-3 text-center'>
                          <div className='flex flex-col items-center gap-1'>
                            <div className='flex items-baseline gap-2'>
                              <span className='text-xl font-bold text-primary'>
                                ₹
                                {product.tyre_price_auto_deal?.toLocaleString()}
                              </span>
                              {product.tyre_price_rcp && (
                                <span className='text-xs text-gray-400 line-through'>
                                  ₹{product.tyre_price_rcp?.toLocaleString()}
                                </span>
                              )}
                            </div>
                            {product.tyre_price_rcp &&
                              product.tyre_price_auto_deal && (
                                <Badge className='bg-red-500 text-white text-xs'>
                                  {Math.round(
                                    ((product.tyre_price_rcp -
                                      product.tyre_price_auto_deal) /
                                      product.tyre_price_rcp) *
                                      100
                                  )}
                                  % OFF
                                </Badge>
                              )}
                          </div>
                        </div>

                        {/* Actions - Compact */}
                        <div className='md:col-span-3 flex flex-col gap-2'>
                          {isItemInCart(product) ? (
                            <div className='flex items-center gap-1'>
                              <Button
                                variant='outline'
                                size='sm'
                                className='px-2 cursor-pointer'
                                onClick={() =>
                                  handleQuantityChange(product, -1)
                                }
                              >
                                <Minus className='h-3 w-3' />
                              </Button>
                              <span className='flex-1 text-center text-sm font-medium bg-green-50 py-1 rounded border'>
                                {getItemQuantityInCart(product)} in cart
                              </span>
                              <Button
                                size='sm'
                                className='px-2 cursor-pointer'
                                onClick={() => handleQuantityChange(product, 1)}
                                disabled={!product.in_stock}
                              >
                                <Plus className='h-3 w-3' />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              className='w-full cursor-pointer'
                              size='sm'
                              disabled={!product.in_stock}
                              onClick={() => handleAddToCart(product, 1)}
                            >
                              {product.in_stock ? (
                                <>
                                  <ShoppingCart className='h-3 w-3 mr-1' />
                                  Add to Cart
                                </>
                              ) : (
                                'Out of Stock'
                              )}
                            </Button>
                          )}
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() =>
                              openImageModal(
                                product.tyre?.productImages?.map(getImageUrl) ||
                                  [],
                                0
                              )
                            }
                            className='w-full cursor-pointer'
                            title='View All Images'
                          >
                            <Eye className='h-4 w-4 mr-1' />
                            <span className='text-xs'>View All</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        <div className='mb-12'>
          <div className='grid lg:grid-cols-2 gap-8'>
            <Card className='border-slate-200/50 shadow-lg rounded-2xl overflow-hidden'>
              <CardHeader className='bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/50'>
                <CardTitle className='text-xl font-bold text-slate-900 flex items-center gap-2'>
                  <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
                    <Eye className='h-4 w-4 text-blue-600' />
                  </div>
                  Product Description
                </CardTitle>
              </CardHeader>
              <CardContent className='p-6'>
                <div
                  className='text-slate-700 leading-relaxed prose prose-slate max-w-none'
                  dangerouslySetInnerHTML={{
                    __html:
                      tyre?.productDescription ||
                      'Experience premium performance and reliability with this expertly engineered tyre designed for optimal safety and comfort.',
                  }}
                />
              </CardContent>
            </Card>

            <Card className='border-slate-200/50 shadow-lg rounded-2xl overflow-hidden'>
              <CardHeader className='bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/50'>
                <CardTitle className='text-xl font-bold text-slate-900 flex items-center gap-2'>
                  <div className='w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center'>
                    <BarChart4 className='h-4 w-4 text-purple-600' />
                  </div>
                  Technical Specifications
                </CardTitle>
              </CardHeader>
              <CardContent className='p-6'>
                <Table>
                  <TableBody>
                    <TableRow className='border-slate-200/50'>
                      <TableCell className='font-semibold text-slate-900 py-3'>
                        Brand
                      </TableCell>
                      <TableCell className='text-slate-700 py-3'>
                        {tyre?.productBrand?.name}
                      </TableCell>
                    </TableRow>
                    <TableRow className='border-slate-200/50'>
                      <TableCell className='font-semibold text-slate-900 py-3'>
                        Size
                      </TableCell>
                      <TableCell className='text-slate-700 py-3'>
                        {tyre?.tyreWidth?.name}/{tyre?.aspectRatio?.name}
                        {tyre?.construction}
                        {tyre?.rimDiameter?.name}
                      </TableCell>
                    </TableRow>
                    <TableRow className='border-slate-200/50'>
                      <TableCell className='font-semibold text-slate-900 py-3'>
                        Type
                      </TableCell>
                      <TableCell className='text-slate-700 py-3'>
                        {tyre?.productType?.name}
                      </TableCell>
                    </TableRow>
                    <TableRow className='border-slate-200/50'>
                      <TableCell className='font-semibold text-slate-900 py-3'>
                        Load Index
                      </TableCell>
                      <TableCell className='text-slate-700 py-3'>
                        {tyre?.loadIndex?.name}
                      </TableCell>
                    </TableRow>
                    <TableRow className='border-slate-200/50'>
                      <TableCell className='font-semibold text-slate-900 py-3'>
                        Speed Symbol
                      </TableCell>
                      <TableCell className='text-slate-700 py-3'>
                        {tyre?.speedSymbol?.name}
                      </TableCell>
                    </TableRow>
                    <TableRow className='border-slate-200/50'>
                      <TableCell className='font-semibold text-slate-900 py-3'>
                        Pattern
                      </TableCell>
                      <TableCell className='text-slate-700 py-3'>
                        {tyre?.productThreadPattern?.name}
                      </TableCell>
                    </TableRow>
                    <TableRow className='border-slate-200/50'>
                      <TableCell className='font-semibold text-slate-900 py-3'>
                        Warranty
                      </TableCell>
                      <TableCell className='text-slate-700 py-3'>
                        {tyre?.warranty}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Enhanced Image Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className='max-w-4xl w-full p-0 bg-black/95 border-0'>
          <DialogHeader className='absolute top-4 left-4 z-50'>
            <DialogTitle className='text-white text-lg'>
              Tyre Images ({currentModalImage + 1} of {modalImages.length})
            </DialogTitle>
          </DialogHeader>
          <div className='relative h-[80vh] flex items-center justify-center'>
            {modalImages.length > 0 && (
              <>
                <div className='relative w-full h-full flex items-center justify-center'>
                  <Image
                    src={modalImages[currentModalImage] || '/placeholder.svg'}
                    alt={`Product Image ${currentModalImage + 1}`}
                    width={800}
                    height={800}
                    className='max-w-full max-h-full object-contain'
                  />
                </div>

                {modalImages.length > 1 && (
                  <>
                    <button
                      onClick={prevModalImage}
                      className='absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-xl transition-all hover:scale-110'
                    >
                      <ChevronUp className='h-6 w-6 rotate-[-90deg] text-gray-800' />
                    </button>
                    <button
                      onClick={nextModalImage}
                      className='absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-xl transition-all hover:scale-110'
                    >
                      <ChevronUp className='h-6 w-6 rotate-90 text-gray-800' />
                    </button>
                  </>
                )}

                {/* Enhanced Image indicators */}
                {modalImages.length > 1 && (
                  <div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 rounded-full px-4 py-2'>
                    {modalImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentModalImage(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === currentModalImage
                            ? 'bg-white scale-125'
                            : 'bg-white/50 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Close button */}
                <button
                  onClick={() => setIsImageModalOpen(false)}
                  className='absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 shadow-xl transition-all hover:scale-110'
                >
                  <X className='h-5 w-5 text-gray-800' />
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
