// lib/services-api.ts - Service API Integration

export interface ServiceOption {
  _id: string;
  serviceName: string;
  serviceDescription: string;
  price: number;
  duration: string;
  serviceType: 'DELIVERY' | 'INSTALLATION' | 'MAINTENANCE';
  available: boolean;
}

export class ServicesAPI {
  private static API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch delivery services
  static async getDeliveryServices(): Promise<ServiceOption[]> {
    try {
      const response = await fetch(
        `${this.API_URL}/api/services/category/DELIVERY`
      );
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching delivery services:', error);
      return [];
    }
  }

  // Fetch installation services
  static async getInstallationServices(): Promise<ServiceOption[]> {
    try {
      const response = await fetch(
        `${this.API_URL}/api/services/category/INSTALLATION`
      );
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching installation services:', error);
      return [];
    }
  }

  // Calculate service pricing based on cart items
  static calculateServicePrice(
    service: ServiceOption,
    cartItems: any[]
  ): number {
    // Dynamic pricing logic based on cart contents
    return service.price;
  }
}
