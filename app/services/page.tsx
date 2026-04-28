'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import {
  Star,
  Clock,
  MapPin,
  Phone,
  Calendar,
  Award,
  Settings,
  X,
  Grid,
  List,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

function ServicesPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState<any>({});
  const [filterOptions, setFilterOptions] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilters, setActiveFilters] = useState<{
    [key: string]: string[];
  }>({});
  const [priceRange, setPriceRange] = useState([0, 20000]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        type: 'SERVICE',
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
        ...(searchParams.get('serviceType') && {
          serviceType: searchParams.get('serviceType')!,
        }),
        ...(searchParams.get('location') && {
          location: searchParams.get('location')!,
        }),
        // Add activeFilters to the query
        ...(activeFilters.serviceType &&
          activeFilters.serviceType.length > 0 && {
            serviceType: activeFilters.serviceType.join(','),
          }),
        ...(activeFilters.location &&
          activeFilters.location.length > 0 && {
            location: activeFilters.location.join(','),
          }),
      });

      const [productsResponse, filtersResponse] = await Promise.all([
        axios.get(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/api/products/website?${queryParams.toString()}`
        ),
        axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/website/filters/SERVICE`
        ),
      ]);

      setProducts(productsResponse.data.data.products);
      setPagination(productsResponse.data.data.pagination);
      setFilterOptions(filtersResponse.data.data);
    } catch (err) {
      setError('Failed to load services');
      console.error('Services page error:', err);
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
    setActiveFilters(newFilters);
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setPriceRange([0, 20000]);
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).reduce(
      (count, filters) => count + filters.length,
      0
    );
  };

  if (error) {
    return (
      <div className='min-h-screen bg-linear-to-br from-slate-50 to-white flex items-center justify-center'>
        <div className='text-center bg-white rounded-2xl p-8 shadow-xl border border-slate-200/50 max-w-md mx-4'>
          <div className='w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center'>
            <Settings className='w-8 h-8 text-red-500' />
          </div>
          <h1 className='text-2xl font-bold text-slate-900 mb-4'>
            Service Unavailable
          </h1>
          <p className='text-slate-600 mb-6'>{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className='bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl'
          >
            Try Again
          </Button>
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
        <div className='absolute inset-0 bg-[url("/images/service-pattern.svg")] opacity-5'></div>
        <div className='absolute inset-0 bg-gradient-to-r from-[#fca311]/10 to-transparent'></div>

        <div className='relative container mx-auto px-4 py-16'>
          <div className='max-w-4xl mx-auto text-center'>
            <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20'>
              <Award className='w-5 h-5 text-[#fca311]' />
              <span className='font-medium'>
                Professional Automotive Services
              </span>
            </div>

            <h1 className='text-4xl md:text-5xl font-bold mb-4 text-white'>
              Expert Services
            </h1>
            <p className='text-lg md:text-xl mb-6 text-gray-300 max-w-3xl mx-auto'>
              Professional installation, maintenance, and repair services
              delivered by certified technicians
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
                        max={20000}
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

                  {/* Service Type Filter */}
                  {filterOptions.serviceTypes &&
                  filterOptions.serviceTypes.length > 0 ? (
                    <div className='mb-6'>
                      <Label className='text-sm font-medium text-[#14213d] mb-3 block'>
                        Service Type
                      </Label>
                      <div className='space-y-2'>
                        {filterOptions.serviceTypes.map((type: string) => (
                          <div
                            key={type}
                            className='flex items-center space-x-2'
                          >
                            <Checkbox
                              id={`service-${type}`}
                              checked={
                                activeFilters.serviceType?.includes(type) ||
                                false
                              }
                              onCheckedChange={(checked) => {
                                const newFilters = { ...activeFilters };
                                if (!newFilters.serviceType)
                                  newFilters.serviceType = [];

                                if (checked) {
                                  newFilters.serviceType.push(type);
                                } else {
                                  newFilters.serviceType =
                                    newFilters.serviceType.filter(
                                      (t) => t !== type
                                    );
                                  if (newFilters.serviceType.length === 0)
                                    delete newFilters.serviceType;
                                }
                                setActiveFilters(newFilters);
                              }}
                            />
                            <Label
                              htmlFor={`service-${type}`}
                              className='text-sm text-gray-700 cursor-pointer'
                            >
                              {type}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className='mb-6'>
                      <Label className='text-sm font-medium text-[#14213d] mb-3 block'>
                        Service Type
                      </Label>
                      <div className='space-y-2'>
                        {[
                          'Installation',
                          'Maintenance',
                          'Repair',
                          'Inspection',
                          'Alignment',
                          'Brake Service',
                        ].map((type) => (
                          <div
                            key={type}
                            className='flex items-center space-x-2'
                          >
                            <Checkbox
                              id={`service-${type}`}
                              checked={
                                activeFilters.serviceType?.includes(type) ||
                                false
                              }
                              onCheckedChange={(checked) => {
                                const newFilters = { ...activeFilters };
                                if (!newFilters.serviceType)
                                  newFilters.serviceType = [];

                                if (checked) {
                                  newFilters.serviceType.push(type);
                                } else {
                                  newFilters.serviceType =
                                    newFilters.serviceType.filter(
                                      (t) => t !== type
                                    );
                                  if (newFilters.serviceType.length === 0)
                                    delete newFilters.serviceType;
                                }
                                setActiveFilters(newFilters);
                              }}
                            />
                            <Label
                              htmlFor={`service-${type}`}
                              className='text-sm text-gray-700 cursor-pointer'
                            >
                              {type}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Location Filter */}
                  <div className='mb-6'>
                    <Label className='text-sm font-medium text-[#14213d] mb-3 block'>
                      Service Location
                    </Label>
                    <div className='space-y-2'>
                      {['Workshop', 'Doorstep', 'Both'].map((location) => (
                        <div
                          key={location}
                          className='flex items-center space-x-2'
                        >
                          <Checkbox
                            id={`location-${location}`}
                            checked={
                              activeFilters.location?.includes(location) ||
                              false
                            }
                            onCheckedChange={(checked) => {
                              const newFilters = { ...activeFilters };
                              if (!newFilters.location)
                                newFilters.location = [];

                              if (checked) {
                                newFilters.location.push(location);
                              } else {
                                newFilters.location =
                                  newFilters.location.filter(
                                    (l) => l !== location
                                  );
                                if (newFilters.location.length === 0)
                                  delete newFilters.location;
                              }
                              setActiveFilters(newFilters);
                            }}
                          />
                          <Label
                            htmlFor={`location-${location}`}
                            className='text-sm text-gray-700 cursor-pointer'
                          >
                            {location}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Content - Services */}
          <div className='flex-1'>
            {/* Toolbar */}
            <div className='flex items-center justify-between mb-6 bg-white rounded-lg p-4 border border-gray-200'>
              <div className='flex items-center gap-4'>
                <div className='text-sm text-gray-600'>
                  Showing {products.length} professional services
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

            {/* Services Grid */}
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
                      {/* Service Image */}
                      <div
                        className={`${
                          viewMode === 'list' ? 'w-48 flex-shrink-0' : 'mb-4'
                        }`}
                      >
                        <Link
                          href={`/product/${product.service?._id}?type=SERVICE`}
                        >
                          <div className='aspect-square bg-gray-50 rounded-lg overflow-hidden cursor-pointer group-hover:bg-gray-100 transition-colors'>
                            {product.service?.serviceImage && !product.service.serviceImage.includes('placeholder.com') ? (
                              <img
                                src={
                                  product.service.serviceImage.startsWith('http')
                                    ? product.service.serviceImage
                                    : `${process.env.NEXT_PUBLIC_API_URL}${product.service.serviceImage.replace(/\\/g, '/')}`
                                }
                                alt={product.service?.serviceName || 'Service'}
                                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                            ) : null}
                            <div className={`w-full h-full bg-linear-to-br from-[#14213d]/10 to-[#fca311]/10 flex items-center justify-center ${product.service?.serviceImage && !product.service.serviceImage.includes('placeholder.com') ? 'hidden' : ''}`}>
                              <span className='text-4xl'>
                                {getServiceIcon(
                                  product.service?.service_type
                                )}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </div>

                      {/* Service Details */}
                      <div className='flex-1'>
                        <Link
                          href={`/product/${product.service?._id}?type=SERVICE`}
                        >
                          <h3 className='font-bold text-lg text-[#14213d] group-hover:text-[#fca311] transition-colors duration-300 mb-2 cursor-pointer'>
                            {product.service?.serviceName ||
                              product.product_name}
                          </h3>
                        </Link>

                        <p className='text-sm text-gray-600 mb-4'>
                          {product.vendor?.store_name || 'Professional Service'}
                        </p>

                        <div className='grid grid-cols-2 gap-2 mb-4 text-xs text-gray-600'>
                          <div className='flex items-center gap-1'>
                            <Clock className='w-3 h-3 text-[#14213d]' />
                            <span>
                              {product.service?.estimated_time || '1-2 hours'}
                            </span>
                          </div>
                          <div className='flex items-center gap-1'>
                            <MapPin className='w-3 h-3 text-[#fca311]' />
                            <span>
                              {product.service?.location_type || 'Workshop'}
                            </span>
                          </div>
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
                        </div>

                        <div className='flex gap-2'>
                          <Link
                            href={`/product/${product.service?._id}?type=SERVICE`}
                            className='flex-1'
                          >
                            <Button className='w-full bg-[#fca311] hover:bg-[#fca311]/90 text-white'>
                              <Calendar className='w-4 h-4 mr-2' />
                              View Details
                            </Button>
                          </Link>
                          <Button
                            variant='outline'
                            className='border-[#14213d] text-[#14213d] hover:bg-[#14213d] hover:text-white bg-transparent'
                          >
                            <Phone className='w-4 h-4' />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className='mt-16 flex justify-center'>
                <div className='flex items-center gap-2 bg-white rounded-2xl p-2 shadow-lg border border-slate-200/50'>
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
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                        page === pagination.page
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {page}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* No Services Found */}
            {products.length === 0 && (
              <div className='text-center py-16'>
                <div className='w-16 h-16 bg-slate-100 rounded-2xl mx-auto mb-4 flex items-center justify-center'>
                  <Settings className='w-8 h-8 text-slate-400' />
                </div>
                <h3 className='text-lg font-semibold text-slate-900 mb-2'>
                  No Services Found
                </h3>
                <p className='text-slate-600 mb-6'>
                  No services match your current criteria. Try adjusting your
                  filters.
                </p>
                <Button
                  variant='outline'
                  className='rounded-xl bg-transparent'
                  onClick={clearAllFilters}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-linear-to-br from-slate-50 to-white flex items-center justify-center'>
          <div className='text-center'>
            <div className='w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl animate-pulse mx-auto mb-4'></div>
            <p className='text-slate-600 font-medium'>
              Loading premium services...
            </p>
          </div>
        </div>
      }
    >
      <ServicesPageContent />
    </Suspense>
  );
}

// Helper function to get service icons
function getServiceIcon(serviceType: string): string {
  switch (serviceType?.toLowerCase()) {
    case 'installation':
      return '🔧';
    case 'maintenance':
      return '🛠️';
    case 'repair':
      return '🔨';
    case 'inspection':
      return '🔍';
    case 'alignment':
      return '⚖️';
    case 'brake':
      return '🛑';
    default:
      return '🔧';
  }
}
