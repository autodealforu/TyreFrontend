'use server';

import {
  CreateOrderRequest,
  Order,
  Address,
  CouponCode,
} from '@/types/checkout';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createOrder(orderData: CreateOrderRequest): Promise<{
  success: boolean;
  message: string;
  order?: Order;
  error?: any;
}> {
  try {
    // Transform cart data to order format
    const orderRequest = {
      ...orderData,
      order_date: new Date(),
      status: 'PENDING',
      published_status: 'PUBLISHED',
    };

    const response = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderRequest),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: true,
      message: 'Order created successfully',
      order: result.order,
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      success: false,
      message: 'Failed to create order',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function getOrders(userId?: string): Promise<{
  success: boolean;
  orders?: Order[];
  message?: string;
  error?: any;
}> {
  try {
    // In a real implementation, this would be an API call
    const response = await fetch(`${API_URL}/api/orders?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: true,
      orders: result.orders,
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return {
      success: false,
      message: 'Failed to fetch orders',
      error,
    };
  }
}

export async function getOrderById(orderId: string): Promise<{
  success: boolean;
  order?: Order;
  message?: string;
  error?: any;
}> {
  try {
    // In a real implementation, this would be an API call
    const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: true,
      order: result.order,
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    return {
      success: false,
      message: 'Failed to fetch order',
      error,
    };
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<{
  success: boolean;
  message: string;
  order?: Order;
  error?: any;
}> {
  try {
    // In a real implementation, this would be an API call
    const response = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: true,
      message: 'Order status updated successfully',
      order: result.order,
    };
  } catch (error) {
    console.error('Error updating order status:', error);
    return {
      success: false,
      message: 'Failed to update order status',
      error,
    };
  }
}

export async function getUserAddresses(
  userId?: string,
  token?: string
): Promise<{
  success: boolean;
  addresses?: Address[];
  message?: string;
  error?: any;
}> {
  try {
    if (!userId) {
      return {
        success: false,
        message: 'User ID is required',
      };
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/api/users/${userId}/addresses`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: result.success,
      addresses: result.data,
    };
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return {
      success: false,
      message: 'Failed to fetch addresses',
      error,
    };
  }
}

export async function addUserAddress(
  userId: string,
  address: Omit<Address, 'id'>,
  token?: string
): Promise<{
  success: boolean;
  message: string;
  address?: Address;
  error?: any;
}> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/api/users/${userId}/addresses`, {
      method: 'POST',
      headers,
      body: JSON.stringify(address),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: result.success,
      message: result.message,
      address: result.address,
    };
  } catch (error) {
    console.error('Error adding address:', error);
    return {
      success: false,
      message: 'Failed to add address',
      error,
    };
  }
}

export async function validateCoupon(
  code: string,
  orderTotal: number
): Promise<{
  success: boolean;
  coupon?: CouponCode;
  discount?: number;
  message?: string;
  error?: any;
}> {
  try {
    const response = await fetch(`${API_URL}/api/coupons/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, orderAmount: orderTotal }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: result.success,
      coupon: result.coupon,
      discount: result.discount,
      message: result.message,
    };
  } catch (error) {
    console.error('Error validating coupon:', error);
    return {
      success: false,
      message: 'Failed to validate coupon',
      error,
    };
  }
}

export async function initializePayment(
  orderId: string,
  amount: number,
  method: 'ONLINE' | 'COD'
): Promise<{
  success: boolean;
  payment_url?: string;
  transaction_id?: string;
  message?: string;
  error?: any;
}> {
  try {
    if (method === 'COD') {
      return {
        success: true,
        message: 'Cash on Delivery order confirmed',
      };
    }

    // In a real implementation, this would integrate with payment gateway
    const response = await fetch(`${API_URL}/api/payments/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId, amount, method }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: true,
      payment_url: result.payment_url,
      transaction_id: result.transaction_id,
      message: 'Payment initialized successfully',
    };
  } catch (error) {
    console.error('Error initializing payment:', error);

    // Mock payment initialization for development
    return {
      success: true,
      payment_url: '/payment/mock',
      transaction_id: 'mock_txn_' + Date.now(),
      message: 'Payment initialized successfully (mock)',
    };
  }
}

export async function updateOrderPaymentStatus(
  orderId: string,
  paymentStatus: string,
  transactionId: string,
  gateway: string,
  token?: string
): Promise<{
  success: boolean;
  message?: string;
  order?: any;
  error?: any;
}> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/api/orders/${orderId}/payment-status`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        payment_status: paymentStatus,
        transaction_id: transactionId,
        gateway,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: result.success,
      message: result.message,
      order: result.order,
    };
  } catch (error) {
    console.error('Error updating payment status:', error);
    return {
      success: false,
      message: 'Failed to update payment status',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

