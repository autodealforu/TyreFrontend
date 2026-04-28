import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function ReturnRefundPolicy() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-4xl mx-auto'>
          <Card>
            <CardHeader>
              <CardTitle className='text-3xl font-bold text-center'>
                Return and Refund Policy
              </CardTitle>
              <p className='text-center text-gray-600'>
                Last updated: January 2024
              </p>
            </CardHeader>
            <CardContent className='prose max-w-none'>
              <div className='space-y-6'>
                <section>
                  <h2 className='text-2xl font-semibold mb-4'>1. Overview</h2>
                  <p className='text-gray-700 leading-relaxed'>
                    At Autodeal4U, we want you to be completely satisfied with
                    your purchase. This Return and Refund Policy outlines the
                    conditions under which returns and refunds are accepted for
                    our products and services.
                  </p>
                </section>

                <Separator />

                <section>
                  <h2 className='text-2xl font-semibold mb-4'>
                    2. Return Eligibility
                  </h2>

                  <div className='grid md:grid-cols-2 gap-6 mb-6'>
                    <div className='p-4 bg-green-50 border border-green-200 rounded-lg'>
                      <div className='flex items-center mb-3'>
                        <CheckCircle className='h-5 w-5 text-green-600 mr-2' />
                        <h3 className='text-lg font-medium text-green-800'>
                          Returnable Items
                        </h3>
                      </div>
                      <ul className='space-y-2 text-green-700'>
                        <li>• Unused tyres in original packaging</li>
                        <li>• Defective products within warranty</li>
                        <li>• Wrong items delivered</li>
                        <li>• Damaged products during shipping</li>
                        <li>• Wheels and accessories (unused)</li>
                      </ul>
                    </div>

                    <div className='p-4 bg-red-50 border border-red-200 rounded-lg'>
                      <div className='flex items-center mb-3'>
                        <XCircle className='h-5 w-5 text-red-600 mr-2' />
                        <h3 className='text-lg font-medium text-red-800'>
                          Non-Returnable Items
                        </h3>
                      </div>
                      <ul className='space-y-2 text-red-700'>
                        <li>• Installed or mounted tyres</li>
                        <li>• Used or damaged products</li>
                        <li>• Custom or special order items</li>
                        <li>• Services already performed</li>
                        <li>• Items beyond return period</li>
                      </ul>
                    </div>
                  </div>

                  <div className='p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
                    <div className='flex items-start'>
                      <AlertCircle className='h-5 w-5 text-yellow-600 mr-2 mt-0.5' />
                      <div>
                        <h3 className='text-lg font-medium text-yellow-800 mb-2'>
                          Important Note
                        </h3>
                        <p className='text-yellow-700'>
                          Once tyres are installed or mounted, they cannot be
                          returned unless they are defective or covered under
                          manufacturer warranty.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <Separator />

                <section>
                  <h2 className='text-2xl font-semibold mb-4'>
                    3. Return Time Limits
                  </h2>
                  <div className='space-y-4'>
                    <div className='grid md:grid-cols-3 gap-4'>
                      <div className='p-4 border rounded-lg'>
                        <h3 className='font-medium mb-2'>Unused Tyres</h3>
                        <p className='text-2xl font-bold text-blue-600'>
                          7 Days
                        </p>
                        <p className='text-sm text-gray-600'>
                          From delivery date
                        </p>
                      </div>
                      <div className='p-4 border rounded-lg'>
                        <h3 className='font-medium mb-2'>Defective Products</h3>
                        <p className='text-2xl font-bold text-green-600'>
                          30 Days
                        </p>
                        <p className='text-sm text-gray-600'>
                          From delivery date
                        </p>
                      </div>
                      <div className='p-4 border rounded-lg'>
                        <h3 className='font-medium mb-2'>Wrong Items</h3>
                        <p className='text-2xl font-bold text-orange-600'>
                          48 Hours
                        </p>
                        <p className='text-sm text-gray-600'>
                          From delivery date
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <Separator />

                <section>
                  <h2 className='text-2xl font-semibold mb-4'>
                    4. Return Process
                  </h2>
                  <div className='space-y-4'>
                    <div className='grid md:grid-cols-4 gap-4'>
                      <div className='text-center p-4 border rounded-lg'>
                        <div className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2'>
                          1
                        </div>
                        <h3 className='font-medium mb-2'>Contact Us</h3>
                        <p className='text-sm text-gray-600'>
                          Call or email our customer service team
                        </p>
                      </div>
                      <div className='text-center p-4 border rounded-lg'>
                        <div className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2'>
                          2
                        </div>
                        <h3 className='font-medium mb-2'>Get RMA Number</h3>
                        <p className='text-sm text-gray-600'>
                          Receive Return Merchandise Authorization
                        </p>
                      </div>
                      <div className='text-center p-4 border rounded-lg'>
                        <div className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2'>
                          3
                        </div>
                        <h3 className='font-medium mb-2'>Package Items</h3>
                        <p className='text-sm text-gray-600'>
                          Pack items in original packaging
                        </p>
                      </div>
                      <div className='text-center p-4 border rounded-lg'>
                        <div className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2'>
                          4
                        </div>
                        <h3 className='font-medium mb-2'>Ship Back</h3>
                        <p className='text-sm text-gray-600'>
                          Send items to our return center
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <Separator />

                <section>
                  <h2 className='text-2xl font-semibold mb-4'>
                    5. Refund Policy
                  </h2>
                  <div className='space-y-4'>
                    <div>
                      <h3 className='text-xl font-medium mb-2'>
                        Refund Methods
                      </h3>
                      <ul className='list-disc list-inside space-y-1 text-gray-700'>
                        <li>Original payment method (preferred)</li>
                        <li>Bank transfer for cash payments</li>
                        <li>Store credit (if requested)</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className='text-xl font-medium mb-2'>
                        Refund Timeline
                      </h3>
                      <ul className='list-disc list-inside space-y-1 text-gray-700'>
                        <li>Credit/Debit Cards: 5-7 business days</li>
                        <li>UPI/Net Banking: 3-5 business days</li>
                        <li>Cash on Delivery: 7-10 business days</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className='text-xl font-medium mb-2'>
                        Refund Deductions
                      </h3>
                      <ul className='list-disc list-inside space-y-1 text-gray-700'>
                        <li>Return shipping charges (if not our fault)</li>
                        <li>Restocking fee for special orders (15%)</li>
                        <li>Installation charges (non-refundable)</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <Separator />

                <section>
                  <h2 className='text-2xl font-semibold mb-4'>6. Exchanges</h2>
                  <p className='text-gray-700 leading-relaxed mb-4'>
                    We offer exchanges for:
                  </p>
                  <ul className='list-disc list-inside space-y-1 text-gray-700'>
                    <li>Wrong size or specification delivered</li>
                    <li>Defective products within warranty period</li>
                    <li>
                      Size changes (subject to availability and price
                      difference)
                    </li>
                  </ul>
                  <p className='text-gray-700 leading-relaxed mt-4'>
                    Exchange requests must be made within 7 days of delivery for
                    unused items.
                  </p>
                </section>

                <Separator />

                <section>
                  <h2 className='text-2xl font-semibold mb-4'>
                    7. Warranty Claims
                  </h2>
                  <p className='text-gray-700 leading-relaxed mb-4'>
                    For warranty-related issues:
                  </p>
                  <ul className='list-disc list-inside space-y-1 text-gray-700'>
                    <li>Contact us with order details and issue description</li>
                    <li>Provide photos of the defect or damage</li>
                    <li>We will coordinate with the manufacturer</li>
                    <li>
                      Replacement or repair will be provided as per warranty
                      terms
                    </li>
                  </ul>
                </section>

                <Separator />

                <section>
                  <h2 className='text-2xl font-semibold mb-4'>
                    8. Contact for Returns
                  </h2>
                  <p className='text-gray-700 leading-relaxed mb-4'>
                    To initiate a return or for any questions about our return
                    policy:
                  </p>
                  <div className='grid md:grid-cols-2 gap-4'>
                    <div className='p-4 bg-gray-100 rounded-lg'>
                      <h3 className='font-medium mb-2'>Customer Service</h3>
                      <p>Phone: +91 98765 43210</p>
                      <p>Email: returns@hanumantyres.com</p>
                      <p>Hours: Mon-Sat 9:00 AM - 7:00 PM</p>
                    </div>
                    <div className='p-4 bg-gray-100 rounded-lg'>
                      <h3 className='font-medium mb-2'>Return Address</h3>
                      <p>Autodeal4U Return Center</p>
                      <p>123 Main Street</p>
                      <p>Mumbai, Maharashtra 400001</p>
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
