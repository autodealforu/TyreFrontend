// Checkout and Order related types
export interface Address {
  id?: string;
  type: 'Home' | 'Office' | 'Other';
  name: string;
  phone: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault?: boolean;
}

export interface CheckoutAddress {
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  pin: number;
  landmark?: string;
}

export interface DeliveryDetails {
  option: 'STANDARD' | 'EXPRESS' | 'SAME_DAY';
  estimated_delivery?: Date;
  delivery_time_slot?: string;
  delivery_charges: number;
}

export interface InstallationDetails {
  option: 'STORE' | 'HOME' | 'NONE';
  total_installation_fee: number;
  scheduled_date?: Date;
  scheduled_time_slot?: string;
  installation_address?: CheckoutAddress;
  special_instructions?: string;
}

export interface OrderProduct {
  product: string; // Product ID
  vendor: string; // Vendor ID
  name: string;
  slug: string;
  brand?: string;
  size?: string;
  regular_price?: number;
  sale_price?: number;
  image?: string;
  quantity: number;
  installation_fee?: number;
  vendor_details: {
    name: string;
    store_name: string;
    location: string;
    phone: string;
  };
}

export interface VendorCommission {
  vendor: string;
  products_total: number;
  installation_total: number;
  commission_percentage: number;
  commission_amount: number;
  is_paid: boolean;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  email?: string;
  customer?: string; // User ID if logged in
}

export interface CreateOrderRequest {
  order_date?: Date;
  status: string;
  is_paid: boolean;
  payment_method: 'ONLINE' | 'COD';
  total_amount: number;
  sub_total: number;
  tax?: number;
  discount?: number;
  delivery_charges?: number;

  shipping_address: CheckoutAddress;
  billing_address: CheckoutAddress;
  same_as_shipping?: boolean;

  customer: OrderCustomer;
  products: OrderProduct[];

  delivery_details?: DeliveryDetails;
  installation_details?: InstallationDetails;

  vendor_commissions?: VendorCommission[];

  created_by?: string;
  updated_by?: string;
}

export interface Order extends CreateOrderRequest {
  _id: string;
  order_id: number;
  order_date: Date;
  courier_details?: {
    length?: string;
    width?: string;
    height?: string;
    breadth?: string;
    weight?: string;
    shipment_id?: string;
    courier?: string;
  };
  shipping_details?: {
    order_id?: string;
    awb?: string;
    current_status?: string;
    current_status_id?: string;
    shipment_status?: string;
    shipment_status_id?: string;
    current_timestamp?: string;
    channel_order_id?: string;
    channel?: string;
    courier_name?: string;
    etd?: string;
    is_return?: string;
    scans?: Array<{
      date?: string;
      activity?: string;
      location?: string;
    }>;
  };
  commission?: {
    is_paid: boolean;
    commission_percentage?: number;
    commission_amount?: number;
    cod_charges?: number;
    delivery_charges?: number;
    tax?: number;
    sub_commission_amount?: number;
    total_commission_amount?: number;
  };
  published_status?: 'PUBLISHED' | 'DRAFT';
  createdAt: Date;
  updatedAt: Date;
}

export interface CheckoutStep {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}

export interface CheckoutState {
  step: number;
  selectedAddress: number;
  billingAddress: number;
  sameAsShipping: boolean;
  deliveryOption: 'STANDARD' | 'EXPRESS' | 'SAME_DAY';
  installationOption: 'STORE' | 'HOME' | 'NONE';
  paymentMethod: 'ONLINE' | 'COD';
  appliedCoupon?: string;
  isProcessing: boolean;
}

export interface CouponCode {
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  min_order_amount?: number;
  max_discount?: number;
  valid_from: Date;
  valid_until: Date;
  usage_limit?: number;
  used_count: number;
  is_active: boolean;
}

export interface PaymentDetails {
  method: 'ONLINE' | 'COD';
  gateway?: 'RAZORPAY' | 'PAYU' | 'STRIPE';
  transaction_id?: string;
  payment_status: 'PENDING' | 'SUCCESS' | 'FAILED';
  payment_amount: number;
  currency: string;
}
