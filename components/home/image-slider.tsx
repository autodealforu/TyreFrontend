'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface IBanner {
  _id?: string;
  name?: string;
  banner_type?: 'image' | 'video';
  title?: string;
  subtitle?: string;
  image?: string;
  video?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function ImageSlider({ banners }: { banners: IBanner[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Filter only image-type banners (exclude video and gallery banners)
  const imageBanners = banners?.filter(
    (b) => b.image && b.banner_type === 'image'
  ) || [];

  // Auto-scroll every 4 seconds (pause on hover)
  useEffect(() => {
    if (imageBanners.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % imageBanners.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [imageBanners.length, isHovered]);

  const goToPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? imageBanners.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % imageBanners.length);
  };

  if (!imageBanners.length) return null;

  return (
    <section
      className='relative w-full  bg-white overflow-hidden'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slider Container */}
      <div className='relative w-full h-full overflow-hidden object-cover' >
        <div
          ref={sliderRef}
          className='flex transition-transform duration-700 ease-in-out'
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {imageBanners.map((banner, index) => (
            <div
              key={banner._id || index}
              className='w-full shrink-0 relative'
            >
              <img
                src={`${API_URL}${banner.image}`}
                alt={banner.name || banner.title || `Banner ${index + 1}`}
                className='w-full h-auto block object-cover'
                style={{ maxHeight: '580px' }}
              />
              {/* Gradient overlay */}
              <div className='absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent' />

              {/* Banner text overlay */}
              {(banner.title || banner.subtitle) && (
                <div className='absolute inset-0 flex items-center justify-center text-center px-4'>
                  <div>
                    {banner.title && (
                      <h3 className='text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-lg'>
                        {banner.title}
                      </h3>
                    )}
                    {banner.subtitle && (
                      <p className='text-sm sm:text-base text-gray-200 max-w-xl mx-auto drop-shadow-md'>
                        {banner.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        {imageBanners.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className='absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white hover:bg-black/50 transition-all duration-300'
              style={{ opacity: isHovered ? 1 : 0 }}
              aria-label='Previous slide'
            >
              <ChevronLeft className='w-5 h-5' />
            </button>
            <button
              onClick={goToNext}
              className='absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white hover:bg-black/50 transition-all duration-300'
              style={{ opacity: isHovered ? 1 : 0 }}
              aria-label='Next slide'
            >
              <ChevronRight className='w-5 h-5' />
            </button>
          </>
        )}

        {/* Dot indicators at bottom */}
        {imageBanners.length > 1 && (
          <div className='absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5'>
            {imageBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-6 bg-orange-500'
                    : 'w-1.5 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
