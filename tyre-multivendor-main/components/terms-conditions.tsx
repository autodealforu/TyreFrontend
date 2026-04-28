import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function TermsConditions() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-4xl mx-auto'>
          <Card>
            <CardHeader>
              <CardTitle className='text-3xl font-bold text-center'>
                Terms and Conditions
              </CardTitle>
              <p className='text-center text-gray-600'>
                Last updated: January 2024
              </p>
            </CardHeader>
            <CardContent className='prose max-w-none'>
              <div className='space-y-6'>
                <section>
                  <h2 className='text-2xl font-semibold mb-4'>
                    1. Acceptance of Terms
                  </h2>
                  <p className='text-gray-700 leading-relaxed'>
                    By accessing and using the Autodeal4U website and services,
                    you accept and agree to be bound by the terms and provision
                    of this agreement. If you do not agree to abide by the
                    above, please do not use this service.
                  </p>
                </section>

                <Separator />

                <section>
                  <h2 className='text-2xl font-semibold mb-4'>
                    2. Definitions
                  </h2>
                  <ul className='list-disc list-inside space-y-2 text-gray-700'>
                    <li>
                      <strong>"Company"</strong> refers to Autodeal4U
                    </li>
                    <li>
                      <strong>"User"</strong> refers to anyone who accesses our
                      website or services
                    </li>
                    <li>
                      <strong>"Products"</strong> refers to tyres, wheels, and
                      related automotive products
                    </li>
                    <li>
                      <strong>"Services"</strong> refers to installation,
                      balancing, alignment, and maintenance services
                    </li>
                  </ul>
                </section>

                <Separator />

                <section>
                  <h2 className='text-2xl font-semibold mb-4'>
                    3. Product Information and Pricing
                  </h2>
                  <div className='space-y-4'>
                    <p className='text-gray-700 leading-relaxed'>
                      We strive to provide accurate product information and
                      pricing. However:
                    </p>
                    <ul className='list-disc list-inside space-y-1 text-gray-700'>
                      <li>Product specifications may vary by manufacturer</li>
                      <li>Prices are subject to change without notice</li>
                      <li>
                        All prices are in Indian Rupees (₹) and include
                        applicable taxes
                      </li>
                      <li>Installation charges may apply separately</li>
                      <li>We reserve the right to correct pricing errors</li>
                    </ul>
                  </div>
                </section>

                <Separator />

                <section>
                  <h2 className='text-2xl font-semibold mb-4'>
                    4. Orders and Payment
                  </h2>
                  <div className='space-y-4'>
                    <div>
                      <h3 className='text-xl font-medium mb-2'>
                        Order Acceptance
                      </h3>
                      <p className='text-gray-700 leading-relaxed'>
                        All orders are subject to acceptance and availability.
                        We reserve the right to refuse or cancel any order for
                        any reason, including but not limited to product
                        availability, errors in pricing, or suspected fraudulent
                        activity.
                      </p>
                    </div>
                    <div>
                      <h3 className='text-xl font-medium mb-2'>
                        Payment Terms
                      </h3>
                      <ul className='list-disc list-inside space-y-1 text-gray-700'>
                        <li>
                          Payment is required at the time of order placement
                        </li>
                        <li>
                          We accept major credit cards, debit cards, UPI, and
                          net banking
                        </li>
                        <li>
                          Cash on delivery may be available for select locations
                        </li>
                        <li>All transactions are processed securely</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <Separator />

                <section>
                  <h2 className='text-2xl font-semibold mb-4'>
                    5. Delivery and Installation
                  </h2>
                  <div className='space-y-4'>
                    <p className='text-gray-700 leading-relaxed'>
                      Delivery times are estimates and may vary based on
                      location and product availability. Installation services
                      are provided by our certified partners and are subject to
                      additional terms.
                    </p>
                    <ul className='list-disc list-inside space-y-1 text-gray-700'>
                      <li>Delivery charges may apply based on location</li>
                      <li>
                        Installation appointments must be scheduled in advance
                      </li>
                      <li>Customer must be present during installation</li>
                      <li>
                        Additional charges may apply for complex installations
                      </li>
                    </ul>
                  </div>
                </section>

                <Separator />

                <section>
                  <h2 className='text-2xl font-semibold mb-4'>
                    6. Warranties and Disclaimers
                  </h2>
                  <div className='space-y-4'>
                    <p className='text-gray-700 leading-relaxed'>
                      Product warranties are provided by the respective
                      manufacturers. Autodeal4U acts as a retailer and
                      facilitates warranty claims but does not provide
                      independent warranties unless explicitly stated.
                    </p>
                    <ul className='list-disc list-inside space-y-1 text-gray-700'>
                      <li>Manufacturer warranties apply to all products</li>
                      <li>
                        Installation services carry a 30-day workmanship
                        warranty
                      </li>
                      <li>
                        Warranty claims must be made within the specified period
                      </li>
                      <li>
                        Normal wear and tear is not covered under warranty
                      </li>
                    </ul>
                  </div>
                </section>

                <Separator />

                <section>
                  <h2 className='text-2xl font-semibold mb-4'>
                    7. User Responsibilities
                  </h2>
                  <p className='text-gray-700 leading-relaxed mb-4'>
                    Users are responsible for:
                  </p>
                  <ul className='list-disc list-inside space-y-1 text-gray-700'>
                    <li>
                      Providing accurate information during registration and
                      ordering
                    </li>
                    <li>
                      Maintaining the security of their account credentials
                    </li>
                    <li>
                      Using the website in accordance with applicable laws
                    </li>
                    <li>Not engaging in fraudulent or harmful activities</li>
                    <li>Proper maintenance of purchased products</li>
                  </ul>
                </section>

                <Separator />

                <section>
                  <h2 className='text-2xl font-semibold mb-4'>
                    8. Limitation of Liability
                  </h2>
                  <p className='text-gray-700 leading-relaxed'>
                    Autodeal4U shall not be liable for any indirect, incidental,
                    special, consequential, or punitive damages, including but
                    not limited to loss of profits, data, or use, incurred by
                    you or any third party, whether in an action in contract or
                    tort, even if we have been advised of the possibility of
                    such damages.
                  </p>
                </section>

                <Separator />

                <section>
                  <h2 className='text-2xl font-semibold mb-4'>
                    9. Governing Law
                  </h2>
                  <p className='text-gray-700 leading-relaxed'>
                    These terms and conditions are governed by and construed in
                    accordance with the laws of India. Any disputes arising
                    under these terms shall be subject to the exclusive
                    jurisdiction of the courts in Mumbai, Maharashtra.
                  </p>
                </section>

                <Separator />

                <section>
                  <h2 className='text-2xl font-semibold mb-4'>
                    10. Contact Information
                  </h2>
                  <p className='text-gray-700 leading-relaxed'>
                    For questions about these Terms and Conditions, please
                    contact us:
                  </p>
                  <div className='mt-4 p-4 bg-gray-100 rounded-lg'>
                    <p className='font-medium'>Autodeal4U</p>
                    <p>Email: legal@hanumantyres.com</p>
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
