export interface CartItem {
  id: string;
  productId: string;
  vendorId: string;
  productType: 'TYRE' | 'ALLOY_WHEEL' | 'SERVICE';
  name: string;
  brand: string;
  size?: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image?: string;
  vendor: {
    id: string;
    name: string;
    location: string;
    store_name?: string;
  };
  product: {
    id: string;
    productImages?: Array<{ image: string }>;
    productBrand?: { name: string };
    // Tyre specific fields
    tyreWidth?: { name: string };
    aspectRatio?: { name: string };
    construction?: string;
    rimDiameter?: { name: string };
    // Alloy wheel specific fields
    diameter?: string;
    width?: string;
    pcd?: string;
    offset?: string;
    finish?: string;
    // Service specific fields
    service_type?: string;
    estimated_time?: string;
    location_type?: string;
  };
  inStock: boolean;
  stock: number;
  installationFee?: number;
  deliveryTime?: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  appliedCoupon?: string;
  discount?: number;
}

export interface AddToCartParams {
  productId: string;
  vendorId: string;
  productType: 'TYRE' | 'ALLOY_WHEEL' | 'SERVICE';
  quantity?: number;
  price: number;
  originalPrice?: number;
  vendorProduct: any; // The full vendor product object
}
