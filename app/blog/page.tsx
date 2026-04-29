import { getBlogs } from '@/actions/blog.action';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ChevronRight, User } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://13.211.190.176:9042';

export default async function BlogPage() {
  const { blogs } = await getBlogs();

  return (
    <div className='min-h-screen bg-gray-50/50 pb-20'>
      {/* Hero Section */}
      <div className='relative py-20 bg-[#14213d] text-white overflow-hidden'>
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-0 left-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl'></div>
          <div className='absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600 rounded-full blur-3xl'></div>
        </div>
        
        <div className='container mx-auto px-4 relative z-10 text-center uppercase tracking-wider font-bold text-4xl md:text-5xl'>
          <h1>Our Latest <span className='text-orange-500'>Blogs</span></h1>
          <p className='text-gray-400 mt-4 text-lg font-medium normal-case max-w-2xl mx-auto'>
            Stay updated with the latest in the world of tyres, alloy wheels, and professional automotive services.
          </p>
        </div>
      </div>

      <div className='container mx-auto px-25 mt-16'>
        {blogs && blogs.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {blogs.map((blog: any) => (
              <Link key={blog._id} href={`/blog/${blog.slug}`}>
                <Card className='group h-full border-none shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-white/10 rounded-2xl'>
                  <div className='relative h-64 w-full overflow-hidden'>
                    <img
                      src={blog.image ? `${API_URL}${blog.image.replace(/\\/g, '/').startsWith('/') ? '' : '/'}${blog.image.replace(/\\/g, '/')}` : '/placeholder-blog.jpg'}
                      alt={blog.title}
                      className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                    />
                    <div className='absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                    {blog.category && (
                      <div className='absolute top-4 left-4'>
                        <span className='px-4 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-full shadow-lg'>
                          {blog.category.name}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <CardHeader className='p-6 pb-2'>
                    <div className='flex items-center gap-4 text-xs text-gray-500 mb-3'>
                      <div className='flex items-center gap-1.5'>
                        <Calendar className='h-3.5 w-3.5 text-orange-500' />
                        {new Date(blog.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div className='flex items-center gap-1.5'>
                        <User className='h-3.5 w-3.5 text-orange-500' />
                        {blog.created_by?.name || 'Admin'}
                      </div>
                    </div>
                    <h2 className='text-xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors duration-200 line-clamp-2 leading-tight'>
                      {blog.title}
                    </h2>
                  </CardHeader>
                  
                  <CardContent className='p-6 pt-0'>
                    <p className='text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed'>
                      {blog.description?.replace(/<[^>]*>?/gm, '') || 'Read our latest blog post to learn more about this topic...'}
                    </p>
                    <div className='flex items-center text-orange-500 font-bold text-sm group-hover:gap-2 transition-all duration-200'>
                      Read Article <ChevronRight className='h-4 w-4' />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className='text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100'>
            <div className='h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6'>
              <Calendar className='h-10 w-10 text-gray-300' />
            </div>
            <h3 className='text-2xl font-bold text-gray-900 mb-2'>No blogs yet</h3>
            <p className='text-gray-500'>We're working on some exciting content. Stay tuned!</p>
          </div>
        )}
      </div>
    </div>
  );
}
