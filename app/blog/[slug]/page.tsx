import { getBlogBySlug } from '@/actions/blog.action';
import { Calendar, User, ArrowLeft, Clock, Tag } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9042';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function BlogDetailsPage({ params }: PageProps) {
  const { slug } = params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <article className='min-h-screen bg-white'>
      {/* Header Section */}
      <div className='relative w-full h-[60vh] md:h-[70vh] bg-gray-900'>
        <img
          src={blog.image ? `${API_URL}${blog.image}` : '/placeholder-blog.jpg'}
          alt={blog.title}
          className='absolute inset-0 w-full h-full object-cover opacity-60'
        />
        <div className='absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent'></div>
        
        <div className='absolute inset-x-0 bottom-0 py-20 px-4'>
          <div className='container mx-auto max-w-4xl'>
            <Link 
              href='/blog' 
              className='inline-flex items-center gap-2 text-white/80 hover:text-orange-500 transition-colors mb-8 font-semibold uppercase tracking-widest text-xs'
            >
              <ArrowLeft className='h-4 w-4' /> Back to Blogs
            </Link>
            
            {blog.category && (
              <div className='flex items-center gap-2 mb-6'>
                <span className='px-4 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-full shadow-lg uppercase tracking-wider'>
                  {blog.category.name}
                </span>
              </div>
            )}
            
            <h1 className='text-4xl md:text-6xl font-extrabold text-white leading-tight mb-8 drop-shadow-md text-balance'>
              {blog.title}
            </h1>
            
            <div className='flex flex-wrap items-center gap-6 text-white/90 text-sm md:text-base font-medium'>
              <div className='flex items-center gap-2 border-r border-white/20 pr-6'>
                <User className='h-5 w-5 text-orange-500' />
                <span>{blog.created_by?.name || 'By Autodeal4U Team'}</span>
              </div>
              <div className='flex items-center gap-2 border-r border-white/20 pr-6'>
                <Calendar className='h-5 w-5 text-orange-500' />
                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
              <div className='flex items-center gap-2'>
                <Clock className='h-5 w-5 text-orange-500' />
                5 min read
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className='py-16 md:py-24 px-4'>
        <div className='container mx-auto max-w-3xl'>
          {/* Main Content */}
          <div 
            className='prose prose-lg md:prose-xl prose-orange max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-img:rounded-3xl prose-img:shadow-xl prose-strong:text-orange-600 prose-a:text-orange-500 prose-a:no-underline hover:prose-a:underline'
            dangerouslySetInnerHTML={{ __html: blog.description }}
          />

          {/* Gallery Section */}
          {blog.gallery && blog.gallery.length > 0 && (
            <div className='mt-16'>
              <h3 className='text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3'>
                <span className='h-8 w-1 bg-orange-500 rounded-full'></span>
                Project Gallery
              </h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {blog.gallery.map((img: string, idx: number) => (
                  <div key={idx} className='relative h-64 rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300'>
                    <img
                      src={`${API_URL}${img}`}
                      alt={`Gallery image ${idx + 1}`}
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                    />
                    <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <hr className='my-16 border-gray-100' />
          
          {/* Footer of Article */}
          <div className='flex flex-col md:flex-row justify-between items-center gap-8 bg-gray-50 p-8 rounded-3xl'>
            <div className='flex items-center gap-4'>
              <div className='bg-orange-100 p-3 rounded-2xl'>
                <Tag className='h-6 w-6 text-orange-600' />
              </div>
              <div>
                <p className='text-xs font-bold text-gray-400 uppercase tracking-widest'>Category</p>
                <p className='text-gray-900 font-bold'>{blog.category?.name || 'Automotive'}</p>
              </div>
            </div>
            
            <div className='flex items-center gap-4'>
              <span className='text-sm font-bold text-gray-500 uppercase tracking-widest'>Share:</span>
              <div className='flex gap-3'>
                {['FB', 'TW', 'LI'].map((social) => (
                  <button key={social} className='h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-xs font-bold hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-200'>
                    {social}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
