'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight,
  Star,
  Truck,
  Shield,
  Users,
  Award,
  Phone,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FeaturedProductsData {
  tyres: any[];
  alloyWheels: any[];
  services: any[];
  brands: any[];
  productCounts: {
    TYRE: number;
    ALLOY_WHEEL: number;
    SERVICE: number;
  };
}

interface FilterOptions {
  tyre: any;
  alloyWheel: any;
  service: any;
}

interface Props {
  featuredProducts: FeaturedProductsData;
  banners: any[];
  filterOptions: FilterOptions;
}

export default function MultiProductHomepage({
  featuredProducts,
  banners,
  filterOptions,
}: Props) {
  const [activeCategory, setActiveCategory] = useState<
    'TYRE' | 'ALLOY_WHEEL' | 'SERVICE'
  >('TYRE');

  const categoryConfig = {
    TYRE: {
      title: 'Premium Tyres',
      description: 'High-performance tyres for every journey',
      icon: '🏎️',
      gradient: 'from-brand-primary to-brand-black',
      href: '/tyres',
    },
    ALLOY_WHEEL: {
      title: 'Alloy Wheels',
      description: 'Precision-crafted wheels for style & performance',
      icon: '⚡',
      gradient: 'from-brand-orange to-blue-600',
      href: '/alloy-wheels',
    },
    SERVICE: {
      title: 'Expert Services',
      description: 'Professional installation & maintenance',
      icon: '🔧',
      gradient: 'from-brand-primary to-brand-black',
      href: '/services',
    },
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const getProductTitle = (product: any) => {
    switch (product.product_category) {
      case 'TYRE':
        return (
          <>
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
          </>
        );
      case 'ALLOY_WHEEL':
        return `${product.alloy_wheel?.alloyBrand?.name || 'Unknown Brand'} ${
          product.alloy_wheel?.alloyDiameterInches?.name || ''
        }X${product.alloy_wheel?.alloyWidth?.name || ''} ${
          product.alloy_wheel?.alloyFinish?.name || ''
        }`.trim();
      case 'SERVICE':
        return product.service?.serviceName || product.product_name;
      default:
        return product.product_name;
    }
  };

  const getProductSubtitle = (product: any) => {
    switch (product.product_category) {
      case 'TYRE':
        return `${product.tyre?.construction || ''} • ${
          product.tyre?.productThreadPattern?.name || ''
        }`.trim();
      case 'ALLOY_WHEEL':
        return product.alloy_wheel?.alloyDesignName || '';
      case 'SERVICE':
        return (
          product.service?.serviceDescription || product.product_description
        );
      default:
        return product.product_description;
    }
  };

  return (
    <div className='min-h-screen bg-background'>
      <section className='relative min-h-screen flex items-center justify-center overflow-hidden'>
        {/* Background with overlay */}
        <div className='absolute inset-0 gradient-hero'></div>
        <div className='absolute inset-0 bg-black/20'></div>

        {/* Animated background elements */}
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse'></div>
          <div className='absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand-orange rounded-full blur-3xl animate-pulse delay-1000'></div>
        </div>

        <div className='container mx-auto px-4 py-20 relative z-10'>
          <div className='max-w-4xl mx-auto text-center text-white'>
            <div className='animate-fade-in-up'>
              <Badge className='mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm'>
                <Award className='w-4 h-4 mr-2' />
                India's Premium Tyre Marketplace
              </Badge>

              <h1 className='text-hero text-gradient mb-6'>
                Drive with
                <span className='block text-white'>Confidence & Style</span>
              </h1>

              <p className='text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed'>
                Discover premium tyres, precision-crafted alloy wheels, and
                expert services from India's most trusted automotive brands.
              </p>

              <div className='flex flex-col sm:flex-row gap-4 justify-center mb-12'>
                <Button
                  size='lg'
                  className='btn-primary px-8 py-4 text-lg font-semibold hover-lift'
                >
                  Explore Products
                  <ArrowRight className='ml-2 h-5 w-5' />
                </Button>
                <Button
                  size='lg'
                  variant='outline'
                  className='px-8 py-4 text-lg font-semibold text-white border-white/30 hover:bg-white hover:text-brand-primary backdrop-blur-sm bg-transparent'
                >
                  <Phone className='mr-2 h-5 w-5' />
                  Get Expert Advice
                </Button>
              </div>

              {/* Trust indicators */}
              <div className='grid grid-cols-3 gap-8 max-w-2xl mx-auto'>
                <div className='text-center'>
                  <div className='text-3xl font-bold mb-1'>50K+</div>
                  <div className='text-sm text-gray-300'>Happy Customers</div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl font-bold mb-1'>500+</div>
                  <div className='text-sm text-gray-300'>Premium Brands</div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl font-bold mb-1'>24/7</div>
                  <div className='text-sm text-gray-300'>Expert Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce'>
          <ChevronRight className='w-6 h-6 text-white rotate-90' />
        </div>
      </section>

      <section className='py-20 bg-linear-to-b from-muted/50 to-background'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16 animate-fade-in-up'>
            <Badge className='mb-4 bg-brand-orange/10 text-brand-orange border-brand-orange/20'>
              Premium Collection
            </Badge>
            <h2 className='text-4xl font-bold mb-6 text-gradient'>
              Explore Our Premium Range
            </h2>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
              From high-performance tyres to precision-crafted alloy wheels,
              discover products that elevate your driving experience.
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8 mb-16'>
            {Object.entries(categoryConfig).map(([key, config], index) => (
              <Card
                key={key}
                className={`group hover-lift cursor-pointer glass-card border-0 animate-scale-in`}
                style={{ animationDelay: `${index * 0.2}s` }}
                onClick={() => setActiveCategory(key as any)}
              >
                <CardContent className='p-8 text-center'>
                  <div
                    className={`w-20 h-20 bg-linear-to-br ${config.gradient} rounded-2xl flex items-center justify-center text-3xl text-white mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-premium`}
                  >
                    {config.icon}
                  </div>
                  <h3 className='text-2xl font-bold mb-3 text-foreground'>
                    {config.title}
                  </h3>
                  <p className='text-muted-foreground mb-6 leading-relaxed'>
                    {config.description}
                  </p>
                  <Badge
                    variant='secondary'
                    className='mb-6 bg-brand-orange/10 text-brand-orange'
                  >
                    {
                      featuredProducts.productCounts[
                        key as keyof typeof featuredProducts.productCounts
                      ]
                    }
                    + Products
                  </Badge>
                  <Link href={config.href}>
                    <Button className='w-full btn-primary group-hover:shadow-premium-lg'>
                      Explore Collection
                      <ChevronRight className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform' />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className='py-20 bg-background'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold mb-6 text-gradient'>
              Featured Products
            </h2>

            {/* Premium category tabs */}
            <div className='flex justify-center mb-12'>
              <div className='flex space-x-2 p-2 bg-muted rounded-2xl shadow-premium'>
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setActiveCategory(key as any)}
                    className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      activeCategory === key
                        ? 'bg-white text-brand-primary shadow-premium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
                    }`}
                  >
                    {config.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {featuredProducts[
              activeCategory === 'TYRE'
                ? 'tyres'
                : activeCategory === 'ALLOY_WHEEL'
                ? 'alloyWheels'
                : 'services'
            ]
              ?.slice(0, 8)
              .map((product: any, index: number) => {
                const productId =
                  product.tyre?._id ||
                  product.alloy_wheel?._id ||
                  product.service?._id ||
                  product._id;
                const productType = product.product_category;
                const productLink = `/product/${productId}?type=${productType}`;

                return (
                  <Card
                    key={product._id}
                    className='group hover-lift glass-card border-0 animate-scale-in'
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className='p-6'>
                      <Link href={productLink}>
                        <div className='relative mb-6 cursor-pointer'>
                          {(() => {
                            const imagePath =
                              product.tyre?.productImages?.[0] ||
                              product.main_product?.productImages?.[0] ||
                              product.alloy_wheel?.productImages?.[0] ||
                              product.service?.serviceImage ||
                              product.product_images?.[0];

                            const apiUrl = process.env.NEXT_PUBLIC_API_URL;

                            // Validate that we have both values and that imagePath is a valid string
                            const hasValidImage =
                              imagePath &&
                              apiUrl &&
                              typeof imagePath === 'string' &&
                              imagePath.trim() !== '' &&
                              (imagePath.startsWith('/') ||
                                imagePath.startsWith('http'));

                            if (hasValidImage) {
                              const imageUrl = imagePath.startsWith('http')
                                ? imagePath
                                : `${apiUrl}${imagePath}`;

                              return (
                                <Image
                                  src={imageUrl}
                                  alt='Product image'
                                  width={300}
                                  height={200}
                                  className='w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300'
                                  unoptimized
                                />
                              );
                            }

                            return (
                              <div className='w-full h-48 bg-linear-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center'>
                                <span className='text-5xl opacity-50'>
                                  {categoryConfig[activeCategory].icon}
                                </span>
                              </div>
                            );
                          })()}
                          <Badge className='absolute top-3 right-3 bg-white/90 text-brand-primary backdrop-blur-sm'>
                            {product.product_category}
                          </Badge>
                        </div>
                      </Link>

                      <Link href={productLink}>
                        <h3 className='font-bold text-lg mb-2 line-clamp-2 text-foreground cursor-pointer hover:text-brand-orange transition-colors'>
                          {product.product_category === 'TYRE' ? (
                            <>
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
                            </>
                          ) : (
                            getProductTitle(product)
                          )}
                        </h3>
                      </Link>

                      <p className='text-sm text-muted-foreground mb-4 line-clamp-2'>
                        {getProductSubtitle(product)}
                      </p>

                      <div className='flex justify-between items-center mb-4'>
                        <div className='flex items-center space-x-1'>
                          <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                          <span className='text-sm font-medium'>4.5</span>
                          <span className='text-xs text-muted-foreground'>
                            (124)
                          </span>
                        </div>
                        <span className='text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full'>
                          {product.vendor?.store_name || 'Premium Store'}
                        </span>
                      </div>

                      <div className='flex justify-between items-center'>
                        <div className='flex flex-col'>
                          {product.mrp_price > product.auto_deal_price && (
                            <span className='text-sm text-muted-foreground line-through'>
                              {formatPrice(product.mrp_price)}
                            </span>
                          )}
                          <span className='font-bold text-xl text-brand-orange'>
                            {formatPrice(product.auto_deal_price)}
                          </span>
                        </div>
                        <Link href={productLink}>
                          <Button size='sm' className='btn-primary'>
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>

          <div className='text-center mt-12'>
            <Link href={categoryConfig[activeCategory].href}>
              <Button
                variant='outline'
                size='lg'
                className='px-8 py-4 text-lg hover-lift bg-transparent'
              >
                View All {categoryConfig[activeCategory].title}
                <ChevronRight className='ml-2 h-5 w-5' />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Brands */}
      {featuredProducts.brands && featuredProducts.brands.length > 0 && (
        <section className='py-16 bg-gray-50'>
          <div className='container mx-auto px-4'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl font-bold mb-4'>Popular Brands</h2>
              <p className='text-gray-600'>
                Trusted by millions of customers worldwide
              </p>
            </div>

            <div className='grid grid-cols-3 md:grid-cols-6 gap-6'>
              {featuredProducts.brands.slice(0, 12).map((brand: any) => (
                <div
                  key={brand._id}
                  className='bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow'
                >
                  <div className='text-center'>
                    {brand.brand_image && process.env.NEXT_PUBLIC_API_URL ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}${brand.brand_image}`}
                        alt={brand.name}
                        width={80}
                        height={60}
                        className='mx-auto mb-2'
                      />
                    ) : (
                      <div className='w-20 h-15 bg-gray-100 rounded mx-auto mb-2 flex items-center justify-center'>
                        <span className='text-xs font-medium'>
                          {brand.name}
                        </span>
                      </div>
                    )}
                    <p className='text-sm font-medium'>{brand.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className='py-5 bg-linear-to-b from-muted/30 to-background'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold mb-6 text-gradient'>
              Why Choose AutoDeal4U
            </h2>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
              Experience the difference with our premium services and commitment
              to excellence
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            <div className='text-center group animate-fade-in-up'>
              <div className='w-20 h-20 bg-linear-to-br from-brand-primary to-brand-black rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-premium'>
                <Truck className='h-10 w-10 text-white' />
              </div>
              <h3 className='text-2xl font-bold mb-4 text-foreground'>
                Free Installation
              </h3>
              <p className='text-muted-foreground leading-relaxed'>
                Professional installation at your location or our premium
                service centers with certified technicians
              </p>
              <div className='flex items-center justify-center mt-4 text-brand-primary'>
                <CheckCircle className='w-5 h-5 mr-2' />
                <span className='font-medium'>Certified Professionals</span>
              </div>
            </div>

            <div
              className='text-center group animate-fade-in-up'
              style={{ animationDelay: '0.2s' }}
            >
              <div className='w-20 h-20 bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-premium'>
                <Shield className='h-10 w-10 text-white' />
              </div>
              <h3 className='text-2xl font-bold mb-4 text-foreground'>
                Quality Guarantee
              </h3>
              <p className='text-muted-foreground leading-relaxed'>
                All products come with comprehensive manufacturer warranty and
                our quality assurance promise
              </p>
              <div className='flex items-center justify-center mt-4 text-green-600'>
                <CheckCircle className='w-5 h-5 mr-2' />
                <span className='font-medium'>Lifetime Support</span>
              </div>
            </div>

            <div
              className='text-center group animate-fade-in-up'
              style={{ animationDelay: '0.4s' }}
            >
              <div className='w-20 h-20 bg-linear-to-br from-brand-primary to-brand-black rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-premium'>
                <Users className='h-10 w-10 text-white' />
              </div>
              <h3 className='text-2xl font-bold mb-4 text-foreground'>
                Expert Consultation
              </h3>
              <p className='text-muted-foreground leading-relaxed'>
                Get personalized recommendations from our automotive experts
                with 24/7 support availability
              </p>
              <div className='flex items-center justify-center mt-4 text-brand-primary'>
                <CheckCircle className='w-5 h-5 mr-2' />
                <span className='font-medium'>24/7 Available</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      







    </div>
  );
}
