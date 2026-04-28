'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface IBanner {
  _id?: string;
  name?: string;
  banner_type?: string;
  title?: string;
  subtitle?: string;
  image?: string;
  youtube_url?: string;
}

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function VideoCards({ banners }: { banners: IBanner[] }) {
  const youtubeVideos =
    banners?.filter((b) => b.banner_type === 'youtube' && b.youtube_url) || [];

  if (!youtubeVideos.length) return null;

  return (
    <section className='py-20 px-20 bg-linear-to-b from-muted/30 to-background'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-14'>
          <Badge className='mb-4 bg-red-500/10 text-red-600 border-red-500/20 text-sm px-4 py-1.5'>
            <Play className='w-4 h-4 mr-2 fill-current' />
            Watch Our Videos
          </Badge>
          <h2 className='text-4xl font-bold mb-4 text-gradient '>
            Featured Videos
          </h2>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            Check out our latest videos, reviews, and installations
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {youtubeVideos.map((video, index) => {
            const videoId = getYouTubeId(video.youtube_url || '');
            if (!videoId) return null;
            return <VideoCard key={video._id || index} videoId={videoId} url={video.youtube_url!} />;
          })}
        </div>
      </div>
    </section>
  );
}

function VideoCard({ videoId, url }: { videoId: string; url: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <a
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      className='block group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className='relative aspect-video bg-black overflow-hidden'>
        {/* Thumbnail (shown by default) */}
        {!isHovered && (
          <>
            <img
              src={thumbnail}
              alt='Video thumbnail'
              className='w-full h-full object-cover'
            />
            {/* Play button overlay */}
            <div className='absolute inset-0 flex items-center justify-center bg-black/20'>
              <div className='w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform'>
                <Play className='w-7 h-7 text-white fill-white ml-1' />
              </div>
            </div>
          </>
        )}

        {/* Embedded video on hover (autoplay, muted, no controls) */}
        {isHovered && (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&rel=0&loop=1&playlist=${videoId}`}
            title='Video preview'
            allow='autoplay; encrypted-media'
            className='w-full h-full pointer-events-none'
            loading='lazy'
          />
        )}
      </div>
    </a>
  );
}
