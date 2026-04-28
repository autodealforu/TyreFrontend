'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Award,
  Users,
  Target,
  Heart,
  Shield,
  Zap,
  CheckCircle,
  Star,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const AboutUs = () => {
  const [activeValue, setActiveValue] = useState(0);

  const stats = [
    {
      number: '25+',
      label: 'Years of Excellence',
      icon: Calendar,
      color: 'from-[#14213d] to-[#1a2b4a]',
    },
    {
      number: '50,000+',
      label: 'Happy Customers',
      icon: Users,
      color: 'from-[#fca311] to-[#e8940f]',
    },
    {
      number: '2,00,000+',
      label: 'Tyres Sold',
      icon: Award,
      color: 'from-[#14213d] to-[#1a2b4a]',
    },
    {
      number: '500+',
      label: 'Service Centers',
      icon: MapPin,
      color: 'from-[#fca311] to-[#e8940f]',
    },
  ];

  const values = [
    {
      title: 'Quality Excellence',
      description:
        'We source only premium tyres from world-renowned manufacturers, ensuring every product meets the highest standards of safety and performance.',
      icon: Shield,
      color: 'from-[#14213d] to-[#1a2b4a]',
    },
    {
      title: 'Customer First',
      description:
        "Your satisfaction drives everything we do. From expert consultation to after-sales support, we're committed to exceeding your expectations.",
      icon: Heart,
      color: 'from-[#fca311] to-[#e8940f]',
    },
    {
      title: 'Innovation & Technology',
      description:
        'We embrace cutting-edge technology and innovative solutions to provide you with the most advanced automotive products and services.',
      icon: Zap,
      color: 'from-[#14213d] to-[#1a2b4a]',
    },
  ];

  const team = [
    {
      name: 'Rajesh Sharma',
      position: 'Founder & CEO',
      experience: '30+ years in automotive industry',
      image: '/leader1.png?height=300&width=300',
      specialization: 'Business Strategy & Operations',
    },
    {
      name: 'Priya Patel',
      position: 'Chief Technology Officer',
      experience: '15+ years in tech innovation',
      image: '/leader2.png?height=300&width=300',
      specialization: 'Digital Transformation',
    },
    {
      name: 'Amit Kumar',
      position: 'Head of Operations',
      experience: '20+ years in supply chain',
      image: '/leader3.png?height=300&width=300',
      specialization: 'Supply Chain & Logistics',
    },
  ];

  const certifications = [
    {
      name: 'ISO 9001:2015',
      description: 'Quality Management',
      icon: '/im1.png?height=80&width=80',
    },
    {
      name: 'ISO 14001',
      description: 'Environmental Management',
      icon: '/im2.png?height=80&width=80',
    },
    {
      name: 'OHSAS 18001',
      description: 'Occupational Health & Safety',
      icon: '/im3.png?height=80&width=80',
    },
    {
      name: 'BIS Certified',
      description: 'Bureau of Indian Standards',
      icon: '/im4.png?height=80&width=80',
    },
  ];

  return (
    <div className='min-h-screen bg-linear-to-br from-[#e5e5e5] via-white to-[#e5e5e5]'>
      
      <section className='relative overflow-hidden bg-linear-to-br from-[#14213d] via-[#1a2b4a] to-[#14213d] text-white'>
        <div className="absolute inset-0 bg-[url('/images/tyre-pattern.svg')] opacity-5"></div>
        <div className='absolute inset-0 bg-linear-to-r from-[#fca311]/20 to-transparent'></div>

        <div className='relative container mx-auto px-4 py-20'>
          <div className='max-w-4xl mx-auto text-center'>
            <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20'>
              <Award className='w-5 h-5 text-[#fca311]' />
              <span className='font-medium'>
                India's Trusted Tyre Destination Since 1999
              </span>
            </div>

            <h1 className='text-5xl md:text-6xl font-bold mb-6'>
              About <span className='text-[#fca311]'>Autodeal4U</span>
            </h1>
            <p className='text-xl md:text-2xl mb-8 text-white/80 max-w-3xl mx-auto leading-relaxed'>
              Pioneering automotive excellence for over two decades, we've built
              India's most trusted network of premium tyre solutions and
              professional services.
            </p>

            <div className='flex flex-wrap justify-center gap-4 text-sm'>
              <div className='flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20'>
                <CheckCircle className='w-4 h-4 text-[#fca311]' />
                <span>25+ Years Legacy</span>
              </div>
              <div className='flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20'>
                <Star className='w-4 h-4 text-[#fca311] fill-current' />
                <span>4.8/5 Customer Rating</span>
              </div>
              <div className='flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20'>
                <Shield className='w-4 h-4 text-[#fca311]' />
                <span>ISO Certified Quality</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='py-20 px-25 relative z-10'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {stats.map((stat, index) => (
              <Card
                key={index}
                className='bg-white/80 backdrop-blur-sm border-[#e5e5e5]/50 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105'
              >
                <CardContent className='p-8 text-center'>
                  <div
                    className={`w-16 h-16 mx-auto mb-4 bg-linear-to-br ${stat.color} rounded-2xl flex items-center justify-center`}
                  >
                    <stat.icon className='w-8 h-8 text-white' />
                  </div>
                  <h3 className='text-3xl font-bold text-[#000000] mb-2'>
                    {stat.number}
                  </h3>
                  <p className='text-[#14213d] font-medium'>{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className='py-20 px-30 bg-linear-to-r from-white to-[#e5e5e5]'>
        <div className='container mx-auto px-4'>
          <div className='grid lg:grid-cols-2 gap-12 items-center'>
            <div>
              <div className='inline-flex items-center gap-2 bg-[#fca311]/10 text-[#fca311] rounded-full px-4 py-2 mb-6 border border-[#fca311]/20'>
                <Clock className='w-4 h-4' />
                <span className='text-sm font-medium'>Our Journey</span>
              </div>

              <h2 className='text-4xl font-bold text-[#000000] mb-6'>
                From Humble Beginnings to Industry Leadership
              </h2>
              <div className='space-y-6 text-[#14213d] leading-relaxed'>
                <p className='text-lg'>
                  Founded in 1999 with a simple vision to provide quality tyres
                  at fair prices, Autodeal4U has grown from a single store in
                  Delhi to India's most trusted multi-vendor tyre marketplace.
                </p>
                <p>
                  Our journey began when our founder, Rajesh Sharma, recognized
                  the need for transparent pricing and genuine products in the
                  automotive industry. What started as a mission to serve local
                  customers has evolved into a nationwide network serving over
                  50,000 satisfied customers.
                </p>
                <p>
                  Today, we partner with leading manufacturers like Michelin,
                  Bridgestone, MRF, and Apollo to bring you the finest selection
                  of tyres and automotive services, all backed by our commitment
                  to excellence and customer satisfaction.
                </p>
              </div>

              <div className='flex items-center gap-4 mt-8'>
                <Button className='bg-linear-to-r from-[#fca311] to-[#e8940f] hover:from-[#e8940f] hover:to-[#d4850e] text-white rounded-xl px-8 py-3'>
                  <ArrowRight className='w-4 h-4 mr-2' />
                  Explore Our Products
                </Button>
                <div className='flex items-center gap-2 text-[#14213d]'>
                  <TrendingUp className='w-4 h-4 text-[#fca311]' />
                  <span className='text-sm'>Growing 25% annually</span>
                </div>
              </div>
            </div>

            <div className='relative'>
              <div className='aspect-square bg-linear-to-br from-[#e5e5e5] to-white rounded-3xl overflow-hidden shadow-2xl'>
                <Image
                  src='/about.png'
                  alt='Autodeal4U Showroom'
                  width={600}
                  height={600}
                  className='w-full h-full object-cover'
                />
              </div>
              <div className='absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl border border-[#e5e5e5]/50'>
                <div className='flex items-center gap-3'>
                  <div className='w-12 h-12 bg-[#fca311]/10 rounded-xl flex items-center justify-center'>
                    <Award className='w-6 h-6 text-[#fca311]' />
                  </div>
                  <div>
                    <p className='font-bold text-[#000000]'>Industry Leader</p>
                    <p className='text-sm text-[#14213d]'>
                      Trusted by millions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='py-20 px-25 bg-linear-to-br from-[#14213d] via-[#1a2b4a] to-[#14213d] text-white relative overflow-hidden'>
        <div className="absolute inset-0 bg-[url('/images/tyre-pattern.svg')] opacity-5"></div>

        <div className='relative container mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold mb-4'>Our Mission & Vision</h2>
            <p className='text-xl text-white/80 max-w-2xl mx-auto'>
              Driving towards a future where every journey is safe, comfortable,
              and reliable
            </p>
          </div>

          <div className='grid lg:grid-cols-2 gap-12'>
            <Card className='bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl overflow-hidden'>
              <CardContent className='p-8'>
                <div className='w-16 h-16 bg-linear-to-br from-[#fca311] to-[#e8940f] rounded-2xl flex items-center justify-center mb-6'>
                  <Target className='w-8 h-8 text-white' />
                </div>
                <h3 className='text-2xl font-bold mb-4'>Our Mission</h3>
                <p className='text-white/80 leading-relaxed'>
                  To revolutionize the automotive industry by providing
                  transparent, accessible, and premium tyre solutions that
                  ensure every customer experiences the perfect balance of
                  safety, performance, and value on every journey.
                </p>
              </CardContent>
            </Card>

            <Card className='bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl overflow-hidden'>
              <CardContent className='p-8'>
                <div className='w-16 h-16 bg-linear-to-br from-[#fca311] to-[#e8940f] rounded-2xl flex items-center justify-center mb-6'>
                  <Zap className='w-8 h-8 text-white' />
                </div>
                <h3 className='text-2xl font-bold mb-4'>Our Vision</h3>
                <p className='text-white/80 leading-relaxed'>
                  To become India's most trusted automotive partner, setting new
                  standards in customer service, product quality, and
                  technological innovation while building a sustainable future
                  for the automotive ecosystem.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className='py-20 px-30 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-[#000000] mb-4'>
              Our Core Values
            </h2>
            <p className='text-xl text-[#14213d]/70 max-w-2xl mx-auto'>
              The principles that guide every decision and drive our commitment
              to excellence
            </p>
          </div>

          <div className='grid lg:grid-cols-3 gap-8'>
            {values.map((value, index) => (
              <Card
                key={index}
                className={`group cursor-pointer transition-all duration-500 hover:shadow-2xl rounded-2xl overflow-hidden border-[#e5e5e5]/50 ${
                  activeValue === index ? 'hover:ring-1 ring-[#fca311] ' : ''
                }`}
                onClick={() => setActiveValue(index)}
              >
                <CardContent className='p-8 text-center'>
                  <div
                    className={`w-20 h-20 mx-auto mb-6 bg-linear-to-br ${value.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <value.icon className='w-10 h-10 text-white' />
                  </div>
                  <h3 className='text-xl font-bold text-[#000000] mb-4'>
                    {value.title}
                  </h3>
                  <p className='text-[#14213d]/70 leading-relaxed'>
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className='py-20 px-30 bg-linear-to-br from-[#e5e5e5] to-white'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-[#000000] mb-4'>
              Meet Our Leadership Team
            </h2>
            <p className='text-xl text-[#14213d]/70 max-w-2xl mx-auto'>
              Experienced professionals driving innovation and excellence in the
              automotive industry
            </p>
          </div>

          <div className='grid lg:grid-cols-3 gap-8'>
            {team.map((member, index) => (
              <Card
                key={index}
                className='group hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden border-[#e5e5e5]/50'
              >
                <div className='relative overflow-hidden'>
                  <Image
                    src={member.image || '/placeholder.svg'}
                    alt={member.name}
                    width={400}
                    height={400}
                    className='w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700'
                  />
                  <div className='absolute inset-0 bg-linear-to-t from-[#000000]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                </div>
                <CardContent className='p-8 text-center'>
                  <h3 className='text-xl font-bold text-[#000000] mb-2'>
                    {member.name}
                  </h3>
                  <p className='text-[#fca311] font-semibold mb-2'>
                    {member.position}
                  </p>
                  <p className='text-sm text-[#14213d]/70 mb-3'>
                    {member.experience}
                  </p>
                  <Badge
                    variant='outline'
                    className='text-xs border-[#fca311] text-[#fca311]'
                  >
                    {member.specialization}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className='py-20 px-30 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-[#000000] mb-4'>
              Certifications & Standards
            </h2>
            <p className='text-xl text-[#14213d]/70 max-w-2xl mx-auto'>
              Our commitment to quality is validated by international standards
              and certifications
            </p>
          </div>

          <div className='grid grid-cols-2 lg:grid-cols-4 gap-8'>
            {certifications.map((cert, index) => (
              <Card
                key={index}
                className='group hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden border-[#e5e5e5]/50 text-center'
              >
                <CardContent className='p-8'>
                  <div className='w-20 h-20 mx-auto mb-4  rounded-2xl flex items-center justify-center group-hover:bg-[#fca311]/10 transition-colors duration-300'>
                    <Image
                      src={cert.icon || '/placeholder.svg'}
                      alt={cert.name}
                      width={500}
                      height={500}
                      className='group-hover:scale-110 transition-transform duration-300 object-cover'
                    />
                  </div>
                  <h3 className='font-bold text-[#000000] mb-2'>{cert.name}</h3>
                  <p className='text-sm text-[#14213d]/70'>
                    {cert.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className='py-20 bg-linear-to-r from-[#14213d] to-[#1a2b4a] text-white relative overflow-hidden'>
        <div className="absolute inset-0 bg-[url('/images/tyre-pattern.svg')] opacity-10"></div>

        <div className='relative container mx-auto px-4 text-center'>
          <h2 className='text-4xl font-bold mb-6'>
            Ready to Experience Excellence?
          </h2>
          <p className='text-xl mb-8 max-w-2xl mx-auto opacity-90'>
            Join thousands of satisfied customers who trust Autodeal4U for their
            automotive needs
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            <Button className='bg-[#fca311] hover:bg-[#e8940f] text-white rounded-xl px-8 py-3 font-semibold'>
              <Phone className='w-4 h-4 mr-2' />
              Call Us: +91 98765 43210
            </Button>
            <Button
              variant='outline'
              className='border-white text-white hover:bg-white hover:text-[#14213d] rounded-xl px-8 py-3 font-semibold bg-transparent'
            >
              <Mail className='w-4 h-4 mr-2' />
              info@autodeal4u.com
            </Button>
          </div>

          <div className='flex items-center justify-center gap-6 mt-8 text-sm opacity-80'>
            <div className='flex items-center gap-2'>
              <MapPin className='w-4 h-4' />
              <span>123 Tyre Street, Auto City, Delhi 110001</span>
            </div>
          </div>
        </div>
      </section>
    </div>

  );
};

export default AboutUs;
