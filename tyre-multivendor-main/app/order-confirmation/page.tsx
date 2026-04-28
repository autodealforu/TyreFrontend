'use client';

import { Suspense } from 'react';
import OrderConfirmation from '@/components/order-confirmation';
import { Loader2 } from 'lucide-react';

function OrderConfirmationFallback() {
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='text-center'>
        <Loader2 className='h-8 w-8 animate-spin mx-auto mb-4' />
        <p>Loading order confirmation...</p>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<OrderConfirmationFallback />}>
      <OrderConfirmation />
    </Suspense>
  );
}
