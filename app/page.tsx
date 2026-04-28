export const dynamic = 'force-dynamic';
import MultiProductHomepage from '@/components/homepage-enhanced';
import axios from 'axios';
// import MultiProductHomepage from '@/components/homepage-enhanced';

export default async function Page() {
  try {
    // Get featured products for all categories
    const featuredProducts = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/homepages/featured-products`
    );

    // Get banners
    const banners = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/banners`
    );

    // Get filter options for each product type
    const [tyreFilters, alloyFilters, serviceFilters] = await Promise.all([
      axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/website/filters/TYRE`
      ),
      axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/website/filters/ALLOY_WHEEL`
      ),
      axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/website/filters/SERVICE`
      ),
    ]);

    console.log('Featured products:', JSON.stringify(featuredProducts.data));

    return (
      <MultiProductHomepage
        featuredProducts={featuredProducts?.data?.data}
        banners={banners?.data?.banners}
        filterOptions={{
          tyre: tyreFilters?.data?.data,
          alloyWheel: alloyFilters?.data?.data,
          service: serviceFilters?.data?.data,
        }}
      />
    );
  } catch (error) {
    console.error('Homepage error:', error);
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-red-600 mb-4'>
            Something went wrong
          </h1>
          <p className='text-gray-600'>Please try refreshing the page.</p>
        </div>
      </div>
    );
  }
}
