'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Star,
  ShoppingCart,
  Filter,
  ChevronDown,
  Check,
  Phone,
  Mail,
  Clock,
  Truck,
  Shield,
  DollarSign,
  Store,
  Search,
  SlidersHorizontal,
  Plus,
  Minus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCart } from '@/hooks/useCart';

interface ProductSpec {
  _id: string;
  productImages?: string[];
  productDescription?: string;
  tyreWidth?: Array<{ name: string; _id: string }>;
  rimDiameter?: Array<{ name: string; _id: string }>;
  alloyDiameterInches?: string;
  alloyWidth?: Array<{ name: string; _id: string }>;
  serviceName?: string;
  serviceDescription?: string;
  [key: string]: any;
}

interface Vendor {
  _id: string;
  store_name: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  rating?: number;
  service_areas?: Array<{ pincode: string; area: string }>;
  delivery_time?: string;
}

interface ProductWithVendor {
  _id: string;
  product_name: string;
  product_description: string;
  product_images: string[];
  auto_deal_price: number;
  mrp_price: number;
  rcp_price: number;
  stock_quantity: number;
  in_stock: boolean;
  vendor: Vendor;
  brand: {
    _id: string;
    name: string;
  };
  productSpec: ProductSpec;
}

interface SingleProductPageProps {
  productType: 'TYRE' | 'ALLOY_WHEEL' | 'SERVICE';
  specId: string;
}

