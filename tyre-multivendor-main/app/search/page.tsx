import TyreSearchResults from '@/components/tyre-search-results';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  try {
    // Await searchParams as required by Next.js 15
    const params = await searchParams;

    // Build query string from search params
    const queryString = new URLSearchParams();

    // Pass through all search parameters to the API
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((v) => queryString.append(key, v));
        } else {
          queryString.append(key, value);
        }
      }
    });

    const tyresRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tyres?${queryString.toString()}`,
      {
        cache: 'no-store', // disables Next.js caching
      }
    );
    const tyres = await tyresRes.json();
    console.log('tyres data', tyres);

    const brandsRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/brands/all`,
      {
        cache: 'no-store',
      }
    );
    const brands = await brandsRes.json();

    // Fetch Aspect Ratios
    const aspectRatiosRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/aspect-ratios/all`,
      {
        cache: 'no-store',
      }
    );
    const aspectRatios = await aspectRatiosRes.json();

    // Fetch Load Indexes
    const loadIndexesRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/load-indexes/all`,
      {
        cache: 'no-store',
      }
    );
    const loadIndexes = await loadIndexesRes.json();

    // Fetch Ply Ratings
    const plyRatingsRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/ply-ratings/all`,
      {
        cache: 'no-store',
      }
    );
    const plyRatings = await plyRatingsRes.json();

    // Fetch Product Thread Patterns
    const productThreadPatternsRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/thread-patterns/all`,
      {
        cache: 'no-store',
      }
    );
    const productThreadPatterns = await productThreadPatternsRes.json();

    // Fetch Product Types
    const productTypesRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/product-types/all`,
      {
        cache: 'no-store',
      }
    );
    const productTypes = await productTypesRes.json();

    // Fetch Rim Diameters
    const rimDiametersRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/rim-diameters/all`,
      {
        cache: 'no-store',
      }
    );
    const rimDiameters = await rimDiametersRes.json();

    // Fetch Speed Symbols
    const speedSymbolsRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/speed-symbols/all`,
      {
        cache: 'no-store',
      }
    );
    const speedSymbols = await speedSymbolsRes.json();

    // Fetch Tyre Widths
    const tyreWidthsRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tyre-widths/all`,
      {
        cache: 'no-store',
      }
    );
    const tyreWidths = await tyreWidthsRes.json();

    return (
      <TyreSearchResults
        initialTyres={tyres}
        brands={brands}
        aspectRatios={aspectRatios}
        loadIndexes={loadIndexes}
        plyRatings={plyRatings}
        productThreadPatterns={productThreadPatterns}
        productTypes={productTypes}
        rimDiameters={rimDiameters}
        speedSymbols={speedSymbols}
        tyreWidths={tyreWidths}
      />
    );
  } catch (error) {
    return (
      <div>
        <div>Something went wrong</div>
      </div>
    );
  }
}
