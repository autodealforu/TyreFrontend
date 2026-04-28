import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  CircleDot,
  Star,
  Gauge,
  Palette,
  Award,
  Shield,
  MapPin,
  Phone,
  CheckCircle,
  Truck,
} from 'lucide-react';
import Link from 'next/link';

export default function AlloyWheelsPage() {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header Section */}
      <section className='bg-gray-700 text-white py-16'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl'>
            <h1 className='text-4xl md:text-5xl font-bold mb-4'>
              Premium Alloy Wheels
            </h1>
            <p className='text-xl mb-6 opacity-90'>
              Transform your vehicle with our stunning collection of
              lightweight, durable alloy wheels
            </p>

            {/* Search Bar */}
            <div className='flex flex-col sm:flex-row gap-4 mb-6'>
              <div className='relative flex-1'>
                <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                <Input
                  placeholder='Search by size, brand, or style...'
                  className='pl-12 h-12 text-gray-900'
                />
              </div>
              <Button variant='secondary' size='lg' className='h-12 px-6'>
                <Filter className='mr-2 h-4 w-4' />
                Filters
              </Button>
            </div>

            {/* Popular Sizes - Inch Only */}
            <div>
              <p className='text-sm mb-3 opacity-75'>Popular Sizes (Inch):</p>
              <div className='flex flex-wrap gap-2'>
                {['15"', '16"', '17"', '18"', '19"', '20"'].map((size) => (
                  <Badge
                    key={size}
                    variant='secondary'
                    className='bg-white/10 text-white border-white/20 hover:bg-white/20 cursor-pointer'
                  >
                    {size}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search By Size Section - Inch Only */}
      <section className='py-12 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-8'>
              Search By Wheel Size
            </h2>

            <Card className='p-8'>
              <CardContent className='p-0'>
                <div className='text-center'>
                  <h3 className='text-xl font-semibold mb-4 flex items-center justify-center'>
                    <CircleDot className='mr-2 h-5 w-5' />
                    Search by Inch Size Only
                  </h3>
                  <div className='max-w-md mx-auto'>
                    <div className='mb-4'>
                      <label className='block text-sm font-medium mb-2'>
                        Wheel Size (Inches)
                      </label>
                      <select className='w-full p-3 border border-gray-300 rounded-lg'>
                        <option>Select Wheel Size</option>
                        <option>15"</option>
                        <option>16"</option>
                        <option>17"</option>
                        <option>18"</option>
                        <option>19"</option>
                        <option>20"</option>
                        <option>21"</option>
                        <option>22"</option>
                      </select>
                    </div>
                    <div className='text-sm text-gray-600 bg-blue-50 p-3 rounded-lg mb-4'>
                      <strong>Note:</strong> Alloy wheels are measured in inches
                      only. No aspect ratio is required for alloy wheel
                      selection.
                    </div>
                    <Button className='w-full' size='lg'>
                      Search Alloy Wheels
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Wheel Categories */}
      <section className='py-12'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-8'>
            Browse by Style
          </h2>

          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {[
              {
                title: 'Sport Wheels',
                count: '200+',
                color: 'bg-red-500',
                icon: Gauge,
              },
              {
                title: 'Luxury Wheels',
                count: '150+',
                color: 'bg-gold-500',
                icon: Star,
              },
              {
                title: 'Classic Wheels',
                count: '180+',
                color: 'bg-blue-500',
                icon: Award,
              },
              {
                title: 'Custom Wheels',
                count: '100+',
                color: 'bg-purple-500',
                icon: Palette,
              },
            ].map((category) => (
              <Card
                key={category.title}
                className='hover:shadow-lg transition-shadow cursor-pointer'
              >
                <CardContent className='p-6 text-center'>
                  <div
                    className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <category.icon className='h-6 w-6 text-white' />
                  </div>
                  <h3 className='font-semibold text-lg mb-2'>
                    {category.title}
                  </h3>
                  <p className='text-gray-600'>{category.count} designs</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-12 bg-white'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-8'>
            Why Choose Our Alloy Wheels?
          </h2>

          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {[
              {
                icon: Gauge,
                title: 'Lightweight Design',
                description:
                  'Reduce unsprung weight for better performance and fuel efficiency',
              },
              {
                icon: Shield,
                title: 'Corrosion Resistant',
                description:
                  'Premium coating protects against rust and weather damage',
              },
              {
                icon: Star,
                title: 'Enhanced Performance',
                description:
                  'Better heat dissipation and improved handling characteristics',
              },
              {
                icon: Palette,
                title: 'Custom Finishes',
                description:
                  'Multiple finish options including chrome, matte, and gloss',
              },
            ].map((feature) => (
              <Card
                key={feature.title}
                className='text-center hover:shadow-md transition-shadow'
              >
                <CardContent className='p-6'>
                  <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <feature.icon className='h-8 w-8 text-gray-600' />
                  </div>
                  <h3 className='font-semibold text-lg mb-2'>
                    {feature.title}
                  </h3>
                  <p className='text-gray-600 text-sm'>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Brands */}
      <section className='py-12'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-8'>
            Premium Brands
          </h2>

          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6'>
            {['BBS', 'Enkei', 'OZ Racing', 'Rays', 'HRE', 'Forgiato'].map(
              (brand) => (
                <Card
                  key={brand}
                  className='hover:shadow-md transition-shadow cursor-pointer'
                >
                  <CardContent className='p-6 text-center'>
                    <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3'>
                      <span className='text-xs font-bold'>
                        {brand.slice(0, 2)}
                      </span>
                    </div>
                    <p className='font-medium'>{brand}</p>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </div>
      </section>

      {/* Size Guide */}
      <section className='py-12 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-8'>
              Alloy Wheel Size Guide
            </h2>

            <div className='grid md:grid-cols-2 gap-8'>
              <Card>
                <CardContent className='p-6'>
                  <h3 className='text-xl font-bold mb-4'>Available Sizes</h3>
                  <div className='space-y-3'>
                    {[
                      { size: '15"', vehicles: 'Compact cars, Hatchbacks' },
                      { size: '16"', vehicles: 'Sedans, Small SUVs' },
                      { size: '17"', vehicles: 'Mid-size cars, Crossovers' },
                      { size: '18"', vehicles: 'Luxury cars, Large SUVs' },
                      { size: '19"', vehicles: 'Sports cars, Premium SUVs' },
                      { size: '20"+"', vehicles: 'Luxury SUVs, Sports cars' },
                    ].map((item) => (
                      <div
                        key={item.size}
                        className='flex justify-between items-center py-2 border-b border-gray-200'
                      >
                        <span className='font-semibold'>{item.size}</span>
                        <span className='text-gray-600 text-sm'>
                          {item.vehicles}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className='p-6'>
                  <h3 className='text-xl font-bold mb-4'>
                    Installation Services
                  </h3>
                  <div className='space-y-3'>
                    {[
                      'Professional mounting & balancing',
                      'Tire pressure monitoring system setup',
                      'Wheel alignment check',
                      'Old wheel disposal',
                      'Quality guarantee & warranty',
                    ].map((service, index) => (
                      <div key={index} className='flex items-center'>
                        <CheckCircle className='h-4 w-4 text-green-500 mr-3' />
                        <span className='text-sm'>{service}</span>
                      </div>
                    ))}
                  </div>
                  <Button className='w-full mt-4'>Book Installation</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-16 bg-gray-700 text-white'>
        <div className='container mx-auto px-4 text-center'>
          <h2 className='text-3xl font-bold mb-4'>
            Ready to Upgrade Your Wheels?
          </h2>
          <p className='text-xl mb-8 opacity-90'>
            Professional installation and lifetime support included with every
            purchase
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button size='lg' variant='secondary'>
              <Link href='/contact-us' className='flex items-center'>
                Get Expert Advice
              </Link>
            </Button>
            <Button
              size='lg'
              variant='outline'
              className='border-white text-white hover:bg-white hover:text-gray-700'
            >
              <Truck className='mr-2 h-4 w-4' />
              Free Installation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
