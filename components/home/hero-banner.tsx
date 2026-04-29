'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Award,
  ArrowRight,
  Phone,
  Play,
  Volume2,
  VolumeX,
  Search,
  X,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface IBanner {
  _id?: string;
  name?: string;
  banner_type?: 'image' | 'video';
  title?: string;
  subtitle?: string;
  image?: string;
  video?: string;
  product_collection?: {
    _id: string;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function HeroBanner({ banners }: { banners: IBanner[] }) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [tyreWidth, setTyreWidth] = useState('');
  const [aspectRatio, setAspectRatio] = useState('');
  const [rimDiameter, setRimDiameter] = useState('');
  const [filterData, setFilterData] = useState<any>(null);
  const [alloyFilterData, setAlloyFilterData] = useState<any>(null);
  const [searchTab, setSearchTab] = useState<'TYRE' | 'ALLOY_WHEEL'>('TYRE');
  const [alloySize, setAlloySize] = useState('');
  const [alloyWidth, setAlloyWidth] = useState('');
  const [alloyPcd, setAlloyPcd] = useState('');

  // Fetch filter options
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [resTyre, resAlloy] = await Promise.all([
          fetch(`${API_URL}/api/products/website/filters/TYRE`),
          fetch(`${API_URL}/api/products/website/filters/ALLOY_WHEEL`)
        ]);
        const dataTyre = await resTyre.json();
        const dataAlloy = await resAlloy.json();
        if (dataTyre?.data) setFilterData(dataTyre.data);
        if (dataAlloy?.data) setAlloyFilterData(dataAlloy.data);
      } catch (e) {
        console.error('Failed to fetch filters', e);
      }
    };
    fetchFilters();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTab === 'TYRE') {
      if (tyreWidth) params.set('tyreWidth', tyreWidth);
      if (aspectRatio) params.set('aspectRatio', aspectRatio);
      if (rimDiameter) params.set('rimDiameter', rimDiameter);
      router.push(`/tyres?${params.toString()}`);
    } else {
      if (alloySize) params.set('alloyDiameter', alloySize);
      if (alloyWidth) params.set('alloyWidth', alloyWidth);
      if (alloyPcd) params.set('pcd', alloyPcd);
      router.push(`/alloy-wheels?${params.toString()}`);
    }
  };

  const validBanners = banners?.filter(
    (b) => b.banner_type === 'video' && b.video
  ) || [];

  const hasVideoBanner = validBanners.some(
    (b) => b.banner_type === 'video' && b.video
  );

  // Auto-rotate banners every 6 seconds (8s for video)
  useEffect(() => {
    if (validBanners.length <= 1) return;

    const currentBanner = validBanners[currentIndex];
    const interval = currentBanner?.banner_type === 'video' ? 12000 : 6000;

    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % validBanners.length);
        setIsTransitioning(false);
      }, 500);
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, validBanners.length]);

  const goToSlide = useCallback(
    (index: number) => {
      if (index === currentIndex) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(index);
        setIsTransitioning(false);
      }, 500);
    },
    [currentIndex]
  );

  // Inside your HeroBanner component
  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    // Syncing with IntroAnimation (4s total, 3.4s fade starts)
    const timer = setTimeout(() => {
      setIntroFinished(true);
    }, 3800);

    return () => clearTimeout(timer);
  }, []);

  const goToPrev = useCallback(() => {
    const newIndex =
      currentIndex === 0 ? validBanners.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, validBanners.length, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex = (currentIndex + 1) % validBanners.length;
    goToSlide(newIndex);
  }, [currentIndex, validBanners.length, goToSlide]);

  // Fallback: no banners — show static hero
  if (!validBanners.length) {
    return <StaticHero introFinished={introFinished} />;
  }

  const currentBanner = validBanners[currentIndex];
  const isVideo = currentBanner?.banner_type === 'video' && currentBanner?.video;

  return (
    <section
      id='hero-banner'
      className='relative w-full overflow-hidden'
      style={{ height: '85vh', minHeight: '550px', maxHeight: '800px' }}
    >
      {/* Background Media */}
      {isVideo ? (
        <video
          key={`video-${currentIndex}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
          src={`${API_URL}/${currentBanner.video}`}
          crossOrigin="anonymous"
          autoPlay
          loop
          muted={true}
          playsInline
          preload='auto'
        />
      ) : currentBanner?.image ? (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
        >
          <Image
            src={`${API_URL}/${currentBanner.image}`}
            alt={currentBanner.name || 'Banner'}
            fill
            className='object-cover'
            priority
            unoptimized
          />
        </div>
      ) : null}

      {/* Dark gradient overlay for text readability */}
      <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/20 z-1' />
      <div className='absolute inset-0 bg-linear-to-r from-black/50 to-transparent z-1' />

      {/* Content Overlay */}
      <div className='relative z-10 flex items-center h-full'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-5'>
          <div className='max-w-4xl mx-auto text-center'>

            {/* 1. TITLE SECTION (Left to Right) */}
            <motion.div
              key={`title-${currentIndex}`}
              initial={{ x: -200, opacity: 0 }}
              animate={introFinished ? { x: 0, opacity: 1 } : { x: -200, opacity: 0 }}
              transition={{
                duration: 0.9,
                ease: [0.6, 1, 0.9, 1]
              }}
            >
              <Badge className='mb-4 bg-white/10 text-white border-white/20 backdrop-blur-sm text-sm px-4 py-1.5'>
                <Award className='w-4 h-4 mr-2' />
                India&apos;s Premium Tyre Marketplace
              </Badge>

              <h1 className='text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight'>
                {currentBanner?.title || (
                  <>
                    Drive with
                    <span className='block bg-linear-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent'>
                      Confidence & Style
                    </span>
                  </>
                )}
              </h1>
            </motion.div>

            {/* 2. PARAGRAPH (Right to Left) */}
            <motion.div
              key={`para-${currentIndex}`}
              initial={{ x: 200, opacity: 0 }}
              animate={introFinished ? { x: 0, opacity: 1 } : { x: 200, opacity: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.1,
                ease: [0.9, 1, 0.9, 1]
              }}
            >
              <p className='text-base sm:text-lg text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed'>
                {currentBanner?.subtitle ||
                  "Discover premium tyres, precision-crafted alloy wheels, and expert services from India's most trusted automotive brands."}
              </p>
            </motion.div>

            {/* 3. BUTTONS (Fade Up) */}
            <motion.div
              key={`btns-${currentIndex}`}
              initial={{ y: 20, opacity: 0 }}
              animate={introFinished ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.3,
                ease: "easeOut"
              }}
            >
              <div className='flex flex-col sm:flex-row gap-4 mb-8 justify-center items-center'>
                <Link href='/tyres'>
                  <Button
                    size='lg'
                    className='bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-7 text-lg font-bold rounded-2xl shadow-xl shadow-orange-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/40 hover:-translate-y-1'
                  >
                    Explore Products
                    <ArrowRight className='ml-2 h-6 w-6' />
                  </Button>
                </Link>
                <Link href="/contact-us">
                  <Button
                    size='lg'
                    variant='outline'
                    className='px-10 py-7 text-lg font-bold text-white border-white/30 hover:bg-white hover:text-gray-900 backdrop-blur-md bg-white/5 rounded-2xl transition-all duration-300 hover:-translate-y-1'
                  >
                    <Phone className='mr-2 h-6 w-6' />
                    Get Expert Advice
                  </Button>
                </Link>
              </div>

              {/* Find Tyres Button */}
              <div className='relative mb-4'>
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className='inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-black text-lg px-10 py-5 rounded-full shadow-lg shadow-red-600/30 transition-all duration-300 hover:shadow-2xl hover:shadow-red-600/40 hover:-translate-y-1 uppercase tracking-widest'
                >
                  <Search className='w-6 h-6' />
                  Find Products
                  <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${showSearch ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Yokohama Style Search Popup */}
      {showSearch && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
          <div className='absolute inset-0 bg-black/60 backdrop-blur-sm' onClick={() => setShowSearch(false)} />
          <div className='bg-white w-full max-w-6xl shadow-2xl relative z-30 p-8'>
            <div className='flex flex-col items-center border-b border-gray-300 pb-4 mb-8 w-full relative h-12'>
              <div className='flex space-x-12 absolute left-0 bottom-0'>
                <button
                  onClick={() => setSearchTab('TYRE')}
                  className={`text-lg italic font-extrabold uppercase tracking-widest px-4 pb-4 transition-colors ${searchTab === 'TYRE' ? 'text-red-600 border-b-2 border-red-600 translate-y-0.5' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  SEARCH BY TYRE SIZE
                </button>
                <button
                  onClick={() => setSearchTab('ALLOY_WHEEL')}
                  className={`text-lg italic font-extrabold uppercase tracking-widest px-4 pb-4 transition-colors ${searchTab === 'ALLOY_WHEEL' ? 'text-red-600 border-b-2 border-red-600 translate-y-0.5' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  SEARCH BY ALLOY SIZE
                </button>
              </div>
            </div>

            {searchTab === 'TYRE' ? (
              <div className='flex flex-col sm:flex-row gap-6 mb-8 w-full'>
                <div className='relative flex-1'>
                  <select
                    value={tyreWidth}
                    onChange={(e) => setTyreWidth(e.target.value)}
                    className='w-full appearance-none bg-white border-b border-gray-300 px-4 py-3 text-gray-500 text-sm focus:outline-none focus:border-red-600 transition-colors cursor-pointer'
                  >
                    <option value=''>Select Tyre Width (mm)</option>
                    {filterData?.tyreWidths?.map((tw: any) => (
                      <option key={tw._id} value={tw.name}>{tw.name}</option>
                    ))}
                  </select>
                  <ChevronDown className='w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none' />
                </div>
                <div className='relative flex-1'>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className='w-full appearance-none bg-white border-b border-gray-300 px-4 py-3 text-gray-500 text-sm focus:outline-none focus:border-red-600 transition-colors cursor-pointer'
                  >
                    <option value=''>Select Aspect Ratio</option>
                    {filterData?.aspectRatios?.map((ar: any) => (
                      <option key={ar._id} value={ar.name}>{ar.name}</option>
                    ))}
                  </select>
                  <ChevronDown className='w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none' />
                </div>
                <div className='relative flex-1'>
                  <select
                    value={rimDiameter}
                    onChange={(e) => setRimDiameter(e.target.value)}
                    className='w-full appearance-none bg-white border-b border-gray-300 px-4 py-3 text-gray-500 text-sm focus:outline-none focus:border-red-600 transition-colors cursor-pointer'
                  >
                    <option value=''>Select Rim Diameter (inch)</option>
                    {filterData?.rimDiameters?.map((rd: any) => (
                      <option key={rd._id} value={rd.name}>{rd.name}</option>
                    ))}
                  </select>
                  <ChevronDown className='w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none' />
                </div>
              </div>
            ) : (
              <div className='flex flex-col sm:flex-row gap-6 mb-8 w-full'>
                <div className='relative flex-1'>
                  <select
                    value={alloySize}
                    onChange={(e) => setAlloySize(e.target.value)}
                    className='w-full appearance-none bg-white border-b border-gray-300 px-4 py-3 text-gray-500 text-sm focus:outline-none focus:border-red-600 transition-colors cursor-pointer'
                  >
                    <option value=''>Select Rim Diameter (inch)</option>
                    {alloyFilterData?.diameters?.map((rd: any) => (
                      <option key={rd._id} value={rd.name}>{rd.name}</option>
                    ))}
                  </select>
                  <ChevronDown className='w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none' />
                </div>
                <div className='relative flex-1'>
                  <select
                    value={alloyWidth}
                    onChange={(e) => setAlloyWidth(e.target.value)}
                    className='w-full appearance-none bg-white border-b border-gray-300 px-4 py-3 text-gray-500 text-sm focus:outline-none focus:border-red-600 transition-colors cursor-pointer'
                  >
                    <option value=''>Select Alloy Width (J)</option>
                    {alloyFilterData?.widths?.map((w: any) => (
                      <option key={w._id} value={w.name}>{w.name}</option>
                    ))}
                  </select>
                  <ChevronDown className='w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none' />
                </div>
                <div className='relative flex-1'>
                  <select
                    value={alloyPcd}
                    onChange={(e) => setAlloyPcd(e.target.value)}
                    className='w-full appearance-none bg-white border-b border-gray-300 px-4 py-3 text-gray-500 text-sm focus:outline-none focus:border-red-600 transition-colors cursor-pointer'
                  >
                    <option value=''>Select PCD</option>
                    {alloyFilterData?.pcds?.map((pcd: any) => (
                      <option key={pcd._id} value={pcd.name}>{pcd.name}</option>
                    ))}
                  </select>
                  <ChevronDown className='w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none' />
                </div>
              </div>
            )}

            <div className='flex items-center gap-12 justify-center pb-2'>
              <button
                onClick={handleSearch}
                className='inline-flex items-center gap-2 bg-[#dc3545] hover:bg-[#c82333] text-white italic font-extrabold px-12 py-3 rounded-full transition-all duration-300 uppercase tracking-widest text-lg'
              >
                FIND {searchTab === 'TYRE' ? 'TYRES' : 'ALLOYS'}
              </button>
              <button
                onClick={() => setShowSearch(false)}
                className='text-[#dc3545] hover:text-[#c82333] italic font-extrabold text-lg uppercase tracking-widest transition-colors'
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      {validBanners.length > 1 && (
        <>
          {/* Arrow buttons */}
          <button
            onClick={goToPrev}
            className='absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300'
            aria-label='Previous banner'
          >
            <ChevronLeft className='w-6 h-6' />
          </button>
          <button
            onClick={goToNext}
            className='absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300'
            aria-label='Next banner'
          >
            <ChevronRight className='w-6 h-6' />
          </button>

          {/* Dot indicators */}
          <div className='absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2'>
            {validBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                  ? 'w-8 bg-orange-500'
                  : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Mute/Unmute for video */}
      {isVideo && (
        <button
          onClick={() => setIsMuted(!isMuted)}
          className='absolute bottom-8 right-8 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300'
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX className='w-5 h-5' />
          ) : (
            <Volume2 className='w-5 h-5' />
          )}
        </button>
      )}

      {/* Scroll indicator */}
      <div className='absolute bottom-20 left-1/2 -translate-x-1/2 z-10 animate-bounce'>
        <ChevronRight className='w-6 h-6 text-white/60 rotate-90' />
      </div>
    </section>
  );
}

// Fallback static hero when no banners exist
function StaticHero({ introFinished }: { introFinished: boolean }) {
  return (
    <section className='relative min-h-screen flex items-center justify-center overflow-hidden'>
      <div className='absolute inset-0 bg-linear-to-br from-gray-900 via-gray-800 to-black' />
      <div className='absolute inset-0 opacity-10'>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse' />
        <div className='absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-500 rounded-full blur-3xl animate-pulse' />
      </div>

      <div className='container mx-auto px-4 py-20 relative z-10'>
        <div className='max-w-4xl mx-auto text-center text-white'>
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={introFinished ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Badge className='mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm px-6 py-2'>
              <Award className='w-4 h-4 mr-2' />
              India&apos;s Premium Tyre Marketplace
            </Badge>

            <h1 className='text-5xl lg:text-7xl font-black mb-8 leading-tight'>
              Drive with
              <span className='block bg-linear-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent'>
                Confidence & Style
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={introFinished ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className='text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed font-medium'>
              Discover premium tyres, precision-crafted alloy wheels, and expert
              services from India&apos;s most trusted automotive brands.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={introFinished ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className='flex flex-col sm:flex-row gap-5 justify-center mb-16'>
              <Link href='/tyres'>
                <Button
                  size='lg'
                  className='bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-7 text-xl font-bold rounded-2xl shadow-xl shadow-orange-500/20'
                >
                  Explore Products
                  <ArrowRight className='ml-2 h-6 w-6' />
                </Button>
              </Link>
              <Button
                size='lg'
                variant='outline'
                className='px-10 py-7 text-xl font-bold text-white border-white/20 hover:bg-white hover:text-gray-900 backdrop-blur-sm bg-white/5 rounded-2xl'
              >
                <Phone className='mr-2 h-6 w-6' />
                Get Expert Advice
              </Button>
            </div>

            <div className='grid grid-cols-3 gap-12 max-w-3xl mx-auto border-t border-white/10 pt-12'>
              <div className='text-center'>
                <div className='text-4xl font-black mb-2 text-[#fca311]'>50K+</div>
                <div className='text-sm text-gray-400 uppercase tracking-widest font-bold'>Happy Customers</div>
              </div>
              <div className='text-center'>
                <div className='text-4xl font-black mb-2 text-white'>500+</div>
                <div className='text-sm text-gray-400 uppercase tracking-widest font-bold'>Premium Brands</div>
              </div>
              <div className='text-center'>
                <div className='text-4xl font-black mb-2 text-[#fca311]'>24/7</div>
                <div className='text-sm text-gray-400 uppercase tracking-widest font-bold'>Expert Support</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className='absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce'>
        <ChevronRight className='w-6 h-6 text-white rotate-90' />
      </div>
    </section>
  );
}
