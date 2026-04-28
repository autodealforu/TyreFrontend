'use client';

import { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Eye,
  Calendar,
  MapPin,
  CheckCircle,
  AlertCircle,
  XCircle,
  Wrench,
  Loader2,
  Clock,
  User,
  CreditCard,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import {
  getJobCards,
  cancelJobCard,
  type JobCard,
} from '@/actions/jobcard.action';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AccountLayout from './account-layout';

// Helper function to format vehicle object to string
const formatVehicle = (vehicle: any): string => {
  if (typeof vehicle === 'string') return vehicle;
  if (typeof vehicle === 'object' && vehicle) {
    const make = vehicle.make || '';
    const model = vehicle.model || '';
    const year = vehicle.year || '';
    return `${make} ${model} ${year}`.trim() || 'Vehicle not specified';
  }
  return 'Vehicle not specified';
};

export default function AccountJobCards() {
  const { user, accessToken } = useAuth();
  const [jobCards, setJobCards] = useState<JobCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cancellingJobs, setCancellingJobs] = useState<Set<string>>(new Set());

  // Filter job cards based on search and status
  const filteredJobCards = jobCards.filter((jobCard) => {
    if (!jobCard) return false;

    const jobId = jobCard.id || jobCard._id || '';
    const service = jobCard.service || '';
    const vehicle = formatVehicle(jobCard.vehicle);
    const status = jobCard.status || '';

    const matchesSearch =
      jobId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    // Wait for user to be loaded before fetching job cards
    if (!user?._id) {
      console.log('Waiting for user to be loaded...');
      return;
    }

    const fetchJobCards = async () => {
      try {
        // Pass user ID to filter job cards for the logged-in customer
        console.log('Fetching job cards for user:', user._id);
        const result = await getJobCards(accessToken, user._id);
        console.log('Job cards result:', result);
        if (result.error) {
          console.warn('API Error:', result.error);
          toast.error('Failed to fetch job cards - ' + result.error);
          setJobCards([]);
        } else {
          const jobCardsData = Array.isArray(result.data) ? result.data : [];
          // Data is already transformed in the action, no need for sanitizeJobCard
          setJobCards(jobCardsData);
          if (jobCardsData.length === 0) {
            toast.info('No job cards found');
          }
        }
      } catch (error) {
        console.error('Error fetching job cards:', error);
        toast.error('Failed to fetch job cards');
        setJobCards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobCards();
  }, [accessToken, user?._id]);

  const handleCancelJobCard = async (jobCardId: string) => {
    if (!accessToken) return;

    setCancellingJobs((prev) => new Set(prev).add(jobCardId));

    try {
      const result = await cancelJobCard(accessToken, jobCardId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Job card cancelled successfully');
        setJobCards((prev) =>
          prev.map((job) =>
            job._id === jobCardId
              ? { ...job, status: 'Cancelled' as const }
              : job
          )
        );
      }
    } catch (error) {
      toast.error('Failed to cancel job card');
      console.error('Error cancelling job card:', error);
    } finally {
      setCancellingJobs((prev) => {
        const newSet = new Set(prev);
        newSet.delete(jobCardId);
        return newSet;
      });
    }
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'bg-gray-50 text-gray-700 hover:bg-gray-50';

    switch (status) {
      case 'Completed':
        return 'bg-green-50 text-green-700 hover:bg-green-50';
      case 'Confirmed':
        return 'bg-blue-50 text-blue-700 hover:bg-blue-50';
      case 'In Progress':
        return 'bg-yellow-50 text-yellow-700 hover:bg-yellow-50';
      case 'Pending':
        return 'bg-orange-50 text-orange-700 hover:bg-orange-50';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 hover:bg-red-50';
      default:
        return 'bg-gray-50 text-gray-700 hover:bg-gray-50';
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    if (!status) return <FileText className='h-4 w-4' />;

    switch (status) {
      case 'Completed':
        return <CheckCircle className='h-4 w-4' />;
      case 'Confirmed':
        return <Calendar className='h-4 w-4' />;
      case 'In Progress':
        return <AlertCircle className='h-4 w-4' />;
      case 'Pending':
        return <Clock className='h-4 w-4' />;
      case 'Cancelled':
        return <XCircle className='h-4 w-4' />;
      default:
        return <FileText className='h-4 w-4' />;
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <AccountLayout
        title='My Job Cards'
        description='Track your service appointments and installations'
      >
        <div className='space-y-6'>
          {/* Loading skeleton */}
          <Card>
            <CardContent className='p-6'>
              <div className='flex flex-col md:flex-row gap-4'>
                <div className='h-10 bg-gray-200 rounded animate-pulse flex-1'></div>
                <div className='h-10 bg-gray-200 rounded animate-pulse w-full md:w-[180px]'></div>
              </div>
            </CardContent>
          </Card>

          <div className='space-y-4'>
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className='p-6'>
                  <div className='space-y-4'>
                    <div className='flex justify-between'>
                      <div className='space-y-2'>
                        <div className='h-6 bg-gray-200 rounded animate-pulse w-48'></div>
                        <div className='h-4 bg-gray-200 rounded animate-pulse w-64'></div>
                      </div>
                      <div className='h-8 bg-gray-200 rounded animate-pulse w-24'></div>
                    </div>
                    <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4'>
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className='space-y-2'>
                          <div className='h-4 bg-gray-200 rounded animate-pulse w-20'></div>
                          <div className='h-4 bg-gray-200 rounded animate-pulse w-32'></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout
      title='My Job Cards'
      description='Track your service appointments and installations'
    >
      <div className='space-y-6'>
        {/* Filters */}
        <Card>
          <CardContent className='p-6'>
            <div className='flex flex-col md:flex-row gap-4'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Search job cards by ID, service, or vehicle...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-10'
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className='w-full md:w-[180px]'>
                  <SelectValue placeholder='Filter by status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Job Cards</SelectItem>
                  <SelectItem value='pending'>Pending</SelectItem>
                  <SelectItem value='confirmed'>Confirmed</SelectItem>
                  <SelectItem value='in progress'>In Progress</SelectItem>
                  <SelectItem value='completed'>Completed</SelectItem>
                  <SelectItem value='cancelled'>Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Job Cards List */}
        <div className='space-y-4'>
          {filteredJobCards.length === 0 ? (
            <Card>
              <CardContent className='p-12 text-center'>
                <FileText className='h-16 w-16 text-gray-400 mx-auto mb-4' />
                <h3 className='text-xl font-semibold mb-2'>
                  No Job Cards Found
                </h3>
                <p className='text-gray-600 mb-6'>
                  {searchQuery || statusFilter !== 'all'
                    ? 'No job cards match your current filters.'
                    : "You haven't created any job cards yet."}
                </p>
                <Button asChild>
                  <Link href='/services'>Book a Service</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredJobCards.map((jobCard) => (
              <Card
                key={jobCard?._id || Math.random()}
                className='hover:shadow-md transition-shadow'
              >
                <CardContent className='p-6'>
                  {/* Header Section */}
                  <div className='flex flex-col lg:flex-row lg:items-start justify-between mb-4'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-3 mb-2'>
                        <h3 className='text-lg font-semibold'>
                          Job Card #{jobCard?.id || 'N/A'}
                        </h3>
                        <Badge
                          variant='outline'
                          className={getStatusColor(jobCard?.status || '')}
                        >
                          <div className='flex items-center gap-1'>
                            {getStatusIcon(jobCard?.status || '')}
                            {jobCard?.status || 'Unknown'}
                          </div>
                        </Badge>
                      </div>
                      <p className='text-sm text-muted-foreground mb-1'>
                        {jobCard?.service || 'No service specified'}
                      </p>
                      {jobCard?.description && (
                        <p className='text-sm text-gray-600 mb-3 line-clamp-2'>
                          {jobCard.description}
                        </p>
                      )}
                    </div>

                    <div className='text-right lg:ml-4'>
                      <div className='text-xl font-bold text-primary mb-1'>
                        ₹
                        {(
                          jobCard?.totalCost ||
                          jobCard?.cost ||
                          0
                        ).toLocaleString('en-IN')}
                      </div>
                      {jobCard?.paymentStatus && (
                        <Badge
                          variant='outline'
                          className={`text-xs ${
                            jobCard.paymentStatus === 'Paid'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-orange-50 text-orange-700 border-orange-200'
                          }`}
                        >
                          {jobCard.paymentStatus}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Quick Info Grid */}
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
                    <div className='flex items-center gap-2'>
                      <Calendar className='h-4 w-4 text-gray-500' />
                      <div>
                        <div className='text-xs text-muted-foreground'>
                          Date & Time
                        </div>
                        <div className='text-sm font-medium'>
                          {jobCard?.date || 'Not set'}
                        </div>
                        <div className='text-xs text-gray-600'>
                          {jobCard?.time || 'Time not set'}
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      <MapPin className='h-4 w-4 text-gray-500' />
                      <div>
                        <div className='text-xs text-muted-foreground'>
                          Location
                        </div>
                        <div className='text-sm font-medium line-clamp-1'>
                          {jobCard?.location || 'Not specified'}
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      <Wrench className='h-4 w-4 text-gray-500' />
                      <div>
                        <div className='text-xs text-muted-foreground'>
                          Vehicle
                        </div>
                        <div className='text-sm font-medium line-clamp-1'>
                          {formatVehicle(jobCard?.vehicle)}
                        </div>
                        {jobCard?.vehicleNumber && (
                          <div className='text-xs text-gray-600'>
                            {jobCard.vehicleNumber}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      <Clock className='h-4 w-4 text-gray-500' />
                      <div>
                        <div className='text-xs text-muted-foreground'>
                          Duration
                        </div>
                        <div className='text-sm font-medium'>
                          {jobCard?.estimatedDuration || 'Not specified'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vendor and Customer Info */}
                  {(jobCard?.customerName || jobCard?.vendorName) && (
                    <div className='grid md:grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg'>
                      {jobCard?.customerName && (
                        <div className='flex items-center gap-2'>
                          <User className='h-4 w-4 text-gray-500' />
                          <div>
                            <div className='text-xs text-muted-foreground'>
                              Customer
                            </div>
                            <div className='text-sm font-medium'>
                              {jobCard.customerName}
                            </div>
                            {jobCard?.customerPhone && (
                              <div className='text-xs text-gray-600'>
                                {jobCard.customerPhone}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {jobCard?.vendorName && (
                        <div className='flex items-center gap-2'>
                          <User className='h-4 w-4 text-gray-500' />
                          <div>
                            <div className='text-xs text-muted-foreground'>
                              Vendor
                            </div>
                            <div className='text-sm font-medium'>
                              {jobCard.vendorName}
                            </div>
                            {jobCard?.vendorStoreName &&
                              jobCard.vendorStoreName !==
                                jobCard.vendorName && (
                                <div className='text-xs text-gray-600'>
                                  {jobCard.vendorStoreName}
                                </div>
                              )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Service Details Summary */}
                  {(jobCard?.servicesUsed?.length > 0 ||
                    jobCard?.productsUsed?.length > 0 ||
                    jobCard?.partsUsed?.length > 0) && (
                    <div className='mb-4 p-3 bg-blue-50 rounded-lg'>
                      <div className='text-sm font-medium mb-2'>
                        Service Summary
                      </div>
                      <div className='grid grid-cols-3 gap-4 text-xs'>
                        {jobCard.servicesUsed &&
                          jobCard.servicesUsed.length > 0 && (
                            <div className='text-center'>
                              <div className='font-medium text-blue-700'>
                                {jobCard.servicesUsed.length}
                              </div>
                              <div className='text-gray-600'>Services</div>
                            </div>
                          )}
                        {jobCard.productsUsed &&
                          jobCard.productsUsed.length > 0 && (
                            <div className='text-center'>
                              <div className='font-medium text-green-700'>
                                {jobCard.productsUsed.length}
                              </div>
                              <div className='text-gray-600'>Products</div>
                            </div>
                          )}
                        {jobCard.partsUsed && jobCard.partsUsed.length > 0 && (
                          <div className='text-center'>
                            <div className='font-medium text-yellow-700'>
                              {jobCard.partsUsed.length}
                            </div>
                            <div className='text-gray-600'>Parts</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Customer Feedback Summary */}
                  {(jobCard?.feedback || jobCard?.rating) && (
                    <div className='mb-4 p-3 bg-purple-50 rounded-lg'>
                      <div className='flex items-center justify-between'>
                        <div className='text-sm font-medium'>
                          Customer Feedback
                        </div>
                        {jobCard.rating && (
                          <div className='flex items-center gap-1'>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= (jobCard.rating || 0)
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className='text-xs ml-1'>
                              {jobCard.rating}/5
                            </span>
                          </div>
                        )}
                      </div>
                      {jobCard.feedback && (
                        <p className='text-xs text-gray-700 mt-1 line-clamp-2'>
                          {jobCard.feedback}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className='flex flex-wrap gap-2 pt-4 border-t'>
                    <Button variant='outline' size='sm' asChild>
                      <Link href={`/account/job-cards/${jobCard?._id || ''}`}>
                        <Eye className='h-4 w-4 mr-1' />
                        View Details
                      </Link>
                    </Button>

                    {(jobCard?.status === 'Pending' ||
                      jobCard?.status === 'Confirmed') && (
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleCancelJobCard(jobCard?._id || '')}
                        disabled={cancellingJobs.has(jobCard?._id || '')}
                      >
                        {cancellingJobs.has(jobCard?._id || '') ? (
                          <Loader2 className='h-4 w-4 mr-1 animate-spin' />
                        ) : (
                          <XCircle className='h-4 w-4 mr-1' />
                        )}
                        {cancellingJobs.has(jobCard?._id || '')
                          ? 'Cancelling...'
                          : 'Cancel'}
                      </Button>
                    )}

                    {jobCard?.status === 'Completed' && (
                      <Button variant='outline' size='sm'>
                        <FileText className='h-4 w-4 mr-1' />
                        Download Report
                      </Button>
                    )}

                    {jobCard?.paymentStatus === 'Pending' &&
                      jobCard?.status === 'Completed' && (
                        <Button variant='default' size='sm'>
                          <CreditCard className='h-4 w-4 mr-1' />
                          Pay Now
                        </Button>
                      )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Stats Summary */}
        {jobCards.length > 0 && (
          <Card>
            <CardContent className='p-6'>
              <h3 className='font-semibold mb-4'>Job Cards Summary</h3>
              <div className='grid grid-cols-2 md:grid-cols-5 gap-4 text-center'>
                <div>
                  <div className='text-2xl font-bold text-primary'>
                    {jobCards.length}
                  </div>
                  <div className='text-sm text-gray-600'>Total</div>
                </div>
                <div>
                  <div className='text-2xl font-bold text-orange-600'>
                    {jobCards.filter((j) => j.status === 'Pending').length}
                  </div>
                  <div className='text-sm text-gray-600'>Pending</div>
                </div>
                <div>
                  <div className='text-2xl font-bold text-blue-600'>
                    {jobCards.filter((j) => j.status === 'Confirmed').length}
                  </div>
                  <div className='text-sm text-gray-600'>Confirmed</div>
                </div>
                <div>
                  <div className='text-2xl font-bold text-yellow-600'>
                    {jobCards.filter((j) => j.status === 'In Progress').length}
                  </div>
                  <div className='text-sm text-gray-600'>In Progress</div>
                </div>
                <div>
                  <div className='text-2xl font-bold text-green-600'>
                    {jobCards.filter((j) => j.status === 'Completed').length}
                  </div>
                  <div className='text-sm text-gray-600'>Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AccountLayout>
  );
}
