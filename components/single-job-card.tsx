'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Wrench,
  CreditCard,
  User,
  Phone,
  Mail,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
  XCircle,
  Star,
  Package,
  Settings,
  Loader2,
  Download,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import {
  getJobCardById,
  cancelJobCard,
  type JobCard,
} from '@/actions/jobcard.action';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import AccountLayout from './account-layout';

interface SingleJobCardProps {
  id?: string;
}

export default function SingleJobCard() {
  const params = useParams();
  const router = useRouter();
  const { user, accessToken, isLoading: authLoading } = useAuth();
  const [jobCard, setJobCard] = useState<JobCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const jobCardId = params?.id as string;

  useEffect(() => {
    if (authLoading) return;
    if (!accessToken || !jobCardId) {
      setLoading(false);
      return;
    }

    const fetchJobCard = async () => {
      try {
        const result = await getJobCardById(accessToken, jobCardId);
        if (result.error) {
          toast.error(result.error);
          router.push('/account/job-cards');
        } else if (result.data) {
          const currentUserId = (user as any)?._id || (user as any)?.id;
          const cardUserId = (result.data as any)?.user || (result.data as any)?.customer?._id || (result.data as any)?.customer;
          if (currentUserId && cardUserId && String(cardUserId) !== String(currentUserId)) {
            console.warn('User ID mismatch warning:', currentUserId, cardUserId);
          }
          setJobCard(result.data);
        }
      } catch (error) {
        console.error('Error fetching job card:', error);
        toast.error('Failed to load job card details');
        router.push('/account/job-cards');
      } finally {
        setLoading(false);
      }
    };

    fetchJobCard();
  }, [accessToken, jobCardId, router, user, authLoading]);

  const handleCancelJobCard = async () => {
    if (!accessToken || !jobCardId) return;

    setCancelling(true);
    try {
      const result = await cancelJobCard(accessToken, jobCardId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Job card cancelled successfully');
        setJobCard((prev) =>
          prev ? { ...prev, status: 'Cancelled' as const } : null
        );
        setShowCancelDialog(false);
      }
    } catch (error) {
      toast.error('Failed to cancel job card');
      console.error('Error cancelling job card:', error);
    } finally {
      setCancelling(false);
    }
  };

  const handleDownloadReceipt = () => {
    if (!jobCard) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to download receipt');
      return;
    }

    const servicesHtml = (jobCard.services || []).map((s) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${s.name || 'Service'}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${s.quantity || 1}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${(s.cost || 0).toLocaleString('en-IN')}</td>
      </tr>
    `).join('') || `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${jobCard.service || 'Vehicle Service'}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">1</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${(jobCard.totalCost || 0).toLocaleString('en-IN')}</td>
      </tr>
    `;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Job Card Receipt - #${jobCard.id || jobCard._id}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1f2937; padding: 40px; background: #fff; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #1e3a8a; }
          .title { font-size: 20px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #3b82f6; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
          .box { background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; }
          .box h3 { margin-top: 0; font-size: 14px; text-transform: uppercase; color: #64748b; margin-bottom: 8px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { background: #1e293b; color: #fff; text-align: left; padding: 12px; font-size: 14px; }
          .total { text-align: right; font-size: 18px; font-weight: bold; color: #0f172a; border-top: 2px solid #cbd5e1; padding-top: 15px; }
          .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">AutoDeal4U</div>
            <div style="font-size: 12px; color: #64748b;">Premium Tyre & Vehicle Solutions</div>
          </div>
          <div>
            <div class="title">Job Card Receipt</div>
            <div style="font-size: 13px; color: #475569; text-align: right; margin-top: 4px;">Receipt #${jobCard.id || jobCard._id}</div>
            <div style="font-size: 12px; color: #64748b; text-align: right;">Date: ${jobCard.date || new Date().toLocaleDateString('en-IN')}</div>
          </div>
        </div>

        <div class="grid">
          <div class="box">
            <h3>Customer Details</h3>
            <strong>${jobCard.customerName || 'Customer'}</strong><br/>
            ${jobCard.customerPhone ? `Phone: ${jobCard.customerPhone}<br/>` : ''}
            ${jobCard.customerEmail ? `Email: ${jobCard.customerEmail}<br/>` : ''}
            ${jobCard.address ? `Address: ${jobCard.address}` : ''}
          </div>
          <div class="box">
            <h3>Vendor & Workshop Details</h3>
            <strong>${jobCard.vendorName || 'AutoDeal4U Service Station'}</strong><br/>
            ${jobCard.vendorPhone ? `Phone: ${jobCard.vendorPhone}<br/>` : ''}
            ${jobCard.vendorLocation ? `Location: ${jobCard.vendorLocation}` : ''}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Service Item</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${servicesHtml}
          </tbody>
        </table>

        <div class="total">
          Total Cost: ₹${(jobCard.totalCost || 0).toLocaleString('en-IN')}
          <div style="font-size: 13px; font-weight: normal; color: #64748b; margin-top: 4px;">
            Payment Status: <span style="font-weight: bold; color: ${jobCard.paymentStatus === 'Paid' ? '#16a34a' : '#d97706'};">${jobCard.paymentStatus || 'Pending'}</span>
          </div>
        </div>

        <div class="footer">
          Thank you for choosing AutoDeal4U. For support, contact support@autodeal4u.in | +91 98765 43210
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className='h-5 w-5' />;
      case 'Confirmed':
        return <Calendar className='h-5 w-5' />;
      case 'In Progress':
        return <AlertCircle className='h-5 w-5' />;
      case 'Pending':
        return <Clock className='h-5 w-5' />;
      case 'Cancelled':
        return <XCircle className='h-5 w-5' />;
      default:
        return <FileText className='h-5 w-5' />;
    }
  };

  const canCancelJobCard = (status: string) => {
    return ['Pending', 'Confirmed'].includes(status);
  };

  if (loading) {
    return (
      <AccountLayout
        title='Job Card Details'
        description='View detailed information about your service appointment'
      >
        <div className='space-y-6'>
          <div className='flex items-center gap-4'>
            <div className='h-10 w-24 bg-gray-200 rounded animate-pulse'></div>
            <div className='h-8 w-48 bg-gray-200 rounded animate-pulse'></div>
          </div>

          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className='p-6'>
                <div className='space-y-4'>
                  <div className='h-6 bg-gray-200 rounded animate-pulse w-1/3'></div>
                  <div className='h-4 bg-gray-200 rounded animate-pulse w-full'></div>
                  <div className='h-4 bg-gray-200 rounded animate-pulse w-2/3'></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </AccountLayout>
    );
  }

  if (!jobCard) {
    return (
      <AccountLayout
        title='Job Card Not Found'
        description='The requested job card could not be found'
      >
        <div className='text-center py-12'>
          <FileText className='h-16 w-16 text-gray-400 mx-auto mb-4' />
          <h3 className='text-xl font-semibold mb-2'>Job Card Not Found</h3>
          <p className='text-gray-600 mb-6'>
            The job card you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href='/account/job-cards'>Back to Job Cards</Link>
          </Button>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout
      title={`Job Card ${jobCard.id || jobCard._id}`}
      description='View detailed information about your service appointment'
    >
      <div className='space-y-6'>
        {/* Header Actions */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <Button variant='outline' asChild>
            <Link href='/account/job-cards'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Job Cards
            </Link>
          </Button>

          <div className='flex items-center gap-2'>
            {getStatusIcon(jobCard.status)}
            <Badge variant='outline' className={getStatusColor(jobCard.status)}>
              {jobCard.status}
            </Badge>
          </div>
        </div>

        {/* Main Details */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Wrench className='h-5 w-5' />
              Service Details
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='grid md:grid-cols-2 gap-6'>
              <div className='space-y-4'>
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Service Type
                  </label>
                  <p className='text-lg font-semibold'>{jobCard.service}</p>
                </div>

                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Description
                  </label>
                  <p className='text-gray-800'>
                    {jobCard.description || 'No description provided'}
                  </p>
                </div>

                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Vehicle
                  </label>
                  <p className='text-gray-800'>
                    {typeof jobCard.vehicle === 'string'
                      ? jobCard.vehicle
                      : 'Vehicle not specified'}
                  </p>
                  {jobCard.vehicleNumber && (
                    <p className='text-sm text-gray-600'>
                      Vehicle No: {jobCard.vehicleNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className='space-y-4'>
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Date & Time
                  </label>
                  <div className='flex items-center gap-2 text-gray-800'>
                    <Calendar className='h-4 w-4' />
                    <span>
                      {jobCard.date} at {jobCard.time}
                    </span>
                  </div>
                </div>

                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Location
                  </label>
                  <div className='flex items-center gap-2 text-gray-800'>
                    <MapPin className='h-4 w-4' />
                    <span>{jobCard.location}</span>
                  </div>
                </div>

                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Estimated Duration
                  </label>
                  <div className='flex items-center gap-2 text-gray-800'>
                    <Clock className='h-4 w-4' />
                    <span>{jobCard.estimatedDuration}</span>
                  </div>
                </div>
              </div>
            </div>

            {jobCard.serviceNotes && (
              <div>
                <label className='text-sm font-medium text-gray-500'>
                  Service Notes
                </label>
                <div className='bg-blue-50 p-4 rounded-lg mt-2'>
                  <p className='text-gray-800'>{jobCard.serviceNotes}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer & Vendor Information */}
        <div className='grid md:grid-cols-2 gap-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <User className='h-5 w-5' />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <label className='text-sm font-medium text-gray-500'>
                  Name
                </label>
                <p className='text-gray-800'>
                  {jobCard.customerName || user?.name || 'Not specified'}
                </p>
              </div>

              {jobCard.customerPhone && (
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Phone
                  </label>
                  <div className='flex items-center gap-2'>
                    <Phone className='h-4 w-4 text-gray-500' />
                    <span className='text-gray-800'>
                      {jobCard.customerPhone}
                    </span>
                  </div>
                </div>
              )}

              {jobCard.customerEmail && (
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Email
                  </label>
                  <div className='flex items-center gap-2'>
                    <Mail className='h-4 w-4 text-gray-500' />
                    <span className='text-gray-800'>
                      {jobCard.customerEmail}
                    </span>
                  </div>
                </div>
              )}

              {jobCard.customerAddress && (
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Address
                  </label>
                  <p className='text-gray-800'>{jobCard.customerAddress}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Settings className='h-5 w-5' />
                Vendor Information
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <label className='text-sm font-medium text-gray-500'>
                  Vendor Name
                </label>
                <p className='text-gray-800'>
                  {jobCard.vendorName || 'Not specified'}
                </p>
              </div>

              {jobCard.vendorStoreName && (
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Store Name
                  </label>
                  <p className='text-gray-800'>{jobCard.vendorStoreName}</p>
                </div>
              )}

              {jobCard.vendorPhone && (
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Phone
                  </label>
                  <div className='flex items-center gap-2'>
                    <Phone className='h-4 w-4 text-gray-500' />
                    <span className='text-gray-800'>{jobCard.vendorPhone}</span>
                  </div>
                </div>
              )}

              {jobCard.technician && (
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Technician
                  </label>
                  <p className='text-gray-800'>{jobCard.technician}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Services Used */}
        {jobCard.servicesUsed && jobCard.servicesUsed.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Wrench className='h-5 w-5' />
                Services Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {jobCard.servicesUsed.map((service, index) => (
                  <div
                    key={index}
                    className='flex justify-between items-center p-3 bg-blue-50 rounded-lg'
                  >
                    <div>
                      <p className='font-medium'>{service.service_name}</p>
                      <p className='text-sm text-gray-600'>
                        Quantity: {service.service_quantity}
                      </p>
                      {service.service_discount > 0 && (
                        <p className='text-sm text-green-600'>
                          Discount: {service.service_discount}% (
                          {service.service_discount_type})
                        </p>
                      )}
                    </div>
                    <div className='text-right'>
                      <p className='font-semibold'>
                        ₹{service.service_total_cost?.toLocaleString('en-IN')}
                      </p>
                      <p className='text-sm text-gray-600'>
                        ₹{service.service_cost?.toLocaleString('en-IN')} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products Used */}
        {jobCard.productsUsed && jobCard.productsUsed.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Package className='h-5 w-5' />
                Products Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {jobCard.productsUsed.map((product, index) => (
                  <div
                    key={index}
                    className='flex justify-between items-center p-3 bg-green-50 rounded-lg'
                  >
                    <div>
                      <p className='font-medium'>
                        {product.formatted_name || product.product_name}
                      </p>
                      <p className='text-sm text-gray-600'>
                        Quantity: {product.product_quantity}
                      </p>
                      {product.product_discount > 0 && (
                        <p className='text-sm text-green-600'>
                          Discount: {product.product_discount}% (
                          {product.product_discount_type})
                        </p>
                      )}
                    </div>
                    <div className='text-right'>
                      <p className='font-semibold'>
                        ₹{product.product_total_cost?.toLocaleString('en-IN')}
                      </p>
                      <p className='text-sm text-gray-600'>
                        ₹{product.product_cost?.toLocaleString('en-IN')} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Parts Used */}
        {jobCard.partsUsed && jobCard.partsUsed.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Settings className='h-5 w-5' />
                Parts Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {jobCard.partsUsed.map((part, index) => (
                  <div
                    key={index}
                    className='flex justify-between items-center p-3 bg-yellow-50 rounded-lg'
                  >
                    <div>
                      <p className='font-medium'>{part.part_name}</p>
                      <p className='text-sm text-gray-600'>
                        Quantity: {part.part_quantity}
                      </p>
                      {part.part_discount > 0 && (
                        <p className='text-sm text-green-600'>
                          Discount: {part.part_discount}% (
                          {part.part_discount_type})
                        </p>
                      )}
                    </div>
                    <div className='text-right'>
                      <p className='font-semibold'>
                        ₹{part.part_total_cost?.toLocaleString('en-IN')}
                      </p>
                      <p className='text-sm text-gray-600'>
                        ₹{part.part_cost?.toLocaleString('en-IN')} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <CreditCard className='h-5 w-5' />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid md:grid-cols-3 gap-4'>
              {jobCard.laborCost && (
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Labor Cost
                  </label>
                  <p className='text-lg font-semibold'>
                    ₹{jobCard.laborCost.toLocaleString('en-IN')}
                  </p>
                </div>
              )}

              <div>
                <label className='text-sm font-medium text-gray-500'>
                  Total Cost
                </label>
                <p className='text-xl font-bold text-primary'>
                  ₹
                  {(jobCard.totalCost || jobCard.cost || 0).toLocaleString(
                    'en-IN'
                  )}
                </p>
              </div>

              <div>
                <label className='text-sm font-medium text-gray-500'>
                  Payment Status
                </label>
                <Badge
                  variant='outline'
                  className={
                    jobCard.paymentStatus === 'Paid'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-orange-50 text-orange-700 border-orange-200'
                  }
                >
                  {jobCard.paymentStatus || 'Pending'}
                </Badge>
              </div>
            </div>

            {(jobCard.paymentMethod || jobCard.paymentDate) && (
              <>
                <Separator />
                <div className='grid md:grid-cols-2 gap-4'>
                  {jobCard.paymentMethod && (
                    <div>
                      <label className='text-sm font-medium text-gray-500'>
                        Payment Method
                      </label>
                      <p className='text-gray-800'>{jobCard.paymentMethod}</p>
                    </div>
                  )}

                  {jobCard.paymentDate && (
                    <div>
                      <label className='text-sm font-medium text-gray-500'>
                        Payment Date
                      </label>
                      <p className='text-gray-800'>
                        {new Date(jobCard.paymentDate).toLocaleDateString(
                          'en-IN'
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Customer Feedback */}
        {(jobCard.feedback || jobCard.rating) && (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <MessageSquare className='h-5 w-5' />
                Customer Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {jobCard.rating && (
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Rating
                  </label>
                  <div className='flex items-center gap-2 mt-1'>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= (jobCard.rating || 0)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className='text-sm font-medium ml-2'>
                      {jobCard.rating}/5
                    </span>
                  </div>
                </div>
              )}

              {jobCard.feedback && (
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Written Feedback
                  </label>
                  <div className='bg-purple-50 p-4 rounded-lg mt-2'>
                    <p className='text-gray-800'>{jobCard.feedback}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <Card>
          <CardContent className='p-6'>
            <div className='flex flex-wrap gap-3'>
              <Button variant='outline' asChild>
                <Link href={`/account/job-cards/${jobCard._id}/download`}>
                  <Download className='h-4 w-4 mr-2' />
                  Download Receipt
                </Link>
              </Button>

              {canCancelJobCard(jobCard.status) && (
                <Dialog
                  open={showCancelDialog}
                  onOpenChange={setShowCancelDialog}
                >
                  <DialogTrigger asChild>
                    <Button variant='destructive'>
                      <XCircle className='h-4 w-4 mr-2' />
                      Cancel Job Card
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cancel Job Card</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to cancel this job card? This
                        action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant='outline'
                        onClick={() => setShowCancelDialog(false)}
                      >
                        Keep Job Card
                      </Button>
                      <Button
                        variant='destructive'
                        onClick={handleCancelJobCard}
                        disabled={cancelling}
                      >
                        {cancelling ? (
                          <>
                            <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                            Cancelling...
                          </>
                        ) : (
                          'Cancel Job Card'
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              <Button variant='default' asChild>
                <Link href='/contact-us'>
                  <MessageSquare className='h-4 w-4 mr-2' />
                  Contact Support
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AccountLayout>
  );
}
