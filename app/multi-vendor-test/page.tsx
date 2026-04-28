import MultiVendorProductListing from '@/components/multi-vendor-product-listing';

export default function MultiVendorTestPage() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8'>
        Multi-Vendor Product Listing Test
      </h1>

      <div className='space-y-8'>
        <div>
          <h2 className='text-2xl font-semibold mb-4'>Tyres</h2>
          <MultiVendorProductListing productType='TYRE' />
        </div>

        <div>
          <h2 className='text-2xl font-semibold mb-4'>Alloy Wheels</h2>
          <MultiVendorProductListing productType='ALLOY_WHEEL' />
        </div>

        <div>
          <h2 className='text-2xl font-semibold mb-4'>Services</h2>
          <MultiVendorProductListing productType='SERVICE' />
        </div>
      </div>
    </div>
  );
}
