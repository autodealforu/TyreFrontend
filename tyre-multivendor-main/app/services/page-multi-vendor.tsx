'use client';

import MultiVendorProductListing from '@/components/multi-vendor-product-listing';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ServicesPageContent() {
  const searchParams = useSearchParams();
  const searchParamsObj = Object.fromEntries(searchParams.entries());

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-linear-to-br from-[#14213d] via-[#1a2847] to-[#14213d] text-white'>
        <div className="absolute inset-0 bg-[url('/images/service-pattern.svg')] opacity-5"></div>
        <div className='absolute inset-0 bg-gradient-to-r from-[#fca311]/10 to-transparent'></div>

        <div className='relative container mx-auto px-4 py-16'>
          <div className='max-w-4xl mx-auto text-center'>
            <h1 className='text-4xl md:text-6xl font-bold mb-6 leading-tight'>
              Professional <span className='text-[#fca311]'>Services</span>
            </h1>
            <p className='text-xl md:text-2xl mb-8 text-gray-300 leading-relaxed'>
              Compare service providers and find the best deals near you
            </p>
          </div>
        </div>
      </section>

      {/* Multi-Vendor Product Listing */}
      <MultiVendorProductListing
        productType='SERVICE'
        searchParams={searchParamsObj}
      />
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ServicesPageContent />
    </Suspense>
  );
}
