import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Truck, Clock, MapPin, Shield } from 'lucide-react';

export default function ShippingPolicy() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-4xl mx-auto'>
          <Card>
            <CardHeader>
              <CardTitle className='text-3xl font-bold text-center'>
                Shipping Policy
              </CardTitle>
              <p className='text-center text-gray-600'>
                Last updated: January 2024
              </p>
            </CardHeader>
            <CardContent className='prose max-w-none'>
              <div className='space-y-6'>
                <section>
                  <h2 className='text-2xl font-semibold mb-4'>
                    1. Shipping Overview
                  </h2>
                  <p className='text-gray-700 leading-relaxed'>
                    Autodeal4U is committed to delivering your tyres and
                    automotive products safely and efficiently. We offer
                    multiple shipping options to meet your needs and ensure your
                    products reach you in perfect condition.
                  </p>
                </section>

                <Separator />

                <section>
                  <h2 className='text-2xl font-semibold mb-4'>
                    2. Delivery Areas
                  </h2>
                  <div className='grid md:grid-cols-2 gap-6'>
                    <div className='p-4 bg-green-50 border border-green-200 rounded-lg'>
                      <div className='flex items-center mb-3'>
                        <MapPin className='h-5 w-5 text-green-600 mr-2' />
                        <h3 className='text-lg font-medium text-green-800'>
                          Metro Cities
                        </h3>
                      </div>
                      <ul className='space-y-1 text-green-700'>
                        <li>• Mumbai, Delhi, Bangalore, Chennai</li>
                        <li>• Hyderabad, Pune, Kolkata, Ahmedabad</li>
                        <li>• Same-day delivery available</li>
                        <li>• Free installation service</li>
                      </ul>
                    </div>
                    <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                      <div className='flex items-center mb-3'>
                        <Truck className='h-5 w-5 text-blue-600 mr-2' />
                        <h3 className='text-lg font-medium text-blue-800'>
                          Other Cities
                        </h3>
                      </div>
                      <ul className='space-y-1 text-blue-700'>
                        <li>• 500+ cities across India</li>
                        <li>• Standard delivery: 2-5 business days</li>
                        <li>• Partner installation network</li>
                        <li>• Express delivery available</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <Separator />

                <section>
                  <h2 className='text-2xl font-semibold mb-4'>
                    3. Delivery Options
                  </h2>
                  <div className='space-y-4'>
                    <div className='grid md:grid-cols-3 gap-4'>
                      <div className='p-4 border rounded-lg'>
                        <div className='flex items-center mb-3'>
                          <Clock className='h-5 w-5 text-orange-600 mr-2' />
                          <h3 className='font-medium'>Same Day Delivery</h3>
                        </div>
                        <p className='text-sm text-gray-600 mb-2'>
                          Available in select metro cities
                        </p>
                        <p className='text-lg font-bold text-orange-600'>
                          ₹299
                        </p>
                        <p className='text-xs text-gray-500'>
                          Order before 2 PM
                        </p>
                      </div>
                      <div className='p-4 border rounded-lg'>
                        <div className='flex items-center mb-3'>
                          <Truck className='h-5 w-5 text-blue-600 mr-2' />
                          <h3 className='font-medium'>Express Delivery</h3>
                        </div>
                        <p className='text-sm text-gray-600 mb-2'>
                          1-2 business days
                        </p>
                        <p className='text-lg font-bold text-blue-600'>₹199</p>
                        <p className='text-xs text-gray-500'>
                          Major cities only
                        </p>
                      </div>
                      <div className='p-4 border rounded-lg'>
                        <div className='flex items-center mb-3'>
                          <Shield className='h-5 w-5 text-green-600 mr-2' />
                          <h3 className='font-medium'>Standard Delivery</h3>
                        </div>
                        <p className='text-sm text-gray-600 mb-2'>
                          3-5 business days
                        </p>
                        <p className='text-lg font-bold text-green-600'>Free</p>
                        <p className='text-xs text-gray-500'>
                          Orders above ₹5,000
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <Separator />

                <section>
                  <h2 className='text-2xl font-semibold mb-4'>
                    4. Shipping Charges
                  </h2>
                  <div className='space-y-4'>
                    <div className='overflow-x-auto'>
                      <table className='w-full border-collapse border border-gray-300'>
                        <thead>
                          <tr className='bg-gray-100'>
                            <th className='border border-gray-300 p-3 text-left'>
                              Order Value
                            </th>
                            <th className='border border-gray-300 p-3 text-left'>
                              Metro Cities
                            </th>
                            <th className='border border-gray-300 p-3 text-left'>
                              Other Cities
                            </th>
                            <th className='border border-gray-300 p-3 text-left'>
                              Remote Areas
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className='border border-gray-300 p-3'>
                              Above ₹10,000
                            </td>
                            <td className='border border-gray-300 p-3 text-green-600 font-medium'>
                              Free
                            </td>
                            <td className='border border-gray-300 p-3 text-green-600 font-medium'>
                              Free
                            </td>
                            <td className='border border-gray-300 p-3'>₹299</td>
                          </tr>
                          <tr className='bg-gray-50'>
                            <td className='border border-gray-300 p-3'>
                              ₹5,000 - ₹9,999
                            </td>
                            <td className='border border-gray-300 p-3 text-green-600 font-medium'>
                              Free
                            </td>
                            <td className='border border-gray-300 p-3'>₹199</td>
                            <td className='border border-gray-300 p-3'>₹399</td>
                          </tr>
                          <tr>
                            <td className='border border-gray-300 p-3'>
                              Below ₹5,000
                            </td>
                            <td className='border border-gray-300 p-3'>₹199</td>
                            <td className='border border-gray-300 p-3'>₹299</td>
                            <td className='border border-gray-300 p-3'>₹499</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>

                <Separator />

                <section>
                  <h2 className='text-2xl font-semibold mb-4'>
                    5. Processing Time
                  </h2>
                  <div className='space-y-4'>
                    <div className='grid md:grid-cols-2 gap-4'>
                      <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                        <h3 className='font-medium mb-2'>In-Stock Items</h3>
                        <ul className='space-y-1 text-blue-700'>
                          <li>• Same day processing for orders before 2 PM</li>
                          <li>• Next business day for orders after 2 PM</li>
                          <li>• Weekend orders processed on Monday</li>
                        </ul>
                      </div>
                      <div className='p-4 bg-orange-50 border border-orange-200 rounded-lg'>
                        <h3 className='font-medium mb-2'>Special Orders</h3>
                        <ul className='space-y-1 text-orange-700'>
                          <li>• Custom sizes: 3-7 business days</li>
                          <li>• Import items: 10-15 business days</li>
                          <li>• Bulk orders: 2-5 business days</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                <Separator />

                <section>
                  <h2 className='text-2xl font-semibold mb-4'>
                    6. Installation Services
                  </h2>
                  <div className='space-y-4'>
                    <p className='text-gray-700 leading-relaxed'>
                      We offer professional installation services through our
                      network of certified partners:
                    </p>
                    <div className='grid md:grid-cols-2 gap-4'>
                      <div className='p-4 border rounded-lg'>
                        <h3 className='font-medium mb-2'>Home Installation</h3>
                        <ul className='space-y-1 text-gray-700'>
                          <li>• Available in metro cities</li>
                          <li>• ₹200 per tyre installation</li>
                          <li>• Includes balancing and alignment check</li>
                          <li>• 2-hour time slot booking</li>
                        </ul>
                      </div>
                      <div className='p-4 border rounded-lg'>
                        <h3 className='font-medium mb-2'>
                          Workshop Installation
                        </h3>
                        <ul className='space-y-1 text-gray-700'>
                          <li>• 500+ partner workshops</li>
                          <li>• Free installation on orders above ₹8,000</li>
                          <li>• Professional equipment and tools</li>
                          <li>• Warranty on installation work</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                <Separator />

                <section>
                  <h2 className='text-2xl font-semibold mb-4'>
                    7. Tracking Your Order
                  </h2>
                  <div className='space-y-4'>
                    <p className='text-gray-700 leading-relaxed'>
                      Stay updated on your order status with our tracking
                      system:
                    </p>
                    <ul className='list-disc list-inside space-y-1 text-gray-700'>
                      <li>SMS and email notifications at each stage</li>
                      <li>Real-time tracking through our website</li>
                      <li>Delivery partner contact details</li>
                      <li>Estimated delivery time updates</li>
                    </ul>
                  </div>
                </section>

                <Separator />

                <section>
                  <h2 className='text-2xl font-semibold mb-4'>
                    8. Delivery Guidelines
                  </h2>
                  <div className='space-y-4'>
                    <div className='p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
                      <h3 className='font-medium mb-2'>Important Notes:</h3>
                      <ul className='space-y-1 text-yellow-700'>
                        <li>
                          • Someone must be present to receive the delivery
                        </li>
                        <li>• Valid ID proof required for high-value orders</li>
                        <li>• Inspect products before accepting delivery</li>
                        <li>
                          • Report any damage immediately to delivery partner
                        </li>
                        <li>
                          • Installation appointments must be scheduled
                          separately
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                <Separator />

                <section>
                  <h2 className='text-2xl font-semibold mb-4'>
                    9. Special Circumstances
                  </h2>
                  <div className='space-y-4'>
                    <div>
                      <h3 className='text-xl font-medium mb-2'>
                        Weather Delays
                      </h3>
                      <p className='text-gray-700 leading-relaxed'>
                        Deliveries may be delayed during severe weather
                        conditions, natural disasters, or other unforeseen
                        circumstances. We will notify you of any delays and
                        provide updated delivery estimates.
                      </p>
                    </div>
                    <div>
                      <h3 className='text-xl font-medium mb-2'>
                        Festival Seasons
                      </h3>
                      <p className='text-gray-700 leading-relaxed'>
                        During festival seasons and peak periods, delivery times
                        may be extended by 1-2 business days. We recommend
                        placing orders early during these periods.
                      </p>
                    </div>
                  </div>
                </section>

                <Separator />

                <section>
                  <h2 className='text-2xl font-semibold mb-4'>
                    10. Contact Information
                  </h2>
                  <p className='text-gray-700 leading-relaxed mb-4'>
                    For shipping-related queries or support:
                  </p>
                  <div className='grid md:grid-cols-2 gap-4'>
                    <div className='p-4 bg-gray-100 rounded-lg'>
                      <h3 className='font-medium mb-2'>Shipping Support</h3>
                      <p>Phone: +91 98765 43210</p>
                      <p>Email: shipping@hanumantyres.com</p>
                      <p>WhatsApp: +91 98765 43210</p>
                      <p>Hours: Mon-Sat 9:00 AM - 7:00 PM</p>
                    </div>
                    <div className='p-4 bg-gray-100 rounded-lg'>
                      <h3 className='font-medium mb-2'>Installation Support</h3>
                      <p>Phone: +91 98765 43211</p>
                      <p>Email: installation@hanumantyres.com</p>
                      <p>Hours: Mon-Sat 8:00 AM - 8:00 PM</p>
                      <p>Sunday: 10:00 AM - 6:00 PM</p>
                    </div>
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
