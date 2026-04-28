'use client';

import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { X, Filter, Grid, List, Star, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface SearchParams {
  page?: string;
  brand?: string;
  priceMin?: string;
  priceMax?: string;
  sortBy?: string;
  search?: string;
  rimDiameter?: string;
  tyreWidth?: string;
  aspectRatio?: string;
}

interface Props {
  searchParams: Promise<SearchParams>;
}

export default function TyresPage({ searchParams }: Props) {
  const [resolvedSearchParams, setResolvedSearchParams] =
    useState<SearchParams>({});
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState<any>({});
  const [filterOptions, setFilterOptions] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilters, setActiveFilters] = useState<{
    [key: string]: string[];
  }>({});
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleFilterChange = (newFilters: any) => {
    setActiveFilters(newFilters);
    const params = new URLSearchParams(window.location.search);
    
    params.delete('brand');
    params.delete('rimDiameter');
    params.delete('tyreWidth');
    params.delete('aspectRatio');
    
    if (newFilters.brand?.length) params.set('brand', newFilters.brand.join(','));
    if (newFilters.rimDiameter?.length) params.set('rimDiameter', newFilters.rimDiameter.join(','));
    if (newFilters.tyreWidth?.length) params.set('tyreWidth', newFilters.tyreWidth.join(','));
    if (newFilters.aspectRatio?.length) params.set('aspectRatio', newFilters.aspectRatio.join(','));
    
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const resolveParams = async () => {
      const params = await searchParams;
      setResolvedSearchParams(params);
      
      setActiveFilters((prev) => {
        if (Object.keys(prev).length === 0) {
           const initialFilters: any = {};
           if (params.brand) initialFilters.brand = params.brand.split(',');
           if (params.rimDiameter) initialFilters.rimDiameter = params.rimDiameter.split(',');
           if (params.tyreWidth) initialFilters.tyreWidth = params.tyreWidth.split(',');
           if (params.aspectRatio) initialFilters.aspectRatio = params.aspectRatio.split(',');
           return initialFilters;
        }
        return prev;
      });
    };
    resolveParams();
  }, [searchParams]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        type: 'TYRE',
        page: resolvedSearchParams.page || '1',
        limit: '12',
        ...(resolvedSearchParams.search && {
          search: resolvedSearchParams.search,
        }),
        // Add activeFilters to the query
        ...(activeFilters.brand &&
          activeFilters.brand.length > 0 && {
            brand: activeFilters.brand.join(','),
          }),
        ...(activeFilters.rimDiameter &&
          activeFilters.rimDiameter.length > 0 && {
            rimDiameter: activeFilters.rimDiameter.join(','),
          }),
        ...(activeFilters.tyreWidth &&
          activeFilters.tyreWidth.length > 0 && {
            tyreWidth: activeFilters.tyreWidth.join(','),
          }),
      });

      const [productsResponse, filtersResponse] = await Promise.all([
        axios.get(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/api/products/website?${queryParams.toString()}`
        ),
        axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/website/filters/TYRE`
        ),
      ]);

      setProducts(productsResponse.data.data.products);
      setPagination(productsResponse.data.data.pagination);
      setFilterOptions(filtersResponse.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [resolvedSearchParams, activeFilters]);

  useEffect(() => {
    // Always fetch data, including initial load with empty params
    fetchData();
  }, [fetchData]);

  const removeFilter = (filterType: string, value: string) => {
    const newFilters = { ...activeFilters };
    if (newFilters[filterType]) {
      newFilters[filterType] = newFilters[filterType].filter(
        (v) => v !== value
      );
      if (newFilters[filterType].length === 0) {
        delete newFilters[filterType];
      }
    }
    handleFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    handleFilterChange({});
    setPriceRange([0, 50000]);
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).reduce(
      (count, filters) => count + filters.length,
      0
    );
  };

  return (
    <div className='min-h-screen bg-[#e5e5e5]'>
      {/* Loading Bar */}
      {loading && (
        <div className='fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200'>
          <div className='h-full bg-gradient-to-r from-[#14213d] to-[#fca311] animate-pulse'></div>
        </div>
      )}

      {/* Hero Section */}
      <section className='relative overflow-hidden bg-linear-to-br from-[#14213d] via-[#1a2847] to-[#14213d] text-white'>
        <div className="absolute inset-0 bg-[url('/images/tyre-pattern.svg')] opacity-5"></div>
        <div className='absolute inset-0 bg-gradient-to-r from-[#fca311]/10 to-transparent'></div>

        <div className='relative container mx-auto px-4 py-16'>
          <div className='max-w-4xl mx-auto text-center'>
            <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20'>
              <div className='w-2 h-2 bg-[#fca311] rounded-full animate-pulse'></div>
              <span className='text-sm font-medium'>
                Premium Tyre Collection
              </span>
            </div>

            <h1 className='text-4xl md:text-5xl font-bold mb-4 text-white'>
              Premium Tyres
            </h1>
            <p className='text-lg md:text-xl mb-6 text-gray-300 max-w-2xl mx-auto'>
              Discover exceptional performance and reliability with our curated
              selection
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className='container mx-auto px-4 py-8'>
        <div className='flex gap-8'>
          {/* Left Sidebar - Filters */}
          <div className='hidden lg:block w-80 flex-shrink-0'>
            <div className='sticky top-4'>
              <Card className='bg-white border-gray-200'>
                <CardContent className='p-6'>
                  <div className='flex items-center justify-between mb-6'>
                    <h3 className='text-lg font-semibold text-[#14213d]'>
                      Filters
                    </h3>
                    {getActiveFilterCount() > 0 && (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={clearAllFilters}
                        className='text-[#fca311] hover:text-[#fca311]/80'
                      >
                        Clear All
                      </Button>
                    )}
                  </div>

                  {/* Active Filters */}
                  {getActiveFilterCount() > 0 && (
                    <div className='mb-6'>
                      <h4 className='text-sm font-medium text-[#14213d] mb-3'>
                        Active Filters
                      </h4>
                      <div className='flex flex-wrap gap-2'>
                        {Object.entries(activeFilters).map(
                          ([filterType, values]) =>
                            values.map((value) => (
                              <Badge
                                key={`${filterType}-${value}`}
                                variant='secondary'
                                className='bg-[#fca311]/10 text-[#14213d] border-[#fca311]/20 hover:bg-[#fca311]/20'
                              >
                                {value}
                                <X
                                  className='w-3 h-3 ml-1 cursor-pointer'
                                  onClick={() =>
                                    removeFilter(filterType, value)
                                  }
                                />
                              </Badge>
                            ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* Price Range */}
                  <div className='mb-6'>
                    <Label className='text-sm font-medium text-[#14213d] mb-3 block'>
                      Price Range
                    </Label>
                    <div className='px-2'>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={50000}
                        min={0}
                        step={500}
                        className='mb-3'
                      />
                      <div className='flex justify-between text-sm text-gray-600'>
                        <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
                        <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Brand Filter */}
                  {filterOptions.brands && (
                    <div className='mb-6'>
                      <Label className='text-sm font-medium text-[#14213d] mb-3 block'>
                        Brand
                      </Label>
                      <div className='space-y-2 max-h-48 overflow-y-auto'>
                        {filterOptions.brands.slice(0, 10).map((brand: any) => (
                          <div
                            key={brand._id}
                            className='flex items-center space-x-2'
                          >
                            <Checkbox
                              id={`brand-${brand._id}`}
                              checked={
                                activeFilters.brand?.includes(brand.name) ||
                                false
                              }
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  handleFilterChange({
                                    ...activeFilters,
                                    brand: [...(activeFilters.brand || []), brand.name],
                                  });
                                } else {
                                  removeFilter('brand', brand.name);
                                }
                              }}
                            />
                            <Label
                              htmlFor={`brand-${brand._id}`}
                              className='text-sm text-gray-700 cursor-pointer'
                            >
                              {brand.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rim Diameter Filter */}
                  {filterOptions.rimDiameters && (
                    <div className='mb-6'>
                      <Label className='text-sm font-medium text-[#14213d] mb-3 block'>
                        Rim Diameter
                      </Label>
                      <div className='grid grid-cols-3 gap-2'>
                        {filterOptions.rimDiameters
                          .slice(0, 12)
                          .map((diameter: any) => (
                            <Button
                              key={diameter._id}
                              variant={
                                activeFilters.rimDiameter?.includes(
                                  diameter.name
                                )
                                  ? 'default'
                                  : 'outline'
                              }
                              size='sm'
                              className={`text-xs ${
                                activeFilters.rimDiameter?.includes(
                                  diameter.name
                                )
                                  ? 'bg-[#14213d] text-white'
                                  : 'border-gray-300 text-gray-700 hover:border-[#fca311]'
                              }`}
                              onClick={() => {
                                if (
                                  activeFilters.rimDiameter?.includes(
                                    diameter.name
                                  )
                                ) {
                                  removeFilter('rimDiameter', diameter.name);
                                } else {
                                  handleFilterChange({
                                    ...activeFilters,
                                    rimDiameter: [
                                      ...(activeFilters.rimDiameter || []),
                                      diameter.name,
                                    ],
                                  });
                                }
                              }}
                            >
                              {diameter.name}"
                            </Button>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Tyre Width Filter */}
                  {filterOptions.tyreWidths && (
                    <div className='mb-6'>
                      <Label className='text-sm font-medium text-[#14213d] mb-3 block'>
                        Tyre Width
                      </Label>
                      <div className='grid grid-cols-2 gap-2'>
                        {filterOptions.tyreWidths
                          .slice(0, 8)
                          .map((width: any) => (
                            <Button
                              key={width._id}
                              variant={
                                activeFilters.tyreWidth?.includes(width.name)
                                  ? 'default'
                                  : 'outline'
                              }
                              size='sm'
                              className={`text-xs ${
                                activeFilters.tyreWidth?.includes(width.name)
                                  ? 'bg-[#14213d] text-white'
                                  : 'border-gray-300 text-gray-700 hover:border-[#fca311]'
                              }`}
                              onClick={() => {
                                if (
                                  activeFilters.tyreWidth?.includes(width.name)
                                ) {
                                  removeFilter('tyreWidth', width.name);
                                } else {
                                  handleFilterChange({
                                    ...activeFilters,
                                    tyreWidth: [
                                      ...(activeFilters.tyreWidth || []),
                                      width.name,
                                    ],
                                  });
                                }
                              }}
                            >
                              {width.name}
                            </Button>
                          ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Content - Products */}
          <div className='flex-1'>
            {/* Toolbar */}
            <div className='flex items-center justify-between mb-6 bg-white rounded-lg p-4 border border-gray-200'>
              <div className='flex items-center gap-4'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setShowMobileFilters(true)}
                  className='lg:hidden text-[#14213d]'
                >
                  <Filter className='w-4 h-4 mr-2' />
                  Filters{' '}
                  {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
                </Button>
                <div className='text-sm text-gray-600'>
                  Showing {products.length} of {pagination.total} tyres
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size='sm'
                  onClick={() => setViewMode('grid')}
                  className={
                    viewMode === 'grid'
                      ? 'bg-[#14213d] text-white'
                      : 'text-[#14213d]'
                  }
                >
                  <Grid className='w-4 h-4' />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size='sm'
                  onClick={() => setViewMode('list')}
                  className={
                    viewMode === 'list'
                      ? 'bg-[#14213d] text-white'
                      : 'text-[#14213d]'
                  }
                >
                  <List className='w-4 h-4' />
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            <div
              className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1'
              }`}
            >
              {products.map((product: any) => {
                console.log('Product', product);

                return (
                  <Card
                    key={product._id}
                    className='group bg-white hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-[#fca311]/30'
                  >
                    <CardContent className='p-6'>
                      <div
                        className={`${viewMode === 'list' ? 'flex gap-6' : ''}`}
                      >
                        {/* Product Image */}
                        <div
                          className={`${
                            viewMode === 'list' ? 'w-48 flex-shrink-0' : 'mb-4'
                          }`}
                        >
                          <Link
                            href={`/product/${product.tyre?._id}?type=TYRE`}
                          >
                            <div className='aspect-square bg-gray-50 rounded-lg overflow-hidden cursor-pointer group-hover:bg-gray-100 transition-colors'>
                              {product.tyre?.productImages?.[0] ||
                              product.main_product?.productImages?.[0] ||
                              product.productImages?.[0] ? (
                                <Image
                                  src={
                                    (product.tyre?.productImages?.[0] ||
                                    product.main_product?.productImages?.[0] ||
                                    product.productImages?.[0])
                                      ? `${process.env.NEXT_PUBLIC_API_URL}${product.tyre?.productImages?.[0] || product.main_product?.productImages?.[0] || product.productImages?.[0]}`
                                      : '/placeholder.svg'
                                  }
                                  alt={product.product_name || 'Product image'}
                                  width={300}
                                  height={300}
                                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                                  unoptimized
                                />
                              ) : (
                                <div className='w-full h-full flex items-center justify-center'>
                                  <div className='text-center'>
                                    <div className='w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center'>
                                      <svg
                                        className='w-6 h-6 text-gray-400'
                                        fill='currentColor'
                                        viewBox='0 0 20 20'
                                      >
                                        <path d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z' />
                                      </svg>
                                    </div>
                                    <span className='text-gray-400 text-sm'>
                                      No Image
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </Link>
                        </div>

                        {/* Product Details */}
                        <div className='flex-1'>
                          <Link
                            href={`/product/${product.tyre?._id}?type=TYRE`}
                            className='block group-hover:text-[#fca311] transition-colors duration-300'
                          >
                            <h3 className='font-bold text-lg mb-2 line-clamp-2 cursor-pointer text-[#14213d]'>
                              {product.tyre?.productBrand?.name}{' '}
                              <span className='font-medium text-gray-600'>
                                {product.tyre?.tyreWidth?.name}
                                {product.tyre?.tyreWidthType === 'IN MM'
                                  ? `/${product.tyre?.aspectRatio?.name}`
                                  : ''}
                                {product.tyre?.construction}
                                {product.tyre?.rimDiameter?.name}
                                {product.tyre?.plyRating?.name}
                                {product.tyre?.loadIndex?.name}
                                {product.tyre?.speedSymbol?.name}
                                {product.tyre?.productThreadPattern?.name}
                                {product.tyre?.unit}
                              </span>
                            </h3>
                          </Link>

                          <div className='flex items-center gap-2 mb-4'>
                            <Badge className='bg-[#14213d]/10 text-[#14213d] border-[#14213d]/20'>
                              {product.tyre?.construction}
                            </Badge>
                            <span className='text-sm text-gray-500'>
                              {product.tyre?.productThreadPattern?.name}
                            </span>
                          </div>

                          <div className='mb-4'>
                            <div className='flex items-center justify-between mb-1'>
                              {product.mrp_price > product.auto_deal_price && (
                                <span className='text-sm text-gray-400 line-through'>
                                  ₹{product.mrp_price?.toLocaleString('en-IN')}
                                </span>
                              )}
                              {product.mrp_price > product.auto_deal_price && (
                                <Badge className='bg-red-500 text-white text-xs'>
                                  {Math.round(
                                    ((product.mrp_price -
                                      product.auto_deal_price) /
                                      product.mrp_price) *
                                      100
                                  )}
                                  % OFF
                                </Badge>
                              )}
                            </div>
                            <div className='text-2xl font-bold text-[#14213d]'>
                              ₹{product.auto_deal_price?.toLocaleString('en-IN')}
                            </div>
                            <div className='text-sm text-gray-500'>
                              Best price from verified vendors
                            </div>
                          </div>

                          <div className='flex gap-2'>
                            <Link
                              href={`/product/${product.tyre?._id}?type=TYRE`}
                              className='flex-1'
                            >
                              <Button className='w-full bg-[#fca311] hover:bg-[#fca311]/90 text-white'>
                                <Eye className='w-4 h-4 mr-2' />
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {pagination.pages > 1 && (
              <div className='mt-12 flex justify-center'>
                <div className='flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm border border-gray-200'>
                  {Array.from(
                    { length: pagination.pages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <Button
                      key={page}
                      variant={page === pagination.page ? 'default' : 'ghost'}
                      size='sm'
                      className={`${
                        page === pagination.page
                          ? 'bg-[#14213d] text-white'
                          : 'text-[#14213d] hover:bg-[#fca311]/10'
                      }`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
