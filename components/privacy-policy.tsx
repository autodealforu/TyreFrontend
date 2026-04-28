import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function PrivacyPolicy() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-4xl mx-auto'>
          <Card>
            <CardHeader>
              <CardTitle className='text-3xl font-bold text-center'>
                Privacy Policy
              </CardTitle>
              <p className='text-center text-gray-600'>
                Last updated: January 2024
              </p>
            </CardHeader>
            <CardContent className='prose max-w-none'>
              <div className='space-y-6'>
                <section>
                  <h2 className='text-2xl font-semibold mb-4'>
                    1. Introduction
                  </h2>
                  <p className='text-gray-700 leading-relaxed'>
                    Autodeal4U ("we," "our," or "us") is committed to protecting
                    your privacy. This Privacy Policy explains how we collect,
                    use, disclose, and safeguard your information when you visit
                    our website or use our services. Please read this privacy
                    policy carefully. If you do not agree with the terms of this
                    privacy policy, please do not access the site.
                  </p>
                </section>

                <Separator />

                <section>
                  <h2 className='text-2xl font-semibold mb-4'>
                    2. Information We Collect
                  </h2>
                  <div className='space-y-4'>
                    <div>
                      <h3 className='text-xl font-medium mb-2'>
                        Personal Information
                      </h3>
                      <p className='text-gray-700 leading-relaxed'>
                        We may collect personal information that you voluntarily
                        provide to us when you:
                      </p>
                      <ul className='list-disc list-inside mt-2 space-y-1 text-gray-700'>
                        <li>Register for an account</li>
                        <li>Make a purchase</li>
                        <li>Subscribe to our newsletter</li>
                        <li>Contact us for support</li>
                        <li>Book installation or service appointments</li>
                      </ul>
                      <p className='text-gray-700 leading-relaxed mt-2'>
                        This information may include: name, email address, phone
                        number, postal address, payment information, vehicle
                        details, and service preferences.
                      </p>
                    </div>

                    <div>
                      <h3 className='text-xl font-medium mb-2'>
                        Automatically Collected Information
                      </h3>
                      <p className='text-gray-700 leading-relaxed'>
                        We automatically collect certain information when you
                        visit our website, including:
                      </p>
                      <ul className='list-disc list-inside mt-2 space-y-1 text-gray-700'>
                        <li>IP address and browser information</li>
                        <li>Device information and operating system</li>
                        <li>Pages visited and time spent on our site</li>
                        <li>Referring website information</li>
                        <li>Location data (with your permission)</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <Separator />

                <section>
                  <h2 className='text-2xl font-semibold mb-4'>
                    3. How We Use Your Information
                  </h2>
                  <p className='text-gray-700 leading-relaxed mb-4'>
                    We use the information we collect for various purposes,
                    including:
                  </p>
                  <ul className='list-disc list-inside space-y-1 text-gray-700'>
                    <li>Processing and fulfilling your orders</li>
                    <li>Providing customer support and service</li>
                    <li>
                      Scheduling installation and maintenance appointments
                    </li>
                    <li>Sending order confirmations and updates</li>
                    <li>Improving our website and services</li>
                    <li>Personalizing your shopping experience</li>
                    <li>Sending promotional emails (with your consent)</li>
                    <li>Preventing fraud and ensuring security</li>
                    <li>Complying with legal obligations</li>
                  </ul>
                </section>

                <Separator />

                <section>
                  <h2 className='text-2xl font-semibold mb-4'>
                    4. Information Sharing and Disclosure
                  </h2>
                  <p className='text-gray-700 leading-relaxed mb-4'>
                    We do not sell, trade, or rent your personal information to
                    third parties. We may share your information in the
                    following circumstances:
                  </p>
                  <ul className='list-disc list-inside space-y-1 text-gray-700'>
                    <li>
                      With service providers who assist us in operating our
                      business
                    </li>
                    <li>With delivery partners for order fulfillment</li>
                    <li>
                      With installation partners for tyre fitting services
                    </li>
                    <li>When required by law or to protect our rights</li>
                    <li>In connection with a business transfer or merger</li>
                  </ul>
                </section>

                <Separator />

                <section>
                  <h2 className='text-2xl font-semibold mb-4'>
                    5. Data Security
                  </h2>
                  <p className='text-gray-700 leading-relaxed'>
                    We implement appropriate security measures to protect your
                    personal information against unauthorized access,
                    alteration, disclosure, or destruction. However, no method
                    of transmission over the internet or electronic storage is
                    100% secure, and we cannot guarantee absolute security.
                  </p>
                </section>

                <Separator />

                <section>
                  <h2 className='text-2xl font-semibold mb-4'>
                    6. Your Rights
                  </h2>
                  <p className='text-gray-700 leading-relaxed mb-4'>
                    You have the right to:
                  </p>
                  <ul className='list-disc list-inside space-y-1 text-gray-700'>
                    <li>Access and update your personal information</li>
                    <li>Request deletion of your personal data</li>
                    <li>Opt-out of marketing communications</li>
                    <li>Request data portability</li>
                    <li>Lodge a complaint with relevant authorities</li>
                  </ul>
                </section>

                <Separator />

                <section>
                  <h2 className='text-2xl font-semibold mb-4'>
                    7. Cookies and Tracking
                  </h2>
                  <p className='text-gray-700 leading-relaxed'>
                    We use cookies and similar tracking technologies to enhance
                    your browsing experience, analyze website traffic, and
                    personalize content. You can control cookie settings through
                    your browser preferences.
                  </p>
                </section>

                <Separator />

                <section>
                  <h2 className='text-2xl font-semibold mb-4'>8. Contact Us</h2>
                  <p className='text-gray-700 leading-relaxed'>
                    If you have any questions about this Privacy Policy, please
                    contact us at:
                  </p>
                  <div className='mt-4 p-4 bg-gray-100 rounded-lg'>
                    <p className='font-medium'>Autodeal4U</p>
                    <p>Email: privacy@hanumantyres.com</p>
                    <p>Phone: +91 98765 43210</p>
                    <p>Address: 123 Main Street, Mumbai, Maharashtra 400001</p>
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
