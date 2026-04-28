'use client';

import { Suspense } from 'react';
import RegistrationError from '@/components/registration-error';
import { Loader2 } from 'lucide-react';

function ErrorFallback() {
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='text-center'>
        <Loader2 className='h-8 w-8 animate-spin mx-auto mb-4 text-red-600' />
        <p className='text-gray-600 font-medium'>Loading error page...</p>
      </div>
    </div>
  );
}

export default function RegistrationErrorPage() {
  return (
    <Suspense fallback={<ErrorFallback />}>
      <RegistrationError />
    </Suspense>
  );
}
