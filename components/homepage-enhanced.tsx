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
  CheckCircle,
  Car,
  Settings,
  Cog,
  Wrench,
  Award,
  Headset,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import HeroBanner from '@/components/home/hero-banner';
import ImageSlider from '@/components/home/image-slider';
import GallerySection from '@/components/home/gallery-section';
import VideoCards from '@/components/home/video-cards';
import StoreLocatorMap from '@/components/home/store-locator-map';

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


  // style="background:linear-gradient(135deg, #14213d 0%, #fca311 100%)"
  const categoryConfig = {
    TYRE: {
      title: 'Premium Tyres',
      description: 'High-performance tyres for every journey',
      icon: <Car className='w-10 h-10' />,
      gradient: 'bg-[linear-gradient(135deg,#14213d_0%,#fca311_100%)]',
      href: '/tyres',
    },
    ALLOY_WHEEL: {
      title: 'Alloy Wheels',
      description: 'Precision-crafted wheels for style & performance',
      icon: <Settings className='w-10 h-10' />,
      gradient: 'bg-[linear-gradient(135deg,#14213d_0%,#fca311_100%)]',
      href: '/alloy-wheels',
    },
    SERVICE: {
      title: 'Expert Services',
      description: 'Professional installation & maintenance',
      icon: <Wrench className='w-10 h-10' />,
      gradient: 'bg-[linear-gradient(135deg,#14213d_0%,#fca311_100%)]',
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
      {/* Dynamic Video/Image Banner Hero Section */}
      <HeroBanner banners={banners} />

      {/* Animated Ticker Tape Separator */}
      <div className="relative w-full overflow-hidden bg-[#14213d] border-y border-[#fca311]/50 py-2.5 z-20 shadow-[0_0_15px_rgba(0,0,0,0.5)]" style={{ marginTop: '-1px', marginBottom: '-1px' }}>
        <style>{`
          @keyframes infiniteScroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-infinite-scroll {
            animation: infiniteScroll 25s linear infinite;
            display: flex;
            width: max-content;
          }
        `}</style>
        <div className="animate-infinite-scroll flex whitespace-nowrap text-[#fca311] font-black uppercase tracking-[0.15em] text-xs md:text-sm">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex items-center mr-16">
              <span className="mr-8 text-[#dc3545]">⚡</span>
              <span>Accelerate your purchase with more offers</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Image Slider */}
      <ImageSlider banners={banners} />

      <section className='py-10 px-4 md:px-20 bg-linear-to-b from-muted/50 to-background'>
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

      <section className='py-3 px-4 md:px-20 bg-background'>
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

                            const hasValidImage =
                              imagePath &&
                              typeof imagePath === 'string' &&
                              imagePath.trim() !== '' &&
                              (imagePath.startsWith('/') ||
                                imagePath.startsWith('http')) &&
                              !imagePath.includes('placeholder.com');

                            if (hasValidImage) {
                              const cleanPath = imagePath.replace(/\\/g, '/');
                              const imageUrl = cleanPath.startsWith('http')
                                ? cleanPath
                                : `${apiUrl}${cleanPath}`;

                              return (
                                <img
                                  src={imageUrl}
                                  alt='Product image'
                                  className='w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300'
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                    (e.target as HTMLImageElement).parentElement!.innerHTML = `<div class="w-full h-48 bg-linear-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center"><span class="text-5xl opacity-50">${categoryConfig[activeCategory].icon}</span></div>`;
                                  }}
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
                        <h3 className='font-bold text-lg mb-2 line-clamp-2 break-words text-foreground cursor-pointer hover:text-brand-orange transition-colors'>
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

                      <p className='text-sm text-muted-foreground mb-4 line-clamp-2 break-words'>
                        {getProductSubtitle(product)}
                      </p>

                      <div className='flex flex-wrap justify-between items-center mb-4 gap-2'>
                        <div className='flex items-center space-x-1 shrink-0'>
                          <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                          <span className='text-sm font-medium'>4.5</span>
                          <span className='text-xs text-muted-foreground'>
                            (124)
                          </span>
                        </div>
                        <span className='text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full truncate max-w-[120px]'>
                          {product.vendor?.store_name || 'Premium Store'}
                        </span>
                      </div>

                      <div className='flex flex-wrap justify-between items-center gap-3'>
                        <div className='flex flex-col shrink-0'>
                          {product.mrp_price > product.auto_deal_price && (
                            <span className='text-sm text-muted-foreground line-through'>
                              {formatPrice(product.mrp_price)}
                            </span>
                          )}
                          <span className='font-bold text-xl text-brand-orange'>
                            {formatPrice(product.auto_deal_price)}
                          </span>
                        </div>
                        <Link href={productLink} className='shrink-0 w-full xl:w-auto mt-2 xl:mt-0'>
                          <Button size='sm' className='btn-primary w-full'>
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
        <section className='py-16  bg-gray-50'>
          <div className='container mx-auto px-4'>
            <div className='text-center mb-12'>
              <h2 className='text-4xl font-bold mb-4 text-gradient '>Popular Brands</h2>
              <p className='text-gray-600 text-xl'>
                Trusted by millions of customers worldwide
              </p>
            </div>

            <div className='overflow-hidden relative w-full'>
              <div className='flex gap-6 animate-marquee w-max'>
                {[...featuredProducts.brands, ...featuredProducts.brands].map((brand: any, index: number) => (
                  <div
                    key={`${brand._id}-${index}`}
                    className='w-48 h-32 shrink-0 flex items-center justify-center opacity-100 hover:scale-110 transition-all duration-300 mx-4 cursor-pointer'
                  >
                    {brand.brand_image && process.env.NEXT_PUBLIC_API_URL ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}${brand.brand_image}`}
                        alt={brand.name}
                        width={192}
                        height={128}
                        className='object-contain w-full h-full'
                      />
                    ) : (
                      <span className='text-lg font-bold text-gray-400'>
                        {brand.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Gallery Section */}
      <GallerySection banners={banners} />

      {/* YouTube Video Cards */}
      <VideoCards banners={banners} />

      {/* Store Locator Indian Map */}
      <StoreLocatorMap />

      <section className='pb-20 px-4 md:px-20 bg-linear-to-b from-muted/30 to-background'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold mb-6 text-gradient'>
              Why Choose Us?
            </h2>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
              Experience the difference with our premium services and commitment
              to excellence
            </p>
          </div>



          <div className='grid md:grid-cols-3 gap-10 mt-12'>
            <div className='text-center group animate-fade-in-up hover:-translate-y-2 transition-all duration-300'>
              <div className='w-24 h-24 bg-linear-to-br from-[#14213d] to-[#fca311] border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:border-[#fca311] transition-all duration-500 shadow-xl group-hover:shadow-[0_0_20px_rgba(252,163,17,0.2)] relative overflow-hidden'>
                <div className="absolute inset-0 bg-linear-to-br from-[#14213d]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Truck className='h-10 w-10 text-[#ffff] group-hover:text-[#fca311] transition-colors duration-500 z-10' strokeWidth={1.5} />
              </div>
              <h3 className='text-2xl font-bold mb-4 text-[#14213d]'>
                Free Installation
              </h3>
              <p className='text-gray-600 mb-6 leading-relaxed'>
                Professional installation at your location or our premium
                service centers with certified technicians
              </p>
              <div className='flex items-center justify-center text-[#14213d] font-semibold bg-gray-100 py-2 px-4 rounded-full w-max mx-auto'>
                <CheckCircle className='w-4 h-4 mr-2 text-[#fca311]' />
                <span className='text-sm'>Certified Professionals</span>
              </div>
            </div>

            <div
              className='text-center group animate-fade-in-up hover:-translate-y-2 transition-all duration-300 delay-100'
              style={{ animationDelay: '0.2s' }}
            >
              <div className='w-24 h-24 bg-linear-to-br from-[#14213d] to-[#fca311] border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:border-[#fca311] transition-all duration-500 shadow-xl group-hover:shadow-[0_0_20px_rgba(252,163,17,0.2)] relative overflow-hidden'>
               <div className="absolute inset-0 bg-linear-to-br from-[#14213d]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Shield className='h-10 w-10 text-[#ffff] group-hover:text-[#fca311] transition-colors duration-500 z-10' strokeWidth={1.5} />
              </div>
              <h3 className='text-2xl font-bold mb-4 text-[#14213d]'>
                Quality Guarantee
              </h3>
              <p className='text-gray-600 mb-6 leading-relaxed'>
                All products come with comprehensive manufacturer warranty and
                our quality assurance promise
              </p>
              <div className='flex items-center justify-center text-[#14213d] font-semibold bg-gray-100 py-2 px-4 rounded-full w-max mx-auto border border-gray-200'>
                <CheckCircle className='w-4 h-4 mr-2 text-[#fca311]' />
                <span className='text-sm'>Lifetime Support</span>
              </div>
            </div>

            <div
              className='text-center group animate-fade-in-up hover:-translate-y-2 transition-all duration-300 delay-200'
              style={{ animationDelay: '0.4s' }}
            >
                 <div className='w-24 h-24 bg-linear-to-br from-[#14213d] to-[#fca311] border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:border-[#fca311] transition-all duration-500 shadow-xl group-hover:shadow-[0_0_20px_rgba(252,163,17,0.2)] relative overflow-hidden'>
                <div className="absolute inset-0 bg-linear-to-br from-[#14213d]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Users className='h-10 w-10 text-[#ffff] group-hover:text-[#fca311] transition-colors duration-500 z-10' strokeWidth={1.5} />
              </div>
              <h3 className='text-2xl font-bold mb-4 text-[#14213d]'>
                Expert Consultation
              </h3>
              <p className='text-gray-600 mb-6 leading-relaxed'>
                Get personalized recommendations from our automotive experts
                with 24/7 support availability
              </p>
              <div className='flex items-center justify-center text-[#14213d] font-semibold bg-gray-100 py-2 px-4 rounded-full w-max mx-auto'>
                <CheckCircle className='w-4 h-4 mr-2 text-[#fca311]' />
                <span className='text-sm'>24/7 Available</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}