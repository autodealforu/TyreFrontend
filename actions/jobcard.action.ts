'use server';

import { apiClient } from '@/lib/api';

export interface JobCard {
  _id: string;
  id: string;
  date: string;
  time: string;
  service: string;
  location: string;
  status: 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled' | 'Pending';
  vehicle: string;
  tyres: Array<{
    name: string;
    size: string;
    quantity: number;
  }>;
  estimatedDuration: string;
  cost: number;
  technician?: string;
  user: string;
  createdAt: string;
  updatedAt: string;
  // Additional fields from API
  paymentStatus?: string;
  customerName?: string;
  vendorName?: string;
  serviceType?: string;
  description?: string;
  laborCost?: number;
  totalCost?: number;
  // New rich data fields
  customerPhone?: string;
  customerEmail?: string;
  vendorPhone?: string;
  vendorStoreName?: string;
  vehicleNumber?: string;
  serviceNotes?: string;
  servicesUsed?: ServiceUsed[];
  productsUsed?: ProductUsed[];
  partsUsed?: PartUsed[];
  paymentMethod?: string;
  paymentDate?: string;
  feedback?: string;
  rating?: number;
  customerAddress?: string;
}

// Type for vehicle object that might come from the backend
export interface VehicleObject {
  _id: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  vehicle_number: string;
  owner: string;
  __v?: number;
  createdAt: string;
  updatedAt: string;
}

// Type for customer/vendor object from the backend
export interface UserObject {
  _id: string;
  name: string;
  email: string;
  phone: string;
  username: string;
  role: string;
  address?: Array<{
    _id: string;
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    pin: string;
    landmark?: string;
  }>;
  vendor?: {
    profile_status: string;
    store_active: boolean;
    store_name?: string;
    store_description?: string;
    gst_no?: string;
    pan_no?: string;
    pickup_address?: any[];
  };
  createdAt: string;
  updatedAt: string;
  user_id: number;
}

// Type for service item used
export interface ServiceUsed {
  _id: string;
  service_id: string;
  service_name: string;
  service_discount: number;
  service_discount_type: string;
  service_tax: number;
  service_quantity: number;
  service_cost: number;
  service_total_cost: number;
}

// Type for product used
export interface ProductUsed {
  _id: string;
  product_id: any; // Can be populated with full product details
  product_category?: 'TYRE' | 'ALLOY_WHEEL' | 'SERVICE';
  product_name: string;
  product_cost: number;
  product_quantity: number;
  product_total_cost: number;
  product_discount: number;
  product_discount_type: string;
  product_tax: number;
  formatted_name?: string; // Added for formatted display
}

// Type for parts used
export interface PartUsed {
  _id: string;
  part_id: string;
  part_name: string;
  part_cost: number;
  part_quantity: number;
  part_total_cost: number;
  part_discount: number;
  part_discount_type: string;
  part_tax: number;
}

// Helper function to format product name based on product details
function formatProductName(product: any): string {
  if (!product || !product.product_id) {
    return product?.product_name || 'Product';
  }

  const productData = product.product_id;
  const category = product.product_category || productData.product_category;

  try {
    switch (category) {
      case 'TYRE': {
        const tyre = productData.tyre;
        if (tyre) {
          const brand = tyre.productBrand?.name || '';
          const width = tyre.tyreWidth?.[0]?.name || '';
          const aspectRatio = tyre.aspectRatio?.[0]?.name || '';
          const construction = tyre.construction || '';
          const rimDiameter = tyre.rimDiameter?.[0]?.name || '';
          const plyRating = tyre.plyRating?.[0]?.name || '';
          const loadIndex = tyre.loadIndex?.[0]?.name || '';
          const speedSymbol = tyre.speedSymbol?.[0]?.name || '';
          const threadPattern = tyre.productThreadPattern?.[0]?.name || '';

          return `${brand} ${width}${
            aspectRatio ? '/' + aspectRatio : ''
          }${construction}${rimDiameter} ${plyRating}${loadIndex}${speedSymbol} ${threadPattern}`.trim();
        }
        break;
      }
      case 'ALLOY_WHEEL': {
        const alloy = productData.alloy_wheel;
        if (alloy) {
          const brand = alloy.alloyBrand?.name || '';
          const diameter = alloy.alloyDiameterInches?.name || '';
          const width = alloy.alloyWidth?.[0]?.name || '';
          const finish = alloy.alloyFinish?.[0]?.name || '';

          return `${brand} ${diameter}X${width} ${finish}`.trim();
        }
        break;
      }
      case 'SERVICE': {
        const service = productData.service;
        if (service) {
          return service.serviceName || product.product_name;
        }
        break;
      }
    }
  } catch (error) {
    console.error('Error formatting product name:', error);
  }

  return product.product_name || 'Product';
}

// Type for raw job card data that comes from the backend
export interface RawJobCard {
  _id: string;
  job_card_number: number;
  service_status: string;
  service_payment_status: string;
  customer: UserObject | null;
  vendor: UserObject | null;
  vehicle: VehicleObject | null;
  service_type: string;
  service_description: string;
  service_date: string;
  service_notes: string;
  service_technician: string;
  services_used: ServiceUsed[];
  products_used: ProductUsed[];
  service_parts_used: PartUsed[];
  service_labor_cost: number;
  service_total_cost: number;
  service_payment_method?: string;
  service_payment_date?: string;
  service_feedback?: string;
  service_rating?: number;
  service_images: any[];
  service_documents: any[];
  created_at: string;
  updated_at: string;
  __v: number;
}

// Transform raw job card data from API to our JobCard format
function transformJobCard(rawJobCard: RawJobCard): JobCard {
  // Format date and time from service_date
  const serviceDate = new Date(rawJobCard.service_date);
  const formattedDate = serviceDate.toLocaleDateString('en-IN');
  const formattedTime = serviceDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Create vehicle display string with null checks
  const vehicle = rawJobCard.vehicle;
  const vehicleDisplay = vehicle
    ? `${vehicle.make || ''} ${vehicle.model || ''} ${
        vehicle.year || ''
      }`.trim() || 'Vehicle not specified'
    : 'Vehicle not specified';

  // Map service status to our expected status values
  const statusMap: { [key: string]: JobCard['status'] } = {
    Pending: 'Pending',
    Confirmed: 'Confirmed',
    'In Progress': 'In Progress',
    Completed: 'Completed',
    Cancelled: 'Cancelled',
  };

  // Extract customer location (if available in address)
  const customerAddress = rawJobCard.customer?.address;
  let location = 'Location not specified';
  if (Array.isArray(customerAddress) && customerAddress.length > 0) {
    const address = customerAddress[0];
    location = typeof address === 'string' ? address : 'Customer location';
  }

  return {
    _id: rawJobCard._id,
    id: `JC${rawJobCard.job_card_number || 'N/A'}`,
    date: formattedDate,
    time: formattedTime,
    service: rawJobCard.service_type || 'Service not specified',
    location: location,
    status: statusMap[rawJobCard.service_status] || 'Pending',
    vehicle: vehicleDisplay,
    tyres: [], // Will be populated from services_used if needed
    estimatedDuration: 'Duration not specified', // Not in API response
    cost: rawJobCard.service_total_cost || 0,
    technician: undefined, // Would need to fetch technician details
    user: rawJobCard.customer?._id || '',
    createdAt: rawJobCard.created_at,
    updatedAt: rawJobCard.updated_at,
    // Additional fields with null checks
    paymentStatus: rawJobCard.service_payment_status,
    customerName: rawJobCard.customer?.name || 'Customer not specified',
    vendorName: rawJobCard.vendor?.name || 'Vendor not specified',
    serviceType: rawJobCard.service_type,
    description: rawJobCard.service_description,
    laborCost: rawJobCard.service_labor_cost,
    totalCost: rawJobCard.service_total_cost,
    // New rich data fields with null checks
    customerPhone: rawJobCard.customer?.phone,
    customerEmail: rawJobCard.customer?.email,
    vendorPhone: rawJobCard.vendor?.phone,
    vendorStoreName: rawJobCard.vendor?.vendor?.store_name,
    vehicleNumber: rawJobCard.vehicle?.vehicle_number,
    serviceNotes: rawJobCard.service_notes,
    servicesUsed: rawJobCard.services_used || [],
    productsUsed: (rawJobCard.products_used || []).map((product) => ({
      ...product,
      formatted_name: formatProductName(product),
    })),
    partsUsed: rawJobCard.service_parts_used || [],
    paymentMethod: rawJobCard.service_payment_method,
    paymentDate: rawJobCard.service_payment_date,
    feedback: rawJobCard.service_feedback,
    rating: rawJobCard.service_rating,
    customerAddress:
      rawJobCard.customer?.address && rawJobCard.customer.address.length > 0
        ? `${rawJobCard.customer.address[0].address_1 || ''}, ${
            rawJobCard.customer.address[0].city || ''
          }, ${rawJobCard.customer.address[0].state || ''} ${
            rawJobCard.customer.address[0].pin || ''
          }`
            .trim()
            .replace(/^,\s*/, '')
            .replace(/,\s*$/, '')
        : undefined,
  };
}

export async function getJobCards(token: string, customerId?: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://13.211.190.176:9042';

    // Build query params to filter by customer if customerId is provided
    let url = `${apiUrl}/api/job-cards`;
    if (customerId) {
      // Use URLSearchParams for proper encoding
      const params = new URLSearchParams();
      params.append('exact[customer]', customerId);
      url += `?${params.toString()}`;
    }

    console.log('Fetching job cards from URL:', url);
    console.log('Customer ID:', customerId);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch job cards: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log('Raw API response:', data);
    console.log(
      'Number of job cards returned:',
      data.jobCards?.length || data.length || 0
    );

    // Ensure we always return an array
    let rawJobCards: RawJobCard[] = [];
    if (Array.isArray(data)) {
      rawJobCards = data;
    } else if (data.jobCards && Array.isArray(data.jobCards)) {
      rawJobCards = data.jobCards;
    } else if (data.data && Array.isArray(data.data)) {
      rawJobCards = data.data;
    }

    // Transform each job card to our expected format with error handling
    const transformedJobCards = rawJobCards
      .map((rawJobCard) => {
        try {
          return transformJobCard(rawJobCard);
        } catch (error) {
          console.error('Error transforming job card:', error, rawJobCard);
          return null;
        }
      })
      .filter((jobCard): jobCard is JobCard => jobCard !== null);

    console.log('Transformed job cards:', transformedJobCards);

    return {
      data: transformedJobCards,
      error: null,
    };
  } catch (error: any) {
    console.error('Error in getJobCards:', error);
    return {
      data: [],
      error: error.message || 'Failed to fetch job cards',
    };
  }
}

export async function createJobCard(
  token: string,
  jobCardData: Partial<JobCard>
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/job-cards`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobCardData),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to create job card');
    }

    const data = await response.json();
    return {
      data: data,
      error: null,
    };
  } catch (error: any) {
    return {
      data: null,
      error: error.message || 'Failed to create job card',
    };
  }
}

export async function updateJobCard(
  token: string,
  jobCardId: string,
  updates: Partial<JobCard>
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/job-cards/${jobCardId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update job card');
    }

    const data = await response.json();
    return {
      data: data,
      error: null,
    };
  } catch (error: any) {
    return {
      data: null,
      error: error.message || 'Failed to update job card',
    };
  }
}

export async function cancelJobCard(token: string, jobCardId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/job-cards/${jobCardId}/cancel`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to cancel job card');
    }

    const data = await response.json();
    return {
      data: data,
      error: null,
    };
  } catch (error: any) {
    return {
      data: null,
      error: error.message || 'Failed to cancel job card',
    };
  }
}

export async function getJobCardById(token: string, jobCardId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/job-cards/${jobCardId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch job card');
    }

    const rawData = await response.json();

    // Transform the raw data to our expected format
    const transformedData = transformJobCard(rawData);

    return {
      data: transformedData,
      error: null,
    };
  } catch (error: any) {
    return {
      data: null,
      error: error.message || 'Failed to fetch job card',
    };
  }
}
