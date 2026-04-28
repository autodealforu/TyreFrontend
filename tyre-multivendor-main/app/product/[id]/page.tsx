import { getTyre } from '@/actions/tyre.action';
import ProductDetails from '@/components/product-details';
import SingleProductPage from '@/components/single-product-page';
import axios from 'axios';

type Params = Promise<{ id: string }>;

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;

  // Check if this is a single product view request
  const type = resolvedSearchParams.type as string;
  const isSingleProductView =
    type && ['TYRE', 'ALLOY_WHEEL', 'SERVICE'].includes(type);

  if (isSingleProductView) {
    // Single product view with all vendors
    return (
      <SingleProductPage
        productType={type as 'TYRE' | 'ALLOY_WHEEL' | 'SERVICE'}
        specId={id}
      />
    );
  }

  // Original product details view
  try {
    // Get the base tyre details (independent tyre info)
    const tyreResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tyres/${id}`
    );

    // Get all vendor products for this tyre
    const vendorProductsResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products?exact[tyre]=${id}`
    );

    // Find minimum price from all vendor products
    const vendorProducts = vendorProductsResponse?.data?.products || [];
    const minPrice =
      vendorProducts.length > 0
        ? Math.min(
            ...vendorProducts.map(
              (product: any) => product.tyre_price_auto_deal
            )
          )
        : null;

    return (
      <ProductDetails
        tyre={tyreResponse?.data}
        vendorProducts={vendorProducts}
        minPrice={minPrice}
        totalVendors={vendorProducts.length}
      />
    );
  } catch (error) {
    console.error('Error fetching product data:', error);
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>
            Something went wrong
          </h1>
          <p className='text-gray-600'>
            Unable to load product details. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
