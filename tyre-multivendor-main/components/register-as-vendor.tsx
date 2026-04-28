'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Upload, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { FileUpload } from './form/file-upload';
import { registerVendor } from '@/actions/vendor.action';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/pdf',
];

const vendorRegistrationSchema = z.object({
  // Personal Information
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),

  vendor: z.object({
    store_name: z.string().min(2, 'Store name must be at least 2 characters'),
    store_description: z
      .string()
      .min(10, 'Store description must be at least 10 characters'),

    // Pickup Address (array of addresses)
    pickup_address: z
      .array(
        z.object({
          address_1: z.string().min(2, 'Address Line 1 is required'),
          address_2: z.string().optional(),
          city: z.string().min(2, 'City is required'),
          state: z.string().min(2, 'State is required'),
          pin: z.string().min(4, 'PIN is required'),
          landmark: z.string().optional(),
        })
      )
      .min(1, 'At least one pickup address is required'),

    // GST Information
    gst_no: z
      .string()
      .regex(
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        'Please enter a valid GST number'
      ),
    gst_certificate: z.string().min(1, 'Required.'),

    // PAN Information
    pan_no: z
      .string()
      .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter a valid PAN number'),
    pan: z.string().min(1, 'Required.'),

    // Aadhaar Information
    adhaar_no: z
      .string()
      .regex(
        /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/,
        'Please enter a valid 12-digit Aadhaar number'
      ),
    adhaar_certificate_front: z.string().min(1, 'Required.'),
    adhaar_certificate_back: z.string().min(1, 'Required.'),
  }),
});

type VendorRegistrationForm = z.infer<typeof vendorRegistrationSchema>;

