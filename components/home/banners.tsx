import React from 'react';
import { IBanner } from './types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';
import { API_URL } from '@/constants';

export default function Banner({ banners }: { banners: IBanner[] }) {
  return (
    <Carousel className='w-full'>
      <CarouselContent>
        {banners?.map((banner) => {
          return (
            <CarouselItem key={banner?.image}>
              <Image
                src={`${API_URL}${banner?.image}`}
                alt='Banner '
                width={0}
                height={0}
                className='w-full h-auto'
                sizes='100vw'
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className=' left-2.5' />
      <CarouselNext className=' right-2.5' />
    </Carousel>
  );
}
