'use client';

import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface IBanner {
  _id?: string;
  name?: string;
  banner_type?: string;
  title?: string;
  subtitle?: string;
  image?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function GallerySection({ banners }: { banners: IBanner[] }) {
  const [selectedImage, setSelectedImage] = useState<IBanner | null>(null);

  // Filter gallery-type banners only
  const galleryImages = banners?.filter(
    (b) => b.banner_type === 'gallery' && b.image
  ) || [];

  if (!galleryImages.length) return null;

  return (
    <>
      <section className='py-20 px-20 bg-linear-to-b from-background to-muted/30'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-14'>
            <Badge className='mb-4 bg-orange-500/10 text-orange-600 border-orange-500/20 text-sm px-4 py-1.5'>
              Our Gallery
            </Badge>
            <h2 className='text-4xl font-bold mb-4 text-gradient'>
              Explore Our Work
            </h2>
            <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
              Browse through our collection of premium tyres, alloy wheels, and
              expert installations
            </p>
          </div>

          {/* Uniform Grid */}
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4'>
            {galleryImages.map((item, index) => (
              <div
                key={item._id || index}
                className='group relative overflow-hidden rounded-xl cursor-pointer aspect-4/3 bg-gray-100'
                onClick={() => setSelectedImage(item)}
              >
                <img
                  src={`${API_URL}${item.image}`}
                  alt={item.name || item.title || `Gallery ${index + 1}`}
                  className='w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-110'
                />
                {/* Hover overlay */}
                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 rounded-xl flex items-center justify-center'>
                  <div className='opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 text-center'>
                    <ZoomIn className='w-8 h-8 text-white mx-auto mb-2' />
                    {item.title && (
                      <p className='text-white font-semibold text-sm px-4'>
                        {item.title}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className='fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4'
          onClick={() => setSelectedImage(null)}
        >
          <button
            className='absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all z-50'
            onClick={() => setSelectedImage(null)}
          >
            <X className='w-5 h-5' />
          </button>

          <div
            className='max-w-5xl max-h-[90vh] relative'
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`${API_URL}${selectedImage.image}`}
              alt={selectedImage.name || selectedImage.title || 'Gallery'}
              className='max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl'
            />
            {(selectedImage.title || selectedImage.subtitle) && (
              <div className='absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-6 rounded-b-lg'>
                {selectedImage.title && (
                  <h3 className='text-xl font-bold text-white'>
                    {selectedImage.title}
                  </h3>
                )}
                {selectedImage.subtitle && (
                  <p className='text-gray-300 mt-1'>{selectedImage.subtitle}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