export default function SingleProductPage({
  productType,
  specId,
}: SingleProductPageProps) {
  const [products, setProducts] = useState<ProductWithVendor[]>([]);
  const [cheapestProduct, setCheapestProduct] =
    useState<ProductWithVendor | null>(null);
  const [productSpec, setProductSpec] = useState<ProductSpec | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    pincode: '',
    sortBy: 'price_low',
    priceMin: '',
    priceMax: '',
    search: '',
  });
  const [showFilters, setShowFilters] = useState(true); // Set to true by default
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [availableInArea, setAvailableInArea] = useState<ProductWithVendor[]>(
    []
  );
  const router = useRouter();

  // Cart functionality
  const {
    addToCart,
    isInCart,
    getCartItemQuantity,
    updateQuantityByProductVendor,
  } = useCart();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: '1',
        limit: '20',
        sortBy: filters.sortBy,
        ...(filters.search && { search: filters.search }),
        ...(filters.priceMin && { priceMin: filters.priceMin }),
        ...(filters.priceMax && { priceMax: filters.priceMax }),
        ...(filters.pincode && pincodeChecked && { pincode: filters.pincode }),
      });

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/products/website/single-product/${productType}/${specId}?${queryParams}`;

      console.log('Fetching from API:', apiUrl);

      const response = await fetch(apiUrl);

      const data = await response.json();

      console.log('Single Product API Response:', {
        productType,
        specId,
        productsCount: data.data?.products?.length || 0,
        vendors: data.data?.products?.map((p: any) => ({
          productId: p._id,
          vendorName: p.vendor?.store_name,
          vendorId: p.vendor?._id,
          price: p.auto_deal_price,
        })),
        fullResponse: data,
      });

      if (data.success) {
        setProducts(data.data.products);
        setCheapestProduct(data.data.cheapestProduct);
        setProductSpec(data.data.productSpec);

        // Filter products available in pincode area
        if (filters.pincode && pincodeChecked) {
          setAvailableInArea(data.data.products);
        }
      } else {
        setError(data.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [productType, specId, filters, pincodeChecked]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handlePincodeCheck = () => {
    if (filters.pincode.trim()) {
      setPincodeChecked(true);
    }
  };

  const clearPincodeFilter = () => {
    setPincodeChecked(false);
    setAvailableInArea([]);
    setFilters((prev) => ({ ...prev, pincode: '' }));
  };

  const handleAddToCart = (product: ProductWithVendor) => {
    const quantity = 1; // Default quantity when adding to cart

    // Transform product data to match the new cart structure
    const vendorProduct = {
      _id: product._id,
      product_name: product.product_name,
      auto_deal_price: product.auto_deal_price,
      mrp_price: product.mrp_price,
      in_stock: product.in_stock,
      stock_quantity: product.stock_quantity,
      vendor: product.vendor,
      brand: product.brand,
      productSpec: productType === 'TYRE' ? productSpec : undefined,
      alloy_wheel:
        productType === 'ALLOY_WHEEL'
          ? {
            wheel_name: productSpec?.serviceName || product.product_name,
            diameter:
              productSpec?.alloyDiameterInches?.name ||
              productSpec?.alloyDiameterInches,
            width: productSpec?.alloyWidth?.[0]?.name,
            pcd: productSpec?.alloyPcd?.[0]?.name || '',
            offset: productSpec?.alloyOffset?.[0]?.name || '',
            finish: productSpec?.alloyFinish?.[0]?.name || '',
          }
          : undefined,
      product_images: productSpec?.productImages || [],
      service:
        productType === 'SERVICE'
          ? {
            serviceName: productSpec?.serviceName,
            serviceDescription: productSpec?.serviceDescription,
            serviceType: '', // Add if available
            estimatedTime: '', // Add if available
            locationType: '', // Add if available
            serviceImages: productSpec?.productImages || [],
          }
          : undefined,
    };

    addToCart({
      productId: product._id, // Use the product ID consistently
      vendorId: product.vendor._id,
      productType: productType,
      quantity,
      price: product.auto_deal_price,
      originalPrice: product.mrp_price,
      vendorProduct,
    });
  };

  const getProductName = () => {
    if (!productSpec) return 'Loading...';

    switch (productType) {
      case 'TYRE':
        return (
          <>
            {productSpec.productBrand?.name}{' '}
            <span className='font-medium text-gray-600'>
              {productSpec.tyreWidth?.[0]?.name || productSpec.tyreWidth?.name}
              {productSpec.tyreWidthType === 'IN MM'
                ? (productSpec.aspectRatio?.[0]?.name || productSpec.aspectRatio?.name ? `/${productSpec.aspectRatio?.[0]?.name || productSpec.aspectRatio?.name}` : '')
                : ''}
              {productSpec.construction}
              {productSpec.rimDiameter?.[0]?.name || productSpec.rimDiameter?.name}
              {' '}
              {productSpec.plyRating?.[0]?.name || productSpec.plyRating?.name}
              {' '}
              {productSpec.loadIndex?.[0]?.name || productSpec.loadIndex?.name}
              {' '}
              {productSpec.speedSymbol?.[0]?.name || productSpec.speedSymbol?.name}
              {' '}
              {productSpec.productThreadPattern?.[0]?.name || productSpec.productThreadPattern?.name}
              {' '}
              {productSpec.unit}
            </span>
          </>
        );
      case 'ALLOY_WHEEL':
        return `${productSpec.alloyBrand?.name || 'Unknown Brand'} ${productSpec.alloyDiameterInches?.name || ''
          }X${productSpec.alloyWidth?.[0]?.name || ''} ${productSpec.alloyFinish?.[0]?.name || ''
          }`.trim();
      case 'SERVICE':
        return productSpec.serviceName || 'Service';
      default:
        return 'Product';
    }
  };

  const getProductNameString = (product: any) => {
    if (!productSpec) return 'Product';

    switch (productType) {
        const brand = product.productSpec?.productBrand?.name || product.productSpec?.productBrand?.[0]?.name || '';
        const spec = product.productSpec;
        const width = spec.tyreWidth?.[0]?.name || spec.tyreWidth?.name || '';
        const ratio = spec.aspectRatio?.[0]?.name || spec.aspectRatio?.name || '';
        const diameter = spec.rimDiameter?.[0]?.name || spec.rimDiameter?.name || '';
        const size = `${width}${spec.tyreWidthType === 'IN MM' && ratio ? `/${ratio}` : ''}${spec.construction || ''}${diameter}`;
        
        const specs = [
          size,
          spec.plyRating?.[0]?.name || spec.plyRating?.name,
          spec.loadIndex?.[0]?.name || spec.loadIndex?.name,
          spec.speedSymbol?.[0]?.name || spec.speedSymbol?.name,
          spec.productThreadPattern?.[0]?.name || spec.productThreadPattern?.name,
          spec.unit
        ].filter(Boolean).join(' ').trim();
        return `${brand} ${specs}`.trim();
      case 'ALLOY_WHEEL':
        return `${productSpec.alloyBrand?.name || 'Unknown Brand'} ${productSpec.alloyDiameterInches?.name || ''
          }X${productSpec.alloyWidth?.[0]?.name || ''} ${productSpec.alloyFinish?.[0]?.name || ''
          }`.trim();
      case 'SERVICE':
        return productSpec.serviceName || 'Service';
      default:
        return 'Product';
    }
  };

  const getProductDescription = () => {
    if (!productSpec) return '';
    return (
      productSpec.productDescription || productSpec.serviceDescription || ''
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getDiscountPercentage = (mrp: number, deal: number) => {
    return Math.round(((mrp - deal) / mrp) * 100);
  };

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='animate-pulse space-y-4'>
          <div className='h-8 bg-gray-200 rounded w-1/3'></div>
          <div className='h-32 bg-gray-200 rounded'></div>
          <div className='space-y-3'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='h-24 bg-gray-200 rounded'></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <Alert className='border-red-200 bg-red-50'>
          <AlertDescription className='text-red-700'>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Product Header */}
      <div className='mb-8'>
        <nav className='text-sm text-gray-600 mb-4'>
          <span
            className='hover:text-blue-600 cursor-pointer'
            onClick={() => router.back()}
          >
            Products
          </span>
          <span className='mx-2'>/</span>
          <span className='text-gray-900'>{getProductName()}</span>
        </nav>

        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Product Image Gallery */}
          <div className='lg:w-1/3'>
            <ProductImageGallery images={productSpec?.productImages || []} serviceImage={productSpec?.serviceImage} />
          </div>

          {/* Product Info */}
          <div className='lg:w-2/3'>
            <h1 className='text-3xl font-bold text-gray-900 mb-4'>
              {productType === 'TYRE' && productSpec ? (
                <>
                  {productSpec.productBrand?.name}{' '}
                  <span className='font-medium text-gray-600'>
                    {productSpec.tyreWidth?.[0]?.name || productSpec.tyreWidth?.name}
                    {productSpec.tyreWidthType === 'IN MM'
                      ? (productSpec.aspectRatio?.[0]?.name || productSpec.aspectRatio?.name ? `/${productSpec.aspectRatio?.[0]?.name || productSpec.aspectRatio?.name}` : '')
                      : ''}
                    {productSpec.construction}
                    {productSpec.rimDiameter?.[0]?.name || productSpec.rimDiameter?.name}
                    {' '}
                    {productSpec.plyRating?.[0]?.name || productSpec.plyRating?.name}
                    {' '}
                    {productSpec.loadIndex?.[0]?.name || productSpec.loadIndex?.name}
                    {' '}
                    {productSpec.speedSymbol?.[0]?.name || productSpec.speedSymbol?.name}
                    {' '}
                    {productSpec.productThreadPattern?.[0]?.name || productSpec.productThreadPattern?.name}
                    {' '}
                    {productSpec.unit}
                  </span>
                </>
              ) : (
                getProductName()
              )}
            </h1>

            {getProductDescription() && (
              <div
                className='text-gray-600 mb-6'
                dangerouslySetInnerHTML={{ __html: getProductDescription() }}
              />
            )}

            {/* Cheapest Option Highlight */}
            {cheapestProduct && (
              <Card className='border-green-200 bg-green-50 mb-6'>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-lg text-green-800 flex items-center gap-2'>
                    <DollarSign className='h-5 w-5' />
                    Best Price Available
                  </CardTitle>
                </CardHeader>
                <CardContent className='pt-0'>
                  <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                    <div>
                      <div className='flex items-center gap-2 mb-2'>
                        <span className='text-2xl font-bold text-green-800'>
                          {formatPrice(cheapestProduct.auto_deal_price)}
                        </span>
                        {cheapestProduct.mrp_price >
                          cheapestProduct.auto_deal_price && (
                            <>
                              <span className='text-gray-500 line-through'>
                                {formatPrice(cheapestProduct.mrp_price)}
                              </span>
                              <Badge variant='destructive'>
                                {getDiscountPercentage(
                                  cheapestProduct.mrp_price,
                                  cheapestProduct.auto_deal_price
                                )}
                                % OFF
                              </Badge>
                            </>
                          )}
                      </div>
                      <p className='text-sm text-gray-600'>
                        From{' '}
                        <span className='font-semibold'>
                          {cheapestProduct.vendor.store_name}
                        </span>
                      </p>
                      
                      {/* Cart UI - Shifting quantity counter here below vendor info and above price */}
                      <div className='mt-4 flex flex-col gap-2'>
                        {/* Quantity Counter (Always visible or only if in cart? User says 'shift the quantity counter') */}
                        {/* If we want it always visible so they can select quantity BEFORE adding: */}
                        <div className='flex items-center gap-4'>
                          <span className='text-sm font-semibold text-[#14213d]'>Quantity:</span>
                          <div className='flex items-center bg-gray-50 border border-gray-200 rounded-lg p-1'>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='h-8 w-8 p-0 hover:bg-[#14213d]/10 rounded-md'
                              onClick={() => {
                                if (isInCart(cheapestProduct._id, cheapestProduct.vendor._id)) {
                                  updateQuantityByProductVendor(cheapestProduct._id, cheapestProduct.vendor._id, -1);
                                }
                              }}
                              disabled={
                                !isInCart(cheapestProduct._id, cheapestProduct.vendor._id) ||
                                getCartItemQuantity(cheapestProduct._id, cheapestProduct.vendor._id) < 1
                              }
                            >
                              <Minus className='h-4 w-4 text-[#14213d]' />
                            </Button>
                            <div className='px-4 text-center min-w-[40px]'>
                              <span className='font-bold text-[#14213d]'>
                                {getCartItemQuantity(cheapestProduct._id, cheapestProduct.vendor._id) || 1}
                              </span>
                            </div>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='h-8 w-8 p-0 hover:bg-[#14213d]/10 rounded-md'
                              onClick={() => {
                                if (isInCart(cheapestProduct._id, cheapestProduct.vendor._id)) {
                                  updateQuantityByProductVendor(cheapestProduct._id, cheapestProduct.vendor._id, 1);
                                } else {
                                  handleAddToCart(cheapestProduct);
                                }
                              }}
                              disabled={
                                cheapestProduct.in_stock === false ||
                                (isInCart(cheapestProduct._id, cheapestProduct.vendor._id) && 
                                 getCartItemQuantity(cheapestProduct._id, cheapestProduct.vendor._id) >= cheapestProduct.stock_quantity)
                              }
                            >
                              <Plus className='h-4 w-4 text-[#14213d]' />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='flex flex-col gap-3 mt-4'>
                      {isInCart(
                        cheapestProduct._id,
                        cheapestProduct.vendor._id
                      ) ? (
                        <Link href='/cart' className='w-full'>
                          <Button
                            variant='default'
                            className='w-full bg-[#14213d] hover:bg-[#14213d]/90 text-white font-semibold py-6 rounded-xl'
                          >
                            <Check className='h-5 w-5 mr-2' />
                            View in Cart
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          onClick={() => handleAddToCart(cheapestProduct)}
                          className='w-full bg-[#fca311] hover:bg-[#fca311]/90 text-[#14213d] font-bold py-6 rounded-xl text-lg'
                          disabled={!cheapestProduct.in_stock}
                        >
                          <ShoppingCart className='h-5 w-5 mr-2' />
                          Add to Cart
                        </Button>
                      )}

                      {/* Enquire Now Button */}
                      <Button
                        variant="outline"
                        className="w-full border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-bold py-6 rounded-xl transition-all"
                        onClick={() => {
                          const cleanName = getProductNameString();
                          const vendorName = cheapestProduct.vendor.store_name || 'Autodeal4U Vendor';
                          
                          const message = `*Inquiry from Autodeal4U website* 👋\n\nHello, I'm interested in the following item:\n\n*Product:* ${cleanName}\n*Vendor:* ${vendorName}\n*Price:* ${formatPrice(cheapestProduct.auto_deal_price)}\n\nCan you please provide more details about this?\n\n*Link:* ${window.location.href}`;
                          
                          window.open(`https://wa.me/919205227614?text=${encodeURIComponent(message)}`, '_blank');
                        }}
                      >
                        <Phone className="h-5 w-5 mr-2" />
                        Enquire Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Specifications */}
            <Card className='mb-6'>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  {productType === 'TYRE' && productSpec && (
                    <>
                      <div>
                        <span className='font-semibold'>Width:</span>{' '}
                        {productSpec.tyreWidth?.[0]?.name}mm
                      </div>
                      <div>
                        <span className='font-semibold'>Rim Diameter:</span>{' '}
                        {productSpec.rimDiameter?.[0]?.name}
                      </div>
                    </>
                  )}
                  {productType === 'ALLOY_WHEEL' && productSpec && (
                    <>
                      <div>
                        <span className='font-semibold'>Diameter:</span>{' '}
                        {productSpec.alloyDiameterInches}
                      </div>
                      <div>
                        <span className='font-semibold'>Width:</span>{' '}
                        {productSpec.alloyWidth?.[0]?.name}
                      </div>
                    </>
                  )}
                  {productType === 'SERVICE' && productSpec && (
                    <div className='col-span-2'>
                      <span className='font-semibold'>Service Type:</span>{' '}
                      {productSpec.serviceType || 'Standard Service'}
                    </div>
                  )}
                  <div className='col-span-2'>
                    <span className='font-semibold'>Available from:</span>{' '}
                    {products.length} vendor{products.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className='mb-6'>
        <CardHeader>
          <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <Store className='h-5 w-5' />
              All Available Vendors ({products.length})
              {showFilters && (
                <Badge variant='outline' className='ml-2 text-xs'>
                  Filters Active
                </Badge>
              )}
            </CardTitle>
            <Button
              variant={showFilters ? 'default' : 'outline'}
              onClick={() => setShowFilters(!showFilters)}
              className='flex items-center gap-2'
            >
              <SlidersHorizontal className='h-4 w-4' />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
        </CardHeader>

        {showFilters && (
          <CardContent className='pt-0'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
              {/* Search */}
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                <Input
                  placeholder='Search vendors...'
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className='pl-10'
                />
              </div>

              {/* Sort */}
              <Select
                value={filters.sortBy}
                onValueChange={(value) => handleFilterChange('sortBy', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Sort by' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='price_low'>Price: Low to High</SelectItem>
                  <SelectItem value='price_high'>Price: High to Low</SelectItem>
                  <SelectItem value='rating'>Rating</SelectItem>
                  <SelectItem value='newest'>Newest</SelectItem>
                </SelectContent>
              </Select>

              {/* Price Range */}
              <div className='flex gap-2'>
                <Input
                  placeholder='Min price'
                  value={filters.priceMin}
                  onChange={(e) =>
                    handleFilterChange('priceMin', e.target.value)
                  }
                  type='number'
                />
                <Input
                  placeholder='Max price'
                  value={filters.priceMax}
                  onChange={(e) =>
                    handleFilterChange('priceMax', e.target.value)
                  }
                  type='number'
                />
              </div>

              {/* Pincode Check */}
              <div className='flex gap-2'>
                <Input
                  placeholder='Enter pincode'
                  value={filters.pincode}
                  onChange={(e) =>
                    handleFilterChange('pincode', e.target.value)
                  }
                  className='flex-1'
                />
                <Button
                  onClick={handlePincodeCheck}
                  variant={pincodeChecked ? 'default' : 'outline'}
                  disabled={!filters.pincode.trim()}
                >
                  <MapPin className='h-4 w-4 mr-1' />
                  Check
                </Button>
              </div>
            </div>

            {pincodeChecked && (
              <Alert className='border-blue-200 bg-blue-50'>
                <MapPin className='h-4 w-4' />
                <AlertDescription className='flex items-center justify-between'>
                  <span>
                    Showing vendors available in pincode:{' '}
                    <strong>{filters.pincode}</strong>
                  </span>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={clearPincodeFilter}
                  >
                    Clear
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        )}
      </Card>

      {/* Vendor Listings */}
      <div className='space-y-4'>
        {products.length === 0 ? (
          <Card>
            <CardContent className='text-center py-8'>
              <p className='text-gray-500'>
                No vendors found matching your criteria.
              </p>
            </CardContent>
          </Card>
        ) : (
          products.map((product) => (
            <Card
              key={product._id}
              className='hover:shadow-lg transition-all duration-300 border-l-4 border-l-[#fca311]'
            >
              <CardContent className='p-6'>
                <div className='flex flex-col lg:flex-row gap-6'>
                  {/* Vendor Info */}
                  <div className='lg:w-1/3'>
                    <div className='flex items-start gap-3 mb-4'>
                      <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                        <Store className='h-6 w-6 text-blue-600' />
                      </div>
                      <div>
                        <h3 className='font-semibold text-lg'>
                          {product.vendor.store_name}
                        </h3>
                        <p className='text-gray-600 text-sm'>
                          {product.vendor.name}
                        </p>
                        {product.vendor.rating && (
                          <div className='flex items-center gap-1 mt-1'>
                            <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                            <span className='text-sm font-medium'>
                              {product.vendor.rating}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact Info & Location */}
                    <div className='space-y-3 text-sm'>
                      {/* Enhanced Address Display */}
                      <div className='bg-gray-50 p-3 rounded-lg'>
                        <div className='flex items-start gap-2 mb-2'>
                          <MapPin className='h-4 w-4 text-[#fca311] mt-0.5 flex-shrink-0' />
                          <div>
                            <p className='font-semibold text-gray-800 mb-1'>
                              Store Location
                            </p>
                            {product.vendor.address ? (
                              <div className='text-gray-600 space-y-1'>
                                <p>{product.vendor.address}</p>
                                <p>
                                  {product.vendor.city &&
                                    `${product.vendor.city}, `}
                                  {product.vendor.state}
                                  {product.vendor.pincode &&
                                    ` - ${product.vendor.pincode}`}
                                </p>
                              </div>
                            ) : (
                              <p className='text-gray-600'>
                                {product.vendor.city &&
                                  `${product.vendor.city}, `}
                                {product.vendor.state}
                                {product.vendor.pincode &&
                                  ` - ${product.vendor.pincode}`}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className='space-y-2'>

                        {product.vendor.email && (
                          <div className='flex items-center gap-2 text-gray-600'>
                            <Mail className='h-4 w-4 text-blue-600' />
                            <span>{product.vendor.email}</span>
                          </div>
                        )}
                      </div>

                      {/* Service Areas */}
                      {product.vendor.service_areas &&
                        product.vendor.service_areas.length > 0 && (
                          <div className='bg-[#fca311]/10 p-3 rounded-lg'>
                            <div className='flex items-start gap-2'>
                              <Truck className='h-4 w-4 text-[#fca311] mt-0.5 flex-shrink-0' />
                              <div>
                                <p className='font-semibold text-[#14213d] mb-1'>
                                  Service Areas
                                </p>
                                <div className='flex flex-wrap gap-1'>
                                  {product.vendor.service_areas
                                    .slice(0, 3)
                                    .map((area, index) => (
                                      <Badge
                                        key={index}
                                        variant='outline'
                                        className='text-xs text-[#14213d] border-[#fca311]/30'
                                      >
                                        {area.pincode} - {area.area}
                                      </Badge>
                                    ))}
                                  {product.vendor.service_areas.length > 3 && (
                                    <Badge
                                      variant='outline'
                                      className='text-xs text-[#14213d] border-[#fca311]/30'
                                    >
                                      +{product.vendor.service_areas.length - 3}{' '}
                                      more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                      {/* Delivery Information */}
                      {product.vendor.delivery_time && (
                        <div className='flex items-center gap-2 text-gray-600 bg-yellow-50 p-2 rounded-lg'>
                          <Clock className='h-4 w-4 text-yellow-600' />
                          <span className='text-sm'>
                            <strong>Delivery:</strong>{' '}
                            {product.vendor.delivery_time}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className='lg:w-2/3'>
                    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                      <div>
                        <div className='flex items-center gap-3 mb-2'>
                          <span className='text-2xl font-bold text-gray-900'>
                            {formatPrice(product.auto_deal_price)}
                          </span>
                          {product.mrp_price > product.auto_deal_price && (
                            <>
                              <span className='text-gray-500 line-through'>
                                {formatPrice(product.mrp_price)}
                              </span>
                              <Badge variant='destructive'>
                                {getDiscountPercentage(
                                  product.mrp_price,
                                  product.auto_deal_price
                                )}
                                % OFF
                              </Badge>
                            </>
                          )}
                        </div>

                        <div className='flex items-center gap-4 text-sm text-gray-600'>
                          <span>
                            Brand: <strong>{product.brand.name}</strong>
                          </span>
                          <span>
                            Stock: <strong>{product.stock_quantity}</strong>
                          </span>
                          {product.in_stock ? (
                            <Badge
                              variant='outline'
                              className='text-green-600 border-green-200'
                            >
                              <Check className='h-3 w-3 mr-1' />
                              In Stock
                            </Badge>
                          ) : (
                            <Badge
                              variant='outline'
                              className='text-red-600 border-red-200'
                            >
                              Out of Stock
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className='flex flex-col sm:flex-row gap-3'>
                        {/* Cart UI for individual vendors */}
                        {isInCart(product._id, product.vendor._id) ? (
                          <div className='flex flex-col gap-2'>
                            <div className='flex items-center bg-white border-2 border-[#fca311] rounded-lg p-1'>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='h-8 w-8 p-0 hover:bg-[#fca311]/10 rounded-md'
                                onClick={() =>
                                  updateQuantityByProductVendor(
                                    product._id,
                                    product.vendor._id,
                                    -1
                                  )
                                }
                                disabled={
                                  getCartItemQuantity(
                                    product._id,
                                    product.vendor._id
                                  ) <= 1
                                }
                              >
                                <Minus className='h-4 w-4 text-[#fca311]' />
                              </Button>
                              <div className='px-4 py-1 bg-[#fca311]/10 mx-1 rounded-md min-w-[60px] text-center'>
                                <span className='font-bold text-[#14213d] text-lg'>
                                  {getCartItemQuantity(
                                    product._id,
                                    product.vendor._id
                                  )}
                                </span>
                              </div>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='h-8 w-8 p-0 hover:bg-[#fca311]/10 rounded-md'
                                onClick={() =>
                                  updateQuantityByProductVendor(
                                    product._id,
                                    product.vendor._id,
                                    1
                                  )
                                }
                                disabled={
                                  !product.in_stock ||
                                  getCartItemQuantity(
                                    product._id,
                                    product.vendor._id
                                  ) >= product.stock_quantity
                                }
                              >
                                <Plus className='h-4 w-4 text-[#fca311]' />
                              </Button>
                            </div>
                            <div className='flex gap-2'>
                              <Button
                                variant='outline'
                                className='flex-1'
                                size='sm'
                              >
                                <Phone className='h-4 w-4 mr-2' />
                                Call
                              </Button>
                              <Button
                                variant='default'
                                className='bg-[#fca311] hover:bg-[#fca311]/90 text-[#14213d] flex-1'
                                size='sm'
                              >
                                <Check className='h-4 w-4 mr-2' />
                                In Cart
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className='flex gap-2'>
                            <Link href="/contact-us">
                              <Button variant='outline' className='flex-1'>
                                <Mail className='h-4 w-4 mr-2' />
                                Help
                              </Button>
                            </Link>
                            <Button
                              onClick={() => handleAddToCart(product)}
                              disabled={!product.in_stock}
                              className='bg-[#fca311] hover:bg-[#fca311]/90 text-[#14213d] flex-1 font-semibold cursor-pointer'
                            >
                              <ShoppingCart className='h-4 w-4 mr-2' />
                              Add to Cart
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function ProductImageGallery({ images, serviceImage }: { images: string[]; serviceImage?: string }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  const allImages = [...(images.length > 0 ? images : (serviceImage ? [serviceImage] : []))]
    .filter(img => !img.includes('placeholder.com'));

  const getImageUrl = (path: string) => {
    const cleanPath = path.replace(/\\/g, '/');
    return cleanPath.startsWith('http') ? cleanPath : `${apiUrl}${cleanPath}`;
  };

  const [imgError, setImgError] = useState(false);

  if (allImages.length === 0 || imgError) {
    return (
      <div className='aspect-square bg-gray-100 rounded-lg flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center'>
            <svg className='w-12 h-12 text-gray-400' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z' />
            </svg>
          </div>
          <span className='text-gray-400 text-sm'>No Image</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Main Image */}
      <div className='aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3'>
        <img
          src={getImageUrl(allImages[selectedIndex])}
          alt={`Product image ${selectedIndex + 1}`}
          className='w-full h-full object-cover'
          onError={() => setImgError(true)}
        />
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className='flex gap-2 overflow-x-auto'>
          {allImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${index === selectedIndex
                ? 'border-[#fca311] shadow-md'
                : 'border-gray-200 hover:border-gray-400'
                }`}
            >
              <img
                src={getImageUrl(img)}
                alt={`Thumbnail ${index + 1}`}
                className='w-full h-full object-cover'
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
