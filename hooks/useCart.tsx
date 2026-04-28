'use client';

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { toast } from 'sonner';
import { CartItem, Cart, AddToCartParams } from '@/types/cart';

interface CartContextType {
  cart: Cart;
  addToCart: (params: AddToCartParams) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateQuantityByProductVendor: (
    productId: string,
    vendorId: string,
    change: number
  ) => void;
  clearCart: () => void;
  isInCart: (productId: string, vendorId: string) => boolean;
  getCartItemQuantity: (productId: string, vendorId: string) => number;
  removeItemByProductAndVendor: (productId: string, vendorId: string) => void;
  isCartLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | {
      type: 'REMOVE_BY_PRODUCT_VENDOR';
      payload: { productId: string; vendorId: string };
    }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.productId === action.payload.productId &&
          item.vendorId === action.payload.vendorId
      );

      if (existingItemIndex > -1) {
        // Update existing item quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity:
            updatedItems[existingItemIndex].quantity + action.payload.quantity,
        };

        const totalItems = updatedItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        const totalPrice = updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        return {
          ...state,
          items: updatedItems,
          totalItems,
          totalPrice,
        };
      } else {
        // Add new item
        const newItems = [...state.items, action.payload];
        const totalItems = newItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        const totalPrice = newItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        return {
          ...state,
          items: newItems,
          totalItems,
          totalPrice,
        };
      }
    }

    case 'REMOVE_ITEM': {
      const filteredItems = state.items.filter(
        (item) => item.id !== action.payload
      );
      const totalItems = filteredItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const totalPrice = filteredItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return {
        ...state,
        items: filteredItems,
        totalItems,
        totalPrice,
      };
    }

    case 'REMOVE_BY_PRODUCT_VENDOR': {
      const filteredItems = state.items.filter(
        (item) =>
          !(
            item.productId === action.payload.productId &&
            item.vendorId === action.payload.vendorId
          )
      );
      const totalItems = filteredItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const totalPrice = filteredItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return {
        ...state,
        items: filteredItems,
        totalItems,
        totalPrice,
      };
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );

      const totalItems = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const totalPrice = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalPrice,
      };
    }

    case 'CLEAR_CART':
      return {
        items: [],
        totalItems: 0,
        totalPrice: 0,
      };

    case 'LOAD_CART': {
      const totalItems = action.payload.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const totalPrice = action.payload.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return {
        items: action.payload,
        totalItems,
        totalPrice,
      };
    }

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    totalPrice: 0,
  });

  const [isCartLoaded, setIsCartLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        console.log('Loading cart from localStorage:', parsedCart);

        // Validate cart structure and filter out invalid items
        const validItems = Array.isArray(parsedCart)
          ? parsedCart.filter((item: any) => {
              // Check if item has required fields for new structure
              return (
                item &&
                item.id &&
                item.productId &&
                item.vendorId &&
                item.productType &&
                ['TYRE', 'ALLOY_WHEEL', 'SERVICE'].includes(item.productType) &&
                item.name &&
                item.price &&
                typeof item.quantity === 'number'
              );
            })
          : [];

        if (validItems.length !== parsedCart.length) {
          console.log(
            'Some legacy cart items were filtered out due to incompatible structure'
          );
        }

        console.log('Valid cart items loaded:', validItems.length);
        dispatch({ type: 'LOAD_CART', payload: validItems });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        // Clear invalid cart data
        localStorage.removeItem('cart');
      }
    } else {
      console.log('No saved cart found in localStorage');
    }
    setIsCartLoaded(true);

    // Listen for localStorage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart' && e.newValue) {
        try {
          const parsedCart = JSON.parse(e.newValue);
          const validItems = Array.isArray(parsedCart) ? parsedCart : [];
          console.log('Cart updated from another tab:', validItems);
          dispatch({ type: 'LOAD_CART', payload: validItems });
        } catch (error) {
          console.error('Error parsing cart from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save cart to localStorage whenever it changes (but only after initial load)
  useEffect(() => {
    if (isCartLoaded) {
      try {
        localStorage.setItem('cart', JSON.stringify(cart.items));
        console.log('Cart saved to localStorage:', cart.items.length, 'items');
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
      }
    }
  }, [cart.items, isCartLoaded]);

  const addToCart = (params: AddToCartParams) => {
    const {
      productId,
      vendorId,
      productType,
      quantity = 1,
      price,
      originalPrice,
      vendorProduct,
    } = params;

    // Extract product details based on product type
    let name = '';
    let brand = '';
    let size = '';
    let image = '';
    let productDetails = {};

    switch (productType) {
      case 'TYRE':
        const tyreBrand =
          vendorProduct.productSpec?.productBrand?.name ||
          vendorProduct.brand?.brand_name ||
          'Unknown Brand';
        const tyreSpecs = `${
          vendorProduct.productSpec?.tyreWidth?.[0]?.name || ''
        }${
          vendorProduct.productSpec?.tyreWidthType === 'IN MM'
            ? `/${vendorProduct.productSpec?.aspectRatio?.[0]?.name || ''}`
            : ''
        }${vendorProduct.productSpec?.construction || ''}${
          vendorProduct.productSpec?.rimDiameter?.[0]?.name || ''
        }${vendorProduct.productSpec?.plyRating?.[0]?.name || ''}${
          vendorProduct.productSpec?.loadIndex?.[0]?.name || ''
        }${vendorProduct.productSpec?.speedSymbol?.[0]?.name || ''}${
          vendorProduct.productSpec?.productThreadPattern?.[0]?.name || ''
        }${vendorProduct.productSpec?.unit || ''}`;
        name = `${tyreBrand} ${tyreSpecs}`.trim();
        brand = tyreBrand;
        size = `${vendorProduct.productSpec?.tyreWidth?.[0]?.name || ''}/${
          vendorProduct.productSpec?.aspectRatio?.[0]?.name || ''
        }${vendorProduct.productSpec?.construction || ''}${
          vendorProduct.productSpec?.rimDiameter?.[0]?.name || ''
        }`;
        image = vendorProduct.productSpec?.productImages?.[0];
        productDetails = {
          tyreWidth: vendorProduct.productSpec?.tyreWidth?.[0],
          aspectRatio: vendorProduct.productSpec?.aspectRatio?.[0],
          construction: vendorProduct.productSpec?.construction,
          rimDiameter: vendorProduct.productSpec?.rimDiameter?.[0],
        };
        break;

      case 'ALLOY_WHEEL':
        const alloyBrand =
          vendorProduct.productSpec?.alloyBrand?.name ||
          vendorProduct.productSpec?.productBrand?.name ||
          vendorProduct.brand?.brand_name ||
          'Unknown Brand';
        const diameter =
          vendorProduct.productSpec?.alloyDiameterInches?.name ||
          vendorProduct.alloy_wheel?.diameter?.name ||
          vendorProduct.alloy_wheel?.diameter ||
          '';
        const width =
          vendorProduct.productSpec?.alloyWidth?.[0]?.name ||
          vendorProduct.alloy_wheel?.width ||
          '';
        const finish =
          vendorProduct.productSpec?.alloyFinish?.[0]?.name ||
          vendorProduct.alloy_wheel?.finish ||
          '';
        name = `${alloyBrand} ${diameter}X${width} ${finish}`.trim();
        brand = alloyBrand;
        size = `${diameter}"x${width}"`;
        image =
          vendorProduct.product_images?.[0] ||
          vendorProduct.productSpec?.productImages?.[0];
        productDetails = {
          diameter: vendorProduct.alloy_wheel?.diameter,
          width: vendorProduct.alloy_wheel?.width,
          pcd: vendorProduct.alloy_wheel?.pcd,
          offset: vendorProduct.alloy_wheel?.offset,
          finish: vendorProduct.alloy_wheel?.finish,
        };
        break;

      case 'SERVICE':
        name =
          vendorProduct.productSpec?.serviceName ||
          vendorProduct.service?.serviceName ||
          'Service';
        brand = vendorProduct.vendor?.store_name || 'Service Provider';
        size = vendorProduct.service?.serviceType || '';
        image = vendorProduct.service?.serviceImages?.[0];
        productDetails = {
          service_type: vendorProduct.service?.serviceType,
          estimated_time: vendorProduct.service?.estimatedTime,
          location_type: vendorProduct.service?.locationType,
        };
        break;

      default:
        name = 'Unknown Product';
        brand = 'Unknown Brand';
    }

    const cartItem: CartItem = {
      id: `${productId}-${vendorId}`, // Unique combination
      productId,
      vendorId,
      productType,
      name,
      brand,
      size,
      price,
      originalPrice,
      quantity,
      image,
      vendor: {
        id: vendorId,
        name:
          vendorProduct.vendor?.store_name ||
          vendorProduct.vendor?.name ||
          'Unknown Vendor',
        location:
          vendorProduct.vendor?.city && vendorProduct.vendor?.state
            ? `${vendorProduct.vendor.city}, ${vendorProduct.vendor.state}`
            : 'Unknown Location',
        store_name: vendorProduct.vendor?.store_name,
      },
      product: {
        id: productId,
        productImages:
          productType === 'TYRE'
            ? vendorProduct.productSpec?.productImages
            : productType === 'ALLOY_WHEEL'
            ? vendorProduct.product_images
            : vendorProduct.service?.serviceImages,
        productBrand: vendorProduct.brand,
        ...productDetails,
      },
      inStock: vendorProduct.in_stock !== false,
      stock: vendorProduct.stock || 999,
      installationFee: 0, // Default, can be updated later
      deliveryTime: 'Same Day', // Default
    };

    dispatch({ type: 'ADD_ITEM', payload: cartItem });

    if (quantity > 0) {
      toast.success(`Added ${name} to cart!`);
    } else {
      toast.success(`Updated ${name} quantity in cart!`);
    }
  };

  const removeFromCart = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
    toast.success('Item removed from cart');
  };

  const removeItemByProductAndVendor = (
    productId: string,
    vendorId: string
  ) => {
    dispatch({
      type: 'REMOVE_BY_PRODUCT_VENDOR',
      payload: { productId, vendorId },
    });
    toast.success('Item removed from cart');
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
  };

  const updateQuantityByProductVendor = (
    productId: string,
    vendorId: string,
    change: number
  ) => {
    const item = cart.items.find(
      (item) => item.productId === productId && item.vendorId === vendorId
    );
    if (item) {
      const newQuantity = item.quantity + change;
      updateQuantity(item.id, newQuantity);
    }
  };

  const clearCart = () => {
    console.log('Clearing cart - current items:', cart.items.length);
    console.trace('Cart cleared from:'); // This will show the stack trace
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Cart cleared');
  };

  const isInCart = (productId: string, vendorId: string) => {
    return cart.items.some(
      (item) => item.productId === productId && item.vendorId === vendorId
    );
  };

  const getCartItemQuantity = (productId: string, vendorId: string) => {
    const item = cart.items.find(
      (item) => item.productId === productId && item.vendorId === vendorId
    );
    return item ? item.quantity : 0;
  };

  // Debug utility - expose to window in development
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      process.env.NODE_ENV === 'development'
    ) {
      (window as any).debugCart = {
        getCart: () => cart,
        getLocalStorage: () => {
          const saved = localStorage.getItem('cart');
          return saved ? JSON.parse(saved) : null;
        },
        clearLocalStorage: () => localStorage.removeItem('cart'),
        isCartLoaded,
      };
    }
  }, [cart, isCartLoaded]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateQuantityByProductVendor,
        clearCart,
        isInCart,
        getCartItemQuantity,
        removeItemByProductAndVendor,
        isCartLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
