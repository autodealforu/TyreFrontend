'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { X, Grid, List, Star, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

function AlloyWheelsPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState<any>({});
  const [filterOptions, setFilterOptions] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilters, setActiveFilters] = useState<{
    [key: string]: string[];
  }>(() => {
    const initialFilters: any = {};
    if (searchParams.get('brand')) initialFilters.brand = searchParams.get('brand')?.split(',');
    if (searchParams.get('alloyDiameter')) initialFilters.diameter = searchParams.get('alloyDiameter')?.split(',');
    if (searchParams.get('alloyWidth')) initialFilters.width = searchParams.get('alloyWidth')?.split(',');
    if (searchParams.get('pcd')) initialFilters.pcd = searchParams.get('pcd')?.split(',');
    if (searchParams.get('offset')) initialFilters.offset = searchParams.get('offset')?.split(',');
    if (searchParams.get('finish')) initialFilters.finish = searchParams.get('finish')?.split(',');
    return initialFilters;
  });
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const router = useRouter();
  const pathname = usePathname();

  const handleFilterChange = (newFilters: any) => {
    setActiveFilters(newFilters);
    const params = new URLSearchParams(window.location.search);
    
    params.delete('brand');
    params.delete('alloyDiameter');
    params.delete('alloyWidth');
    params.delete('pcd');
    params.delete('offset');
    params.delete('finish');
    
    if (newFilters.brand?.length) params.set('brand', newFilters.brand.join(','));
    if (newFilters.diameter?.length) params.set('alloyDiameter', newFilters.diameter.join(','));
    if (newFilters.width?.length) params.set('alloyWidth', newFilters.width.join(','));
    if (newFilters.pcd?.length) params.set('pcd', newFilters.pcd.join(','));
    if (newFilters.offset?.length) params.set('offset', newFilters.offset.join(','));
    if (newFilters.finish?.length) params.set('finish', newFilters.finish.join(','));
    
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        type: 'ALLOY_WHEEL',
        page: searchParams.get('page') || '1',
        limit: '12',
        ...(searchParams.get('priceMin') && {
          priceMin: searchParams.get('priceMin')!,
        }),
        ...(searchParams.get('priceMax') && {
          priceMax: searchParams.get('priceMax')!,
        }),
        ...(searchParams.get('sortBy') && {
          sortBy: searchParams.get('sortBy')!,
        }),
        ...(searchParams.get('search') && {
          search: searchParams.get('search')!,
        }),
        // Add activeFilters to the query
        // Filter values removed from here because they are handled by activeFilters below
        ...(activeFilters.brand &&
          activeFilters.brand.length > 0 && {
            brand: activeFilters.brand.join(','),
          }),
        ...(activeFilters.diameter &&
          activeFilters.diameter.length > 0 && {
            alloyDiameter: activeFilters.diameter.join(','),
          }),
        ...(activeFilters.width &&
          activeFilters.width.length > 0 && {
            alloyWidth: activeFilters.width.join(','),
          }),
        ...(activeFilters.pcd &&
          activeFilters.pcd.length > 0 && {
            pcd: activeFilters.pcd.join(','),
          }),
        ...(activeFilters.offset &&
          activeFilters.offset.length > 0 && {
            offset: activeFilters.offset.join(','),
          }),
        ...(activeFilters.finish &&
          activeFilters.finish.length > 0 && {
            finish: activeFilters.finish.join(','),
          }),
      });

      const [productsResponse, filtersResponse] = await Promise.all([
        axios.get(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/api/products/website?${queryParams.toString()}`
        ),
        axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/website/filters/ALLOY_WHEEL`
        ),
      ]);

      setProducts(productsResponse.data.data.products);
      setPagination(productsResponse.data.data.pagination);
      setFilterOptions(filtersResponse.data.data);
    } catch (err) {
      setError('Failed to load alloy wheels');
      console.error('Alloy wheels page error:', err);
    } finally {
      setLoading(false);
    }
  }, [searchParams, activeFilters]);

  useEffect(() => {
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
    setPriceRange([0, 100000]);
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).reduce(
      (count, filters) => count + filters.length,
      0
    );
  };

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-red-600 mb-4'>
            Error loading alloy wheels
          </h1>
          <p className='text-gray-600'>{error}</p>
        </div>
      </div>
    );
  }

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
        <div className='absolute inset-0 bg-[url("/images/wheel-pattern.svg")] opacity-5'></div>
        <div className='absolute inset-0 bg-gradient-to-r from-[#fca311]/10 to-transparent'></div>

        <div className='relative container mx-auto px-4 py-16'>
          <div className='max-w-4xl mx-auto text-center'>
            <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20'>
              <div className='w-2 h-2 bg-[#fca311] rounded-full animate-pulse'></div>
              <span className='text-sm font-medium'>Premium Alloy Wheels</span>
            </div>

            <h1 className='text-4xl md:text-5xl font-bold mb-4 text-white'>
              Premium Alloy Wheels
            </h1>
            <p className='text-lg md:text-xl mb-6 text-gray-300 max-w-2xl mx-auto'>
              Enhance your vehicle's style and performance with our premium
              collection
            </p>
          </div>
        </div>
      </section>

      {/* Main Content with Left Sidebar */}
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

                  {/* Active Filters Chips */}
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

                  {/* Price Range Filter */}
                  <div className='mb-6'>
                    <Label className='text-sm font-medium text-[#14213d] mb-3 block'>
                      Price Range
                    </Label>
                    <div className='px-2'>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={100000}
                        min={0}
                        step={1000}
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

                  {/* Diameter Filter */}
                  {filterOptions.diameters && (
                    <div className='mb-6'>
                      <Label className='text-sm font-medium text-[#14213d] mb-3 block'>
                        Diameter
                      </Label>
                      <div className='grid grid-cols-3 gap-2'>
                        {filterOptions.diameters
                          .slice(0, 12)
                          .map((diameter: any) => (
                            <Button
                              key={diameter._id}
                              variant={
                                activeFilters.diameter?.includes(diameter.name)
                                  ? 'default'
                                  : 'outline'
                              }
                              size='sm'
                              className={`text-xs ${
                                activeFilters.diameter?.includes(diameter.name)
                                  ? 'bg-[#14213d] text-white'
                                  : 'border-gray-300 text-gray-700 hover:border-[#fca311]'
                              }`}
                              onClick={() => {
                                if (
                                  activeFilters.diameter?.includes(
                                    diameter.name
                                  )
                                ) {
                                  removeFilter('diameter', diameter.name);
                                } else {
                                  handleFilterChange({
                                    ...activeFilters,
                                    diameter: [
                                      ...(activeFilters.diameter || []),
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

                  {/* Width Filter */}
                  {filterOptions.widths && (
                    <div className='mb-6'>
                      <Label className='text-sm font-medium text-[#14213d] mb-3 block'>
                        Width
                      </Label>
                      <div className='grid grid-cols-3 gap-2'>
                        {filterOptions.widths.slice(0, 12).map((width: any) => (
                          <Button
                            key={width._id}
                            variant={
                              activeFilters.width?.includes(width.name)
                                ? 'default'
                                : 'outline'
                            }
                            size='sm'
                            className={`text-xs ${
                              activeFilters.width?.includes(width.name)
                                ? 'bg-[#14213d] text-white'
                                : 'border-gray-300 text-gray-700 hover:border-[#fca311]'
                            }`}
                            onClick={() => {
                              if (activeFilters.width?.includes(width.name)) {
                                removeFilter('width', width.name);
                              } else {
                                handleFilterChange({
                                  ...activeFilters,
                                  width: [
                                    ...(activeFilters.width || []),
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

                  {/* PCD Filter */}
                  {filterOptions.pcds && (
                    <div className='mb-6'>
                      <Label className='text-sm font-medium text-[#14213d] mb-3 block'>
                        PCD
                      </Label>
                      <div className='grid grid-cols-3 gap-2'>
                        {filterOptions.pcds.slice(0, 12).map((pcd: any) => (
                          <Button
                            key={pcd._id}
                            variant={
                              activeFilters.pcd?.includes(pcd.name)
                                ? 'default'
                                : 'outline'
                            }
                            size='sm'
                            className={`text-xs ${
                              activeFilters.pcd?.includes(pcd.name)
                                ? 'bg-[#14213d] text-white'
                                : 'border-gray-300 text-gray-700 hover:border-[#fca311]'
                            }`}
                            onClick={() => {
                              if (activeFilters.pcd?.includes(pcd.name)) {
                                removeFilter('pcd', pcd.name);
                              } else {
                                handleFilterChange({
                                  ...activeFilters,
                                  pcd: [...(activeFilters.pcd || []), pcd.name],
                                });
                              }
                            }}
                          >
                            {pcd.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Offset Filter */}
                  {filterOptions.offsets && (
                    <div className='mb-6'>
                      <Label className='text-sm font-medium text-[#14213d] mb-3 block'>
                        Offset
                      </Label>
                      <div className='grid grid-cols-3 gap-2'>
                        {filterOptions.offsets
                          .slice(0, 12)
                          .map((offset: any) => (
                            <Button
                              key={offset._id}
                              variant={
                                activeFilters.offset?.includes(offset.name)
                                  ? 'default'
                                  : 'outline'
                              }
                              size='sm'
                              className={`text-xs ${
                                activeFilters.offset?.includes(offset.name)
                                  ? 'bg-[#14213d] text-white'
                                  : 'border-gray-300 text-gray-700 hover:border-[#fca311]'
                              }`}
                              onClick={() => {
                                if (activeFilters.offset?.includes(offset.name)) {
                                  removeFilter('offset', offset.name);
                                } else {
                                  handleFilterChange({
                                    ...activeFilters,
                                    offset: [
                                      ...(activeFilters.offset || []),
                                      offset.name,
                                    ],
                                  });
                                }
                              }}
                            >
                              {offset.name}
                            </Button>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Finish Filter */}
                  {filterOptions.finishes && (
                    <div className='mb-6'>
                      <Label className='text-sm font-medium text-[#14213d] mb-3 block'>
                        Finish
                      </Label>
                      <div className='space-y-2 max-h-48 overflow-y-auto'>
                        {filterOptions.finishes
                          .slice(0, 10)
                          .map((finish: any) => (
                            <div
                              key={finish._id}
                              className='flex items-center space-x-2'
                            >
                              <Checkbox
                                id={`finish-${finish._id}`}
                                checked={
                                  activeFilters.finish?.includes(finish.name) ||
                                  false
                                }
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    handleFilterChange({
                                      ...activeFilters,
                                      finish: [
                                        ...(activeFilters.finish || []),
                                        finish.name,
                                      ],
                                    });
                                  } else {
                                    removeFilter('finish', finish.name);
                                  }
                                }}
                              />
                              <Label
                                htmlFor={`finish-${finish._id}`}
                                className='text-sm text-gray-700 cursor-pointer'
                              >
                                {finish.name}
                              </Label>
                            </div>
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
                <div className='text-sm text-gray-600'>
                  Showing {products.length} alloy wheels
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
              {products.map((product: any) => (
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
                          href={`/product/${product.alloy_wheel?._id}?type=ALLOY_WHEEL`}
                        >
                          <div className='aspect-square bg-gray-50 rounded-lg overflow-hidden cursor-pointer group-hover:bg-gray-100 transition-colors'>
                            {(product.alloy_wheel?.productImages?.[0] || product.main_product?.productImages?.[0]) ? (
                              <img
                                src={`${process.env.NEXT_PUBLIC_API_URL}${(product.alloy_wheel?.productImages?.[0] || product.main_product?.productImages?.[0]).replace(/\\/g, '/')}`}
                                alt={
                                  product.alloy_wheel?.wheel_name ||
                                  product.product_name ||
                                  'Alloy Wheel'
                                }
                                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                              />
                            ) : (
                              <div className='w-full h-full flex items-center justify-center'>
                                <div className='text-center'>
                                  <div className='w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center'>
                                    <svg className='w-6 h-6 text-gray-400' fill='currentColor' viewBox='0 0 20 20'>
                                      <path d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z' />
                                    </svg>
                                  </div>
                                  <span className='text-gray-400 text-sm'>No Image</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </Link>
                      </div>

                      {/* Product Details */}
                      <div className='flex-1'>
                        <Link
                          href={`/product/${product.alloy_wheel?._id}?type=ALLOY_WHEEL`}
                          className='block group-hover:text-[#fca311] transition-colors duration-300'
                        >
                          <h3 className='font-bold text-lg mb-2 line-clamp-2 cursor-pointer text-[#14213d]'>
                            {`${
                              product.alloy_wheel?.alloyBrand?.name ||
                              'Unknown Brand'
                            } ${
                              product.alloy_wheel?.alloyDiameterInches?.name ||
                              ''
                            }X${product.alloy_wheel?.alloyWidth?.name || ''} ${
                              product.alloy_wheel?.alloyFinish?.name || ''
                            }`.trim()}
                          </h3>
                        </Link>

                        <p className='text-sm text-gray-600 mb-3'>
                          {product.alloy_wheel?.alloyDesignName || ''}
                        </p>

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
                          <div className='text-sm text-gray-500'>per wheel</div>
                        </div>

                        <div className='flex gap-2'>
                          <Link
                            href={`/product/${product.alloy_wheel?._id}?type=ALLOY_WHEEL`}
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
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className='mt-8 flex justify-center'>
                <div className='flex space-x-2'>
                  {Array.from(
                    { length: pagination.pages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <a
                      key={page}
                      href={`?${new URLSearchParams({
                        ...Object.fromEntries(searchParams.entries()),
                        page: String(page),
                      }).toString()}`}
                      className={`px-3 py-2 rounded-md ${
                        page === pagination.page
                          ? 'bg-brand-dark-blue text-white'
                          : 'bg-white text-brand-black hover:bg-brand-light-gray'
                      }`}
                    >
                      {page}
                    </a>
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

export default function AlloyWheelsPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600'></div>
            <p className='mt-4 text-gray-600'>Loading alloy wheels...</p>
          </div>
        </div>
      }
    >
      <AlloyWheelsPageContent />
    </Suspense>
  );
}
