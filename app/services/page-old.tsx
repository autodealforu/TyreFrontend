import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  Settings,
  Wrench,
  Car,
  Shield,
  Clock,
  MapPin,
  CheckCircle,
  Star,
  Calendar,
  Phone,
} from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Professional Tyre Services | Autodeal4U',
  description:
    'Complete automotive services including tyre installation, wheel alignment, puncture repair, and emergency roadside assistance. Expert technicians and quality guarantee.',
  keywords:
    'tyre services, wheel alignment, tyre installation, puncture repair, roadside assistance, automotive services',
};

export default function ServicesPage() {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header Section */}
      <section className='bg-green-600 text-white py-16'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl'>
            <h1 className='text-4xl md:text-5xl font-bold mb-4'>
              Expert Services
            </h1>
            <p className='text-xl mb-6 opacity-90'>
              Professional automotive care by certified technicians with
              advanced equipment
            </p>

            {/* Search Bar */}
            <div className='flex flex-col sm:flex-row gap-4 mb-6'>
              <div className='relative flex-1'>
                <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                <Input
                  placeholder='Search services...'
                  className='pl-12 h-12 text-gray-900'
                />
              </div>
              <Button variant='secondary' size='lg' className='h-12 px-6'>
                <Calendar className='mr-2 h-4 w-4' />
                Book Now
              </Button>
            </div>

            {/* Popular Services */}
            <div>
              <p className='text-sm mb-3 opacity-75'>Popular Services:</p>
              <div className='flex flex-wrap gap-2'>
                {[
                  'Tyre Installation',
                  'Wheel Alignment',
                  'Balancing',
                  'Oil Change',
                  'Brake Service',
                ].map((service) => (
                  <Badge
                    key={service}
                    variant='secondary'
                    className='bg-white/10 text-white border-white/20 hover:bg-white/20 cursor-pointer'
                  >
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className='py-12 bg-white'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-8'>Our Services</h2>

          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {[
              {
                icon: Wrench,
                title: 'Tyre Services',
                services: [
                  'Tyre Installation',
                  'Tyre Rotation',
                  'Puncture Repair',
                  'Tyre Replacement',
                ],
                color: 'bg-blue-500',
                price: 'Starting from ₹500',
              },
              {
                icon: Settings,
                title: 'Wheel Services',
                services: [
                  'Wheel Alignment',
                  'Wheel Balancing',
                  'Rim Repair',
                  'Alloy Cleaning',
                ],
                color: 'bg-green-500',
                price: 'Starting from ₹800',
              },
              {
                icon: Car,
                title: 'Vehicle Maintenance',
                services: [
                  'Oil Change',
                  'Brake Service',
                  'Battery Check',
                  'AC Service',
                ],
                color: 'bg-purple-500',
                price: 'Starting from ₹1200',
              },
              {
                icon: Shield,
                title: 'Safety Inspection',
                services: [
                  'Full Vehicle Check',
                  'Brake Inspection',
                  'Suspension Check',
                  'Light Check',
                ],
                color: 'bg-orange-500',
                price: 'Starting from ₹300',
              },
              {
                icon: Clock,
                title: 'Emergency Services',
                services: [
                  '24/7 Roadside',
                  'Flat Tyre Help',
                  'Jump Start',
                  'Towing Service',
                ],
                color: 'bg-red-500',
                price: 'Starting from ₹1000',
              },
              {
                icon: Star,
                title: 'Premium Care',
                services: [
                  'Ceramic Coating',
                  'Paint Protection',
                  'Interior Detailing',
                  'Full Wash',
                ],
                color: 'bg-yellow-500',
                price: 'Starting from ₹2000',
              },
            ].map((category) => (
              <Card
                key={category.title}
                className='hover:shadow-lg transition-shadow'
              >
                <CardContent className='p-6'>
                  <div
                    className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-4`}
                  >
                    <category.icon className='h-6 w-6 text-white' />
                  </div>
                  <h3 className='text-xl font-bold mb-3'>{category.title}</h3>
                  <div className='space-y-2 mb-4'>
                    {category.services.map((service) => (
                      <div
                        key={service}
                        className='flex items-center text-sm text-gray-600'
                      >
                        <CheckCircle className='h-4 w-4 text-green-500 mr-2' />
                        {service}
                      </div>
                    ))}
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium text-gray-900'>
                      {category.price}
                    </span>
                    <Button size='sm'>Book Service</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Services */}
      <section className='py-12'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-8'>
            Why Choose Our Services?
          </h2>

          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {[
              {
                icon: Shield,
                title: 'Certified Technicians',
                description:
                  'All our technicians are certified and experienced professionals',
              },
              {
                icon: Clock,
                title: '24/7 Support',
                description:
                  'Round-the-clock support for all your automotive needs',
              },
              {
                icon: Star,
                title: 'Quality Guarantee',
                description: '100% satisfaction guarantee on all our services',
              },
              {
                icon: MapPin,
                title: 'Multiple Locations',
                description: 'Convenient service centers across the city',
              },
            ].map((feature) => (
              <Card
                key={feature.title}
                className='text-center hover:shadow-md transition-shadow'
              >
                <CardContent className='p-6'>
                  <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <feature.icon className='h-8 w-8 text-green-600' />
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

      {/* Service Booking Form */}
      <section className='py-12 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='max-w-2xl mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-8'>
              Book Your Service
            </h2>

            <Card>
              <CardContent className='p-8'>
                <form className='space-y-6'>
                  <div className='grid md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium mb-2'>
                        Full Name
                      </label>
                      <Input placeholder='Enter your name' />
                    </div>
                    <div>
                      <label className='block text-sm font-medium mb-2'>
                        Phone Number
                      </label>
                      <Input placeholder='Enter phone number' />
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Email Address
                    </label>
                    <Input type='email' placeholder='Enter email address' />
                  </div>

                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Service Required
                    </label>
                    <select className='w-full p-3 border border-gray-300 rounded-lg'>
                      <option>Select Service</option>
                      <option>Tyre Installation</option>
                      <option>Wheel Alignment</option>
                      <option>Oil Change</option>
                      <option>Brake Service</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className='grid md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium mb-2'>
                        Preferred Date
                      </label>
                      <Input type='date' />
                    </div>
                    <div>
                      <label className='block text-sm font-medium mb-2'>
                        Preferred Time
                      </label>
                      <select className='w-full p-3 border border-gray-300 rounded-lg'>
                        <option>Select Time</option>
                        <option>9:00 AM - 12:00 PM</option>
                        <option>12:00 PM - 3:00 PM</option>
                        <option>3:00 PM - 6:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Additional Notes
                    </label>
                    <textarea
                      className='w-full p-3 border border-gray-300 rounded-lg resize-none'
                      rows={3}
                      placeholder='Any specific requirements or notes...'
                    />
                  </div>

                  <Button className='w-full' size='lg'>
                    Book Service Now
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className='py-16 bg-red-600 text-white'>
        <div className='container mx-auto px-4 text-center'>
          <h2 className='text-3xl font-bold mb-4'>Need Emergency Service?</h2>
          <p className='text-xl mb-8 opacity-90'>
            24/7 emergency roadside assistance available
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button size='lg' variant='secondary'>
              <Phone className='mr-2 h-4 w-4' />
              Call Emergency: 1800-XXX-XXXX
            </Button>
            <Button
              size='lg'
              variant='outline'
              className='border-white text-white hover:bg-white hover:text-red-600'
            >
              <MapPin className='mr-2 h-4 w-4' />
              Find Nearest Center
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
