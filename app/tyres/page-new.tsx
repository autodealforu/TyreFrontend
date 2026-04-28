import axios from 'axios';

interface SearchParams {
  page?: string;
  brand?: string;
  priceMin?: string;
  priceMax?: string;
  sortBy?: string;
  search?: string;
  rimDiameter?: string;
  tyreWidth?: string;
}

interface Props {
  searchParams: SearchParams;
}

// Since ProductListing component doesn't exist yet, we'll create a simplified version
// This will be updated once we create the ProductListing component
export default async function TyresPage({ searchParams }: Props) {
  try {
    const queryParams = new URLSearchParams({
      type: 'TYRE',
      page: searchParams.page || '1',
      limit: '12',
      ...(searchParams.brand && { brand: searchParams.brand }),
      ...(searchParams.priceMin && { priceMin: searchParams.priceMin }),
      ...(searchParams.priceMax && { priceMax: searchParams.priceMax }),
      ...(searchParams.sortBy && { sortBy: searchParams.sortBy }),
      ...(searchParams.search && { search: searchParams.search }),
      ...(searchParams.rimDiameter && {
        rimDiameter: searchParams.rimDiameter,
      }),
      ...(searchParams.tyreWidth && { tyreWidth: searchParams.tyreWidth }),
    });

    const [productsResponse, filtersResponse] = await Promise.all([
      axios.get(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/api/products/website?${queryParams.toString()}`
      ),
      axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/website/filters/TYRE`
      ),
    ]);

    const products = productsResponse.data.data.products;
    const pagination = productsResponse.data.data.pagination;
    const filterOptions = filtersResponse.data.data;

    return (
      <div className='min-h-screen bg-gray-50'>
        {/* Header Section */}
        <section className='bg-blue-600 text-white py-16'>
          <div className='container mx-auto px-4'>
            <div className='max-w-4xl'>
              <h1 className='text-4xl md:text-5xl font-bold mb-4'>
                Premium Tyres
              </h1>
              <p className='text-xl mb-6 opacity-90'>
                Find the perfect tyres for your vehicle from top brands
              </p>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className='py-8'>
          <div className='container mx-auto px-4'>
            <div className='mb-6'>
              <h2 className='text-2xl font-bold mb-4'>
                Showing {products.length} tyres
              </h2>
            </div>

            {/* Products Grid */}
            <div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {products.map((product: any) => (
                <div
                  key={product._id}
                  className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'
                >
                  <div className='p-4'>
                    <div className='aspect-square bg-gray-100 rounded-md mb-4 flex items-center justify-center'>
                      {product.product_images && product.product_images[0] ? (
                        <img
                          src={product.product_images[0]}
                          alt={product.product_name}
                          className='w-full h-full object-cover rounded-md'
                        />
                      ) : (
                        <span className='text-gray-400'>No Image</span>
                      )}
                    </div>

                    <h3 className='font-semibold mb-2 line-clamp-2'>
                      {product.tyre?.productBrand?.name}{' '}
                      {product.tyre?.tyreWidth?.name}/
                      {product.tyre?.aspectRatio?.name} R
                      {product.tyre?.rimDiameter?.name}
                    </h3>

                    <p className='text-sm text-gray-600 mb-3'>
                      {product.tyre?.construction} •{' '}
                      {product.tyre?.productThreadPattern?.name}
                    </p>

                    <div className='flex justify-between items-center'>
                      <div className='flex flex-col'>
                        {product.mrp_price > product.auto_deal_price && (
                          <span className='text-xs text-gray-500 line-through'>
                            ₹{product.mrp_price}
                          </span>
                        )}
                        <span className='font-bold text-blue-600'>
                          ₹{product.auto_deal_price}
                        </span>
                      </div>
                      <button className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className='mt-8 flex justify-center'>
                <div className='flex space-x-2'>
                  {Array.from(
                    { length: pagination.pages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <a
                      key={page}
                      href={`?page=${page}`}
                      className={`px-3 py-2 rounded-md ${
                        page === pagination.page
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('Tyres page error:', error);
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-red-600 mb-4'>
            Error loading tyres
          </h1>
          <p className='text-gray-600'>Please try again later.</p>
        </div>
      </div>
    );
  }
}
