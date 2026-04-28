'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
   CheckCircle,
   Truck,
   Download,
   Home,
   MapPin,
   Package,
   Calendar,
   ChevronRight,
   Loader2,
   Phone,
   Shield,
   Heart,
   ExternalLink
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
   Breadcrumb,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbPage,
   BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import { Order } from '@/types/checkout';
import { getOrderById } from '@/actions/order.action';
import { API_URL } from '@/constants';

// Helper function to construct proper image URLs
const getImageUrl = (imagePath: string | undefined): string => {
   if (!imagePath) {
      return '/default-image.png';
   }

   if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
   }

   const baseUrl = API_URL || 'http://localhost:9042';
   const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
   return `${baseUrl}/${cleanPath}`;
};

export default function ThankYou() {
   const searchParams = useSearchParams();
   const orderId = searchParams.get('orderId');

   const [order, setOrder] = useState<Order | null>(null);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const loadOrderData = async () => {
         if (!orderId) {
            setIsLoading(false);
            return;
         }

         try {
            const result = await getOrderById(orderId);
            if (result.success && result.order) {
               setOrder(result.order);
            }
         } catch (error) {
            console.error('Error loading order:', error);
         } finally {
            setIsLoading(false);
         }
      };

      loadOrderData();
   }, [orderId]);

   if (isLoading) {
      return (
         <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
            <div className='text-center'>
               <Loader2 className='h-8 w-8 animate-spin mx-auto mb-4 text-[#14213d]' />
               <p className='text-gray-600'>Loading your order details...</p>
            </div>
         </div>
      );
   }

   if (!order) {
      return (
         <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
            <div className='text-center px-4'>
               <div className='bg-white p-8 rounded-2xl shadow-xl max-w-md mx-auto'>
                  <Package className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                  <h2 className='text-2xl font-bold mb-2 text-[#14213d]'>Order not found</h2>
                  <p className='text-gray-500 mb-6'>
                     The order you're looking for doesn't exist or has been removed.
                  </p>
                  <Button asChild className='w-full bg-[#14213d] hover:bg-[#14213d]/90'>
                     <Link href='/'>Go to Home</Link>
                  </Button>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className='min-h-screen bg-[#f8f9fa]'>
         <div className='container mx-auto px-4 py-8 lg:py-12'>
            <div className='max-w-4xl mx-auto'>
               {/* Main Success Card */}
               <div className='bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 mb-8'>
                  <div className='bg-[#14213d] p-8 lg:p-12 text-center relative overflow-hidden'>
                     {/* Decorative elements */}
                     <div className='absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none'>
                        <div className='absolute -top-24 -left-24 w-64 h-64 bg-[#fca311] rounded-full blur-3xl'></div>
                        <div className='absolute -bottom-24 -right-24 w-64 h-64 bg-[#fca311] rounded-full blur-3xl'></div>
                     </div>

                     <div className='inline-flex items-center justify-center w-20 h-20 bg-[#fca311] rounded-full mb-6 shadow-xl animate-bounce-slow'>
                        <CheckCircle className='h-10 w-10 text-[#14213d]' />
                     </div>
                     <h1 className='text-3xl lg:text-5xl font-black text-white mb-4 tracking-tight uppercase'>
                        Thank You for Shopping, <br />
                        <span className='text-[#fca311]'>Drive Safely</span>
                     </h1>
                     <p className='text-blue-100/80 text-lg max-w-lg mx-auto font-medium'>
                        Your order <span className='text-white font-bold'>#{order.order_id}</span> has been confirmed.
                        We're getting it ready for delivery.
                     </p>
                  </div>

                  <CardContent className='p-8 lg:p-12'>
                     <div className='grid md:grid-cols-2 gap-12'>
                        {/* Order Info Left */}
                        <div className='space-y-8'>
                           <div>
                              <h3 className='text-sm font-bold text-gray-400 uppercase tracking-widest mb-4'>Order Information</h3>
                              <div className='space-y-4'>
                                 <div className='flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100'>
                                    <div className='w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm'>
                                       <Calendar className='h-5 w-5 text-[#14213d]' />
                                    </div>
                                    <div>
                                       <p className='text-xs text-gray-500 font-bold uppercase'>Date</p>
                                       <p className='text-[#14213d] font-bold'>{new Date(order.order_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                 </div>
                                 <div className='flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100'>
                                    <div className='w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm'>
                                       <MapPin className='h-5 w-5 text-[#14213d]' />
                                    </div>
                                    <div>
                                       <p className='text-xs text-gray-500 font-bold uppercase'>Delivery To</p>
                                       <p className='text-[#14213d] font-bold truncate max-w-[200px]'>{order.customer.name}</p>
                                       <p className='text-xs text-gray-500 truncate max-w-[200px]'>{order.shipping_address.city}, {order.shipping_address.pin}</p>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <div>
                              <h3 className='text-sm font-bold text-gray-400 uppercase tracking-widest mb-4'>Need Assistance?</h3>
                              <div className='bg-[#fca311]/10 border border-[#fca311]/20 rounded-2xl p-6'>
                                 <p className='text-[#14213d]/80 text-sm mb-4 leading-relaxed'>
                                    If you have any questions about your order, our dedicated support team is here to help you 24/7.
                                 </p>
                                 <div className='flex flex-wrap gap-3'>
                                    <Link href="/contact-us">
                                       <Button variant='outline' size='sm' className='rounded-full border-[#14213d] text-[#14213d] hover:bg-[#14213d] hover:text-white transition-all'>
                                          <Phone className='h-4 w-4 mr-2' />
                                          Contact Support
                                       </Button>
                                    </Link>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Order Info Right - Summary */}
                        <div className='bg-[#14213d] rounded-3xl p-8 text-white shadow-xl flex flex-col justify-between'>
                           <div>
                              <div className='flex items-center justify-between mb-8 pb-4 border-b border-white/10'>
                                 <h3 className='font-bold text-xl'>Order Summary</h3>
                                 <Badge className='bg-[#fca311] text-[#14213d] hover:bg-[#fca311] font-bold'>
                                    {order.products.length} Item{order.products.length > 1 ? 's' : ''}
                                 </Badge>
                              </div>

                              <div className='space-y-4 mb-8'>
                                 {order.products.map((item, idx) => (
                                    <div key={idx} className='flex items-center justify-between gap-4'>
                                       <div className='flex items-center gap-3 min-w-0'>
                                          <div className='w-12 h-12 bg-white/10 rounded-lg overflow-hidden flex-shrink-0'>
                                             <Image
                                                src={getImageUrl(item.image)}
                                                alt={item.name}
                                                width={48}
                                                height={48}
                                                className='object-cover'
                                             />
                                          </div>
                                          <div className='min-w-0'>
                                             <p className='text-sm font-bold truncate'>{item.name}</p>
                                             <p className='text-xs text-white/50'>Qty: {item.quantity}</p>
                                          </div>
                                       </div>
                                       <p className='font-bold text-sm flex-shrink-0'>₹{((item.sale_price || item.regular_price || 0) * item.quantity).toLocaleString('en-IN')}</p>
                                    </div>
                                 ))}
                              </div>
                           </div>

                           <div className='space-y-4'>
                              <Separator className='bg-white/10' />
                              <div className='space-y-2'>
                                 <div className='flex justify-between text-sm text-white/60'>
                                    <span>Subtotal</span>
                                    <span>₹{order.sub_total.toLocaleString('en-IN')}</span>
                                 </div>
                                 <div className='flex justify-between text-sm text-white/60'>
                                    <span>Shipping</span>
                                    <span className='text-green-400 font-bold'>FREE</span>
                                 </div>
                              </div>
                              <div className='flex justify-between items-center bg-white/5 p-4 rounded-xl'>
                                 <span className='font-bold'>Total Paid</span>
                                 <span className='text-2xl font-black text-[#fca311]'>₹{order.total_amount.toLocaleString('en-IN')}</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     <Separator className='my-12' />

                     <div className='flex flex-col sm:flex-row items-center justify-between gap-6'>
                        <div className='flex items-center gap-4 text-gray-500'>
                           <div className='w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center'>
                              <Shield className='h-6 w-6' />
                           </div>
                           <div>
                              <p className='text-sm font-bold text-[#14213d]'>Secure Shopping</p>
                              <p className='text-xs'>100% Protection with Autodeal4U</p>
                           </div>
                        </div>
                        <div className='flex gap-4 w-full sm:w-auto'>
                           <Button asChild variant='outline' className='rounded-full border-[#14213d] text-[#14213d] flex-1 sm:flex-none py-6 px-10 font-bold hover:bg-[#14213d]/5'>
                              <Link href='/account/orders'>Track Order</Link>
                           </Button>
                           <Button asChild className='bg-[#14213d] hover:bg-[#14213d]/90 rounded-full flex-1 sm:flex-none py-6 px-10 font-bold'>
                              <Link href='/'>Continue Shopping</Link>
                           </Button>
                        </div>
                     </div>
                  </CardContent>
               </div>

               {/* Social Proof / Trust Footer */}
               <div className='text-center space-y-4'>
                  <div className='flex items-center justify-center gap-2 text-gray-400 font-medium'>
                     <Heart className='h-4 w-4 text-red-500 fill-red-500' />
                     <span>Loved by over 10,000+ happy car owners in India</span>
                  </div>
                  <p className='text-gray-400 text-xs'>
                     &copy; 2026 Autodeal4U. All rights reserved.
                     <Link href='/privacy-policy' className='hover:text-[#14213d] ml-2 underline'>Privacy</Link>
                     <Link href='/terms-conditions' className='hover:text-[#14213d] ml-2 underline'>Terms</Link>
                  </p>
               </div>
            </div>
         </div>

         <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
      `}</style>
      </div>
   );
}
