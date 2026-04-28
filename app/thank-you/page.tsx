'use client';

import { Suspense } from 'react';
import ThankYou from '@/components/thank-you';
import { Loader2 } from 'lucide-react';

function ThankYouFallback() {
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='text-center'>
        <Loader2 className='h-8 w-8 animate-spin mx-auto mb-4 text-[#14213d]' />
        <p className='text-gray-600 font-medium'>Loading thank you page...</p>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<ThankYouFallback />}>
      <ThankYou />
    </Suspense>
  );
}
