'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Star,
  ShoppingCart,
  Filter,
  ChevronDown,
  Check,
  Store,
  Truck,
  Clock,
  DollarSign,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

interface Vendor {
  productId: string;
  vendorId: string;
  vendorInfo: {
    _id: string;
    name: string;
    email: string;
    store_name?: string;
    vendor?: {
      pickup_address?: Array<{
        pin: string;
        city: string;
        state: string;
      }>;
    };
  };
  brandInfo: {
    _id: string;
    name: string;
  };
  prices: {
    cost_price: number;
    mrp_price: number;
    rcp_price: number;
    auto_deal_price: number;
  };
  stock: number;
  in_stock: boolean;
  product_images?: string[];
  createdAt: string;
}

interface ProductGroup {
  _id: any;
  productSpec: any[];
  vendors: Vendor[];
  minPrice: number;
  maxPrice: number;
  vendorCount: number;
}

interface MultiVendorProductListingProps {
  productType: 'TYRE' | 'ALLOY_WHEEL' | 'SERVICE';
  searchParams?: any;
}

export default function MultiVendorProductListing({
  productType,
  searchParams = {},
}: MultiVendorProductListingProps) {
  const [products, setProducts] = useState<ProductGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    pincode: '',
    sortBy: 'price_low',
    priceMin: '',
    priceMax: '',
    search: '',
  });
  const [selectedVendors, setSelectedVendors] = useState<{
    [key: string]: string;
  }>({});
  const [pincodeFilter, setPincodeFilter] = useState('');
  const [pincodeApplied, setPincodeApplied] = useState(false);

  // const { addToCart } = useCart(); // TODO: Implement cart functionality

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        type: productType,
        page: '1',
        limit: '12',
        sortBy: filters.sortBy,
        ...(filters.search && { search: filters.search }),
        ...(filters.priceMin && { priceMin: filters.priceMin }),
        ...(filters.priceMax && { priceMax: filters.priceMax }),
        ...(pincodeApplied && filters.pincode && { pincode: filters.pincode }),
        ...searchParams,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/website/multi-vendor?${queryParams}`
      );

      const data = await response.json();

      if (data.success) {
        setProducts(data.data.products);
        // Set default vendor selection (lowest price)
        const defaultSelections: { [key: string]: string } = {};
        data.data.products.forEach((product: ProductGroup) => {
          const groupKey = JSON.stringify(product._id);
          if (product.vendors.length > 0) {
            defaultSelections[groupKey] = product.vendors[0].vendorId;
          }
        });
        setSelectedVendors(defaultSelections);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError('Error loading products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [
    productType,
    filters.sortBy,
    pincodeApplied,
    filters.search,
    filters.priceMin,
    filters.priceMax,
    filters.pincode,
    searchParams,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const applyPincodeFilter = () => {
    setFilters((prev) => ({ ...prev, pincode: pincodeFilter }));
    setPincodeApplied(true);
  };

  const clearPincodeFilter = () => {
    setPincodeFilter('');
    setFilters((prev) => ({ ...prev, pincode: '' }));
    setPincodeApplied(false);
  };

  const getProductName = (product: ProductGroup) => {
    const spec = product.productSpec[0];
    if (!spec) return 'Unknown Product';

    switch (productType) {
      case 'TYRE':
        const brand = spec.productBrand?.name || spec.productBrand?.[0]?.name || 'Unknown Brand';
        const width = spec.tyreWidth?.name || spec.tyreWidth?.[0]?.name || '';
        const ratio = spec.aspectRatio?.name || spec.aspectRatio?.[0]?.name || '';
        const diameter = spec.rimDiameter?.name || spec.rimDiameter?.[0]?.name || '';
        const size = `${width}${spec.tyreWidthType === 'IN MM' && ratio ? `/${ratio}` : ''}${spec.construction || 'R'}${diameter}`;
        
        const otherSpecs = [
          spec.plyRating?.name || spec.plyRating?.[0]?.name,
          spec.loadIndex?.name || spec.loadIndex?.[0]?.name,
          spec.speedSymbol?.name || spec.speedSymbol?.[0]?.name,
          spec.productThreadPattern?.name || spec.productThreadPattern?.[0]?.name,
          spec.unit
        ].filter(Boolean).join(' ');
        
        return `${brand} ${size}${otherSpecs ? ' ' + otherSpecs : ''}`.trim();
      case 'ALLOY_WHEEL':
        return `${spec.alloyBrand?.[0]?.name || 'Unknown Brand'} ${
          spec.alloyDesignName || 'Wheel'
        } ${spec.alloyDiameter?.[0]?.name || ''}x${
          spec.alloyWidth?.[0]?.name || ''
        }`;
      case 'SERVICE':
        return spec.serviceName || 'Service';
      default:
        return 'Unknown Product';
    }
  };

  const getSelectedVendor = (product: ProductGroup) => {
    const groupKey = JSON.stringify(product._id);
    const selectedVendorId = selectedVendors[groupKey];
    return (
      product.vendors.find((v) => v.vendorId === selectedVendorId) ||
      product.vendors[0]
    );
  };

  const handleVendorChange = (product: ProductGroup, vendorId: string) => {
    const groupKey = JSON.stringify(product._id);
    setSelectedVendors((prev) => ({
      ...prev,
      [groupKey]: vendorId,
    }));
  };

  const handleAddToCart = (product: ProductGroup) => {
    const selectedVendor = getSelectedVendor(product);
    if (!selectedVendor) return;

    // TODO: Implement cart functionality
    console.log('Adding to cart:', {
      productId: selectedVendor.productId,
      vendorId: selectedVendor.vendorId,
      productType,
      price: selectedVendor.prices.auto_deal_price,
    });

    // For now, just show an alert
    alert('Product added to cart! (Cart functionality will be implemented)');
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-64'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center py-8'>
        <p className='text-red-600 mb-4'>{error}</p>
        <Button onClick={fetchProducts} variant='outline'>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Filters */}
      <Card>
        <CardContent className='p-4'>
          <div className='flex flex-wrap gap-4 items-center'>
            {/* Pincode Filter */}
            <div className='flex items-center gap-2'>
              <MapPin className='h-4 w-4 text-gray-500' />
              <Input
                placeholder='Enter pincode'
                value={pincodeFilter}
                onChange={(e) => setPincodeFilter(e.target.value)}
                className='w-32'
              />
              <Button
                onClick={applyPincodeFilter}
                size='sm'
                disabled={!pincodeFilter.trim()}
              >
                Check
              </Button>
              {pincodeApplied && (
                <Button
                  onClick={clearPincodeFilter}
                  size='sm'
                  variant='outline'
                >
                  Clear
                </Button>
              )}
            </div>

            {/* Sort Filter */}
            <Select
              value={filters.sortBy}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, sortBy: value }))
              }
            >
              <SelectTrigger className='w-48'>
                <SelectValue placeholder='Sort by' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='price_low'>Price: Low to High</SelectItem>
                <SelectItem value='price_high'>Price: High to Low</SelectItem>
                <SelectItem value='vendors_most'>Most Vendors</SelectItem>
                <SelectItem value='newest'>Newest First</SelectItem>
              </SelectContent>
            </Select>

            {pincodeApplied && (
              <Badge variant='secondary' className='flex items-center gap-1'>
                <Check className='h-3 w-3' />
                Filtered by {filters.pincode}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {products.map((product, index) => {
          const selectedVendor = getSelectedVendor(product);
          const groupKey = JSON.stringify(product._id);

          return (
            <Card key={index} className='relative overflow-hidden'>
              <CardHeader className='pb-3'>
                <div className='flex justify-between items-start'>
                  <div className='flex-1'>
                    <Link
                      href={`/product/${product.productSpec[0]._id}?type=${productType}`}
                      className='block hover:text-brand-orange transition-colors'
                    >
                      <h3 className='font-semibold text-lg leading-tight cursor-pointer'>
                        {getProductName(product)}
                      </h3>
                    </Link>
                    <div className='flex items-center gap-2 mt-2'>
                      <Badge variant='outline' className='text-xs'>
                        {productType.replace('_', ' ')}
                      </Badge>
                      <Badge
                        variant='secondary'
                        className='text-xs flex items-center gap-1'
                      >
                        <Users className='h-3 w-3' />
                        {product.vendorCount} vendor
                        {product.vendorCount > 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className='space-y-4'>
                {/* Product Image */}
                <Link
                  href={`/product/${product.productSpec[0]._id}?type=${productType}`}
                  className='block'
                >
                  <div className='aspect-square bg-white border border-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors p-2'>
                    {selectedVendor?.product_images?.[0] ? (
                      <Image
                        src={selectedVendor.product_images[0]}
                        alt={getProductName(product)}
                        width={400}
                        height={400}
                        className='w-full h-full object-contain'
                      />
                    ) : (
                      <span className='text-gray-400 text-sm'>No Image</span>
                    )}
                  </div>
                </Link>

                {/* Price Range */}
                <div className='text-center'>
                  <div className='text-sm text-gray-600 mb-1'>
                    Price range across vendors
                  </div>
                  <div className='font-bold text-lg'>
                    ₹{product.minPrice}
                    {product.minPrice !== product.maxPrice && (
                      <span className='text-gray-500 font-normal'>
                        {' '}
                        - ₹{product.maxPrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* Vendor Selection */}
                <div className='space-y-3'>
                  <div className='text-sm font-medium'>Choose Vendor:</div>
                  <Select
                    value={selectedVendors[groupKey] || ''}
                    onValueChange={(value) =>
                      handleVendorChange(product, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select vendor' />
                    </SelectTrigger>
                    <SelectContent>
                      {product.vendors.map((vendor) => (
                        <SelectItem
                          key={vendor.vendorId}
                          value={vendor.vendorId}
                        >
                          <div className='flex items-center justify-between w-full'>
                            <div>
                              <div className='font-medium'>
                                {vendor.vendorInfo.store_name ||
                                  vendor.vendorInfo.name}
                              </div>
                              <div className='text-xs text-gray-500'>
                                ₹{vendor.prices.auto_deal_price}
                                {vendor.vendorInfo.vendor?.pickup_address?.[0]
                                  ?.city && (
                                  <span>
                                    {' '}
                                    •{' '}
                                    {
                                      vendor.vendorInfo.vendor.pickup_address[0]
                                        .city
                                    }
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Selected Vendor Details */}
                {selectedVendor && (
                  <div className='p-3 bg-brand-light-gray rounded-lg space-y-2'>
                    <div className='flex items-center justify-between'>
                      <div className='font-medium text-sm'>
                        {selectedVendor.vendorInfo.store_name ||
                          selectedVendor.vendorInfo.name}
                      </div>
                      <div className='text-right'>
                        {selectedVendor.prices.mrp_price >
                          selectedVendor.prices.auto_deal_price && (
                          <div className='text-xs text-gray-500 line-through'>
                            ₹{selectedVendor.prices.mrp_price}
                          </div>
                        )}
                        <div className='font-bold text-brand-dark-blue'>
                          ₹{selectedVendor.prices.auto_deal_price}
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center justify-between text-xs text-gray-600'>
                      <div className='flex items-center gap-1'>
                        <Store className='h-3 w-3' />
                        <span>
                          {selectedVendor.vendorInfo.vendor?.pickup_address?.[0]
                            ?.city || 'Location not specified'}
                        </span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            selectedVendor.in_stock
                              ? 'bg-green-500'
                              : 'bg-red-500'
                          }`}
                        ></div>
                        <span>
                          {selectedVendor.in_stock
                            ? 'In Stock'
                            : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Add to Cart Button */}
                <div className='space-y-2'>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className='w-full'
                    disabled={!selectedVendor?.in_stock}
                  >
                    <ShoppingCart className='h-4 w-4 mr-2' />
                    Add to Cart
                  </Button>

                  {/* View Product Details Button - Always Show */}
                  <Link
                    href={`/product/${product.productSpec[0]._id}?type=${productType}`}
                    className='w-full'
                  >
                    <Button variant='outline' className='w-full'>
                      View Product Details
                    </Button>
                  </Link>

                  {/* View All Vendors Button - Only show if multiple vendors */}
                  {product.vendorCount > 1 && (
                    <Link
                      href={`/product/${product.productSpec[0]._id}?type=${productType}`}
                      className='w-full'
                    >
                      <Button variant='secondary' className='w-full text-sm'>
                        Compare All {product.vendorCount} Vendors
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* No products message */}
      {products.length === 0 && (
        <div className='text-center py-12'>
          <p className='text-gray-500 mb-4'>
            {pincodeApplied
              ? `No ${productType
                  .toLowerCase()
                  .replace('_', ' ')} products found for pincode ${
                  filters.pincode
                }`
              : `No ${productType
                  .toLowerCase()
                  .replace('_', ' ')} products available`}
          </p>
          {pincodeApplied && (
            <Button onClick={clearPincodeFilter} variant='outline'>
              Show All Products
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
