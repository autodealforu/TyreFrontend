import { Phone, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-brand-black text-white py-12 md:py-16 relative overflow-hidden'>
      {/* Background decorations */}
      <div className='absolute inset-0 opacity-5'>
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-brand-orange rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 right-1/4 w-80 h-80 bg-brand-primary rounded-full blur-3xl'></div>
      </div>

      <div className='container mx-auto px-4 relative z-10'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12'>
          {/* Company Info */}
          <div className='md:col-span-2 lg:col-span-1'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='h-12 w-12 bg-linear-to-br from-brand-primary to-brand-orange rounded-xl flex items-center justify-center shadow-lg'>
                <span className='text-white font-bold text-lg'>A</span>
              </div>
              <div>
                <span className='text-2xl font-bold text-white'>
                  Autodeal4U
                </span>
                <p className='text-brand-orange text-sm font-medium'>
                  Premium Tyre Solutions
                </p>
              </div>
            </div>
            <p className='text-gray-300 mb-6 text-base leading-relaxed'>
              Your trusted partner for premium tyres and professional
              installation services. We provide quality tyres from
              world-renowned brands with expert guidance.
            </p>
            <div className='flex items-start gap-3 text-gray-300 text-base mb-6'>
              <MapPin className='h-5 w-5 flex-shrink-0 mt-1 text-brand-orange' />
              <span>123 Tyre Street, Auto City, Delhi 110001</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-xl font-bold mb-6 text-white'>Quick Links</h3>
            <ul className='space-y-3 text-gray-300'>
              <li>
                <Link
                  href='/about-us'
                  className='hover:text-brand-orange transition-colors duration-200 font-medium'
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href='/services'
                  className='hover:text-brand-orange transition-colors duration-200 font-medium'
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href='/contact-us'
                  className='hover:text-brand-orange transition-colors duration-200 font-medium'
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href='/tyres'
                  className='hover:text-brand-orange transition-colors duration-200 font-medium'
                >
                  Tyres
                </Link>
              </li>
              <li>
                <Link
                  href='/alloy-wheels'
                  className='hover:text-brand-orange transition-colors duration-200 font-medium'
                >
                  Alloy Wheels
                </Link>
              </li>
              <li>
                <Link
                  href='/register-as-vendor'
                  className='hover:text-brand-orange transition-colors duration-200 font-medium'
                >
                  Register as Vendor
                </Link>
              </li>
              <li>
                <Link
                  href='/account/orders'
                  className='hover:text-brand-orange transition-colors duration-200 font-medium'
                >
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className='text-xl font-bold mb-6 text-white'>Categories</h3>
            <ul className='space-y-3 text-gray-300'>
              <li>
                <Link
                  href='/tyres'
                  className='hover:text-brand-orange transition-colors duration-200 font-medium'
                >
                  🚗 Tyres
                </Link>
              </li>
              <li>
                <Link
                  href='/alloy-wheels'
                  className='hover:text-brand-orange transition-colors duration-200 font-medium'
                >
                  🚙 Alloy Wheels
                </Link>
              </li>
              <li>
                <Link
                  href='/services'
                  className='hover:text-brand-orange transition-colors duration-200 font-medium'
                >
                  � Services
                </Link>
              </li>
              <li>
                <Link
                  href='/account'
                  className='hover:text-brand-orange transition-colors duration-200 font-medium'
                >
                  👤 My Account
                </Link>
              </li>
              <li>
                <Link
                  href='/login'
                  className='hover:text-brand-orange transition-colors duration-200 font-medium'
                >
                  🏷️ Login
                </Link>
              </li>
              <li>
                <Link
                  href='/contact-us'
                  className='hover:text-brand-orange transition-colors duration-200 font-medium'
                >
                  📞 Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className='text-xl font-bold mb-6 text-white'>Contact Info</h3>
            <ul className='space-y-4 text-gray-300'>
              <li className='flex items-start gap-3'>
                <Phone className='h-5 w-5 flex-shrink-0 mt-1 text-brand-orange' />
                <div>
                  <div className='font-semibold text-white'>
                    +91 98765 43210
                  </div>
                  <div className='text-sm text-gray-400'>
                    24/7 Customer Support
                  </div>
                </div>
              </li>
              <li className='flex items-start gap-3'>
                <Mail className='h-5 w-5 flex-shrink-0 mt-1 text-brand-orange' />
                <div>
                  <div className='font-semibold text-white'>
                    info@autodeal4u.com
                  </div>
                  <div className='text-sm text-gray-400'>General Inquiries</div>
                </div>
              </li>
              <li>
                <div className='font-semibold text-white mb-2'>
                  🕒 Business Hours:
                </div>
                <div className='text-sm space-y-1 text-gray-400'>
                  <div>Mon-Fri: 8:00 AM - 8:00 PM</div>
                  <div>Sat: 9:00 AM - 6:00 PM</div>
                  <div>Sun: 10:00 AM - 4:00 PM</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-gray-800 mt-12 pt-8'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-6 text-gray-300'>
            <div className='text-center md:text-left'>
              <p className='font-medium'>
                &copy; {currentYear} Autodeal4U. All rights reserved.
              </p>
              <p className='text-sm text-gray-400 mt-1'>
                Powered by premium technology and passion for excellence.
              </p>
            </div>
            <div className='flex flex-wrap justify-center gap-6'>
              <Link
                href='/privacy-policy'
                className='hover:text-brand-orange transition-colors duration-200 font-medium'
              >
                Privacy Policy
              </Link>
              <Link
                href='/terms-conditions'
                className='hover:text-brand-orange transition-colors duration-200 font-medium'
              >
                Terms of Service
              </Link>
              <Link
                href='/return-refund-policy'
                className='hover:text-brand-orange transition-colors duration-200 font-medium'
              >
                Return Policy
              </Link>
              <Link
                href='/shipping-policy'
                className='hover:text-brand-orange transition-colors duration-200 font-medium'
              >
                Shipping Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
