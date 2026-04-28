'use client';

import { useSearchParams } from 'next/navigation';
import {
  AlertCircle,
  Phone,
  ArrowLeft,
  Mail,
  ShieldAlert,
  Headset,
  CornerUpLeft
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function RegistrationError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('message') || 'User already exists, Kindly contact to our customer service';

  return (
    <div className='min-h-screen bg-white flex items-center justify-center p-4'>
      <div className='max-w-xl w-full text-center space-y-8'>
        {/* Icon Header */}
        <div className='relative inline-block'>
           <div className='absolute inset-0 bg-red-100 rounded-full scale-150 blur-2xl opacity-50'></div>
           <div className='relative bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto border-2 border-red-100 shadow-sm'>
              <ShieldAlert className='h-12 w-12 text-red-600' />
           </div>
        </div>

        {/* Content */}
        <div className='space-y-4'>
          <h1 className='text-3xl font-extrabold text-gray-900 tracking-tight'>Registration Problem</h1>
          <p className='text-gray-500 text-lg max-w-md mx-auto leading-relaxed'>
             <span className='font-bold text-red-600'>{error}</span>
          </p>
        </div>

        {/* Support Card */}
        <div className='bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6'>
           <div className='flex items-center justify-center gap-2 text-slate-400'>
              <Headset className='h-5 w-5' />
              <span className='text-sm font-bold uppercase tracking-widest'>Customer Support</span>
           </div>
           
           <p className='text-slate-600 text-sm'>
              It looks like you already have an account with us. To prevent duplicate registrations or for security reasons, please reach out to our team to help you recover your access or approve your application.
           </p>

           <div className='grid sm:grid-cols-2 gap-4'>
              <Button asChild className='bg-[#14213d] hover:bg-[#14213d]/90 py-6 rounded-2xl font-bold'>
                 <Link href='/contact-us'>
                    <Mail className='h-4 w-4 mr-2' />
                    Contact Support
                 </Link>
              </Button>
              <Button asChild variant='outline' className='border-slate-200 py-6 rounded-2xl font-bold text-slate-700 hover:bg-slate-100'>
                 <Link href='/register-as-vendor'>
                    <CornerUpLeft className='h-4 w-4 mr-2' />
                    Try Again
                 </Link>
              </Button>
           </div>
        </div>

        {/* Back Link */}
        <div>
           <Button asChild variant='ghost' className='text-slate-400 hover:text-slate-900'>
              <Link href='/'>
                 <ArrowLeft className='h-4 w-4 mr-2' />
                 Back to Homepage
              </Link>
           </Button>
        </div>
      </div>
    </div>
  );
}