export default function VendorRegistration() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<VendorRegistrationForm>({
    resolver: zodResolver(vendorRegistrationSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      password: '',
      vendor: {
        store_name: '',
        store_description: '',
        pickup_address: [
          {
            address_1: '',
            address_2: '',
            city: '',
            state: '',
            pin: '',
            landmark: '',
          },
        ],
        gst_no: '',
        pan_no: '',
        adhaar_no: '',
      },
    },
  });

  const onSubmit = async (data: VendorRegistrationForm) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      const finalData = { ...data, username: data.email };
      const vendorRegistrationData = await registerVendor(finalData);
      if (vendorRegistrationData?.data) {
        console.log('Vendor registration data:', data);
        toast.success(
          'Vendor registration submitted successfully! We will review your application and get back to you within 2-3 business days.'
        );
        form.reset();
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  form.watch('vendor');
  console.log('form values', form.getValues());

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='container mx-auto px-4 max-w-4xl'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Register as Vendor
          </h1>
          <p className='text-gray-600'>
            Join Autodeal4U network and grow your business with us
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Vendor Registration Form</CardTitle>
            <CardDescription>
              Please fill out all the required information to register as a
              vendor partner
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-8'
              >
                {/* Personal Information Section */}
                <div>
                  <h3 className='text-lg font-semibold mb-4'>
                    Personal Information
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <FormField
                      control={form.control}
                      name='name'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Enter your full name'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='phone'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Enter 10-digit mobile number'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input
                              type='email'
                              placeholder='Enter your email'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='password'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password *</FormLabel>
                          <FormControl>
                            <div className='relative'>
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder='Create a strong password'
                                {...field}
                              />
                              <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className='h-4 w-4' />
                                ) : (
                                  <Eye className='h-4 w-4' />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* Pickup Address Section */}
                <div>
                  <h3 className='text-lg font-semibold mb-4'>
                    Pickup Addresses
                  </h3>
                  {form.watch('vendor.pickup_address').map((address, idx) => (
                    <div
                      key={idx}
                      className='mb-6 p-4 border rounded-lg bg-slate-50'
                    >
                      <div className='flex justify-between items-center mb-2'>
                        <span className='font-semibold'>
                          Pickup Address #{idx + 1}
                        </span>
                        {form.watch('vendor.pickup_address').length > 1 && (
                          <Button
                            type='button'
                            variant='destructive'
                            size='sm'
                            onClick={() => {
                              const updated = [
                                ...form.getValues('vendor.pickup_address'),
                              ];
                              updated.splice(idx, 1);
                              form.setValue('vendor.pickup_address', updated);
                            }}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <FormField
                          control={form.control}
                          name={`vendor.pickup_address.${idx}.address_1`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address Line 1 *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Enter address line 1'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`vendor.pickup_address.${idx}.address_2`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address Line 2</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Enter address line 2 (optional)'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`vendor.pickup_address.${idx}.city`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City *</FormLabel>
                              <FormControl>
                                <Input placeholder='Enter city' {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`vendor.pickup_address.${idx}.state`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State *</FormLabel>
                              <FormControl>
                                <Input placeholder='Enter state' {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`vendor.pickup_address.${idx}.pin`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>PIN *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Enter PIN code'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`vendor.pickup_address.${idx}.landmark`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Landmark</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='Enter landmark (optional)'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => {
                      const updated = [
                        ...form.getValues('vendor.pickup_address'),
                      ];
                      updated.push({
                        address_1: '',
                        address_2: '',
                        city: '',
                        state: '',
                        pin: '',
                        landmark: '',
                      });
                      form.setValue('vendor.pickup_address', updated);
                    }}
                  >
                    Add Another Pickup Address
                  </Button>
                </div>

                <Separator />

                {/* Store Information Section */}
                <div>
                  <h3 className='text-lg font-semibold mb-4'>
                    Store Information
                  </h3>
                  <div className='space-y-6'>
                    <FormField
                      control={form.control}
                      name='vendor.store_name'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Store Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Enter your store name'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='vendor.store_description'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Store Description *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='Describe your store, services, and specializations'
                              className='min-h-[100px]'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className='text-lg font-semibold mb-4'>
                    GST Information
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <FormField
                      control={form.control}
                      name='vendor.gst_no'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GST Number *</FormLabel>
                          <FormControl>
                            <Input placeholder='22AAAAA0000A1Z5' {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter your 15-digit GST registration number
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div>
                      <FormField
                        control={form.control}
                        name='vendor.gst_certificate'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>GST Certificate *</FormLabel>
                            <FormControl>
                              <FileUpload
                                form={form}
                                name='vendor.gst_certificate'
                                value={field?.value}
                                hide={true}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* PAN Information Section */}
                <div>
                  <h3 className='text-lg font-semibold mb-4'>
                    PAN Information
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <FormField
                      control={form.control}
                      name='vendor.pan_no'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PAN Number *</FormLabel>
                          <FormControl>
                            <Input placeholder='ABCDE1234F' {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter your 10-character PAN number
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <FormField
                        control={form.control}
                        name='vendor.pan'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>PAN *</FormLabel>
                            <FormControl>
                              <FileUpload
                                form={form}
                                name='vendor.pan'
                                value={field?.value}
                                hide={true}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className='text-lg font-semibold mb-4'>
                    Aadhaar Information
                  </h3>
                  <div className='space-y-6'>
                    <FormField
                      control={form.control}
                      name='vendor.adhaar_no'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Aadhaar Number *</FormLabel>
                          <FormControl>
                            <Input placeholder='1234 5678 9012' {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter your 12-digit Aadhaar number
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <FormField
                        control={form.control}
                        name='vendor.adhaar_certificate_front'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>GST Certificate *</FormLabel>
                            <FormControl>
                              <FileUpload
                                form={form}
                                name='vendor.adhaar_certificate_front'
                                value={field?.value}
                                hide={true}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='vendor.adhaar_certificate_back'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>GST Certificate *</FormLabel>
                            <FormControl>
                              <FileUpload
                                form={form}
                                name='vendor.adhaar_certificate_back'
                                value={field?.value}
                                hide={true}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Terms and Submit */}
                <div className='space-y-6'>
                  <div className='bg-blue-50 p-4 rounded-lg'>
                    <h4 className='font-semibold text-blue-900 mb-2'>
                      Important Notes:
                    </h4>
                    <ul className='text-sm text-blue-800 space-y-1'>
                      <li>• All documents should be clear and readable</li>
                      <li>• Maximum file size allowed is 5MB per document</li>
                      <li>• Supported formats: JPG, PNG, PDF</li>
                      <li>
                        • Your application will be reviewed within 2-3 business
                        days
                      </li>
                      <li>
                        • You will receive an email confirmation once approved
                      </li>
                    </ul>
                  </div>

                  <Button
                    type='submit'
                    className='w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                        Submitting Application...
                      </>
                    ) : (
                      'Submit Vendor Registration'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
