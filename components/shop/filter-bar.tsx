'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type ProductType = 'TYRE' | 'ALLOY_WHEEL' | 'SERVICE';

type FilterOptions = {
  brands?: string[];
  priceRange?: { min: number; max: number };
  // Tyres
  rimDiameters?: string[];
  tyreWidths?: string[];
  // Alloy wheels
  alloyDiameters?: string[];
  alloyWidths?: string[];
  // Services
  serviceTypes?: string[];
};

export default function FilterBar({
  type,
  filterOptions = {},
}: {
  type: ProductType;
  filterOptions?: FilterOptions;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const debounceRef = useRef<number | null>(null);

  const paramsToPersist = useMemo(
    () => [
      'brand',
      'priceMin',
      'priceMax',
      'sortBy',
      'search',
      // Tyre
      'rimDiameter',
      'tyreWidth',
      // Alloy
      'alloyDiameter',
      'alloyWidth',
      // Service
      'serviceType',
    ],
    []
  );

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(searchParams.toString());
      if (value && value.length > 0) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      // Reset page when filters change
      next.set('page', '1');
      router.replace(`${pathname}?${next.toString()}`);
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    // Keep local search state in sync if URL changes elsewhere
    setSearch(searchParams.get('search') || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('search')]);

  const clearAll = () => {
    const next = new URLSearchParams(searchParams.toString());
    paramsToPersist.forEach((k) => next.delete(k));
    next.set('page', '1');
    router.replace(`${pathname}?${next.toString()}`);
  };

  const onSearchChange = (value: string) => {
    setSearch(value);
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      updateParam('search', value.trim() || null);
    }, 300);
  };

  return (
    <section className='py-6 bg-white border-b'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col lg:flex-row gap-4 items-center'>
          {/* Search */}
          <div className='flex-1 relative w-full'>
            <input
              type='text'
              placeholder={`Search ${type.toLowerCase().replace('_', ' ')}...`}
              className='w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ring)]'
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <span className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 select-none'>
              🔍
            </span>
          </div>

          {/* Generic selects */}
          <div className='flex flex-wrap gap-2 w-full lg:w-auto'>
            {/* Brand */}
            {filterOptions.brands && filterOptions.brands.length > 0 && (
              <select
                className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ring)]'
                value={searchParams.get('brand') || ''}
                onChange={(e) => updateParam('brand', e.target.value || null)}
              >
                <option value=''>All Brands</option>
                {filterOptions.brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            )}

            {/* Price Min */}
            <input
              type='number'
              min={filterOptions.priceRange?.min ?? 0}
              max={filterOptions.priceRange?.max ?? 1000000}
              placeholder={`Min ₹${filterOptions.priceRange?.min ?? ''}`}
              className='w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ring)]'
              value={searchParams.get('priceMin') || ''}
              onChange={(e) => updateParam('priceMin', e.target.value || null)}
            />

            {/* Price Max */}
            <input
              type='number'
              min={filterOptions.priceRange?.min ?? 0}
              max={filterOptions.priceRange?.max ?? 1000000}
              placeholder={`Max ₹${filterOptions.priceRange?.max ?? ''}`}
              className='w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ring)]'
              value={searchParams.get('priceMax') || ''}
              onChange={(e) => updateParam('priceMax', e.target.value || null)}
            />

            {/* Sort By */}
            <select
              className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ring)]'
              value={searchParams.get('sortBy') || 'newest'}
              onChange={(e) => updateParam('sortBy', e.target.value)}
            >
              <option value='newest'>Newest</option>
              <option value='price_low'>Price: Low to High</option>
              <option value='price_high'>Price: High to Low</option>
              <option value='name'>Name</option>
            </select>

            {/* Type-specific */}
            {type === 'TYRE' && (
              <>
                {filterOptions.rimDiameters && (
                  <select
                    className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ring)]'
                    value={searchParams.get('rimDiameter') || ''}
                    onChange={(e) =>
                      updateParam('rimDiameter', e.target.value || null)
                    }
                  >
                    <option value=''>Rim Diameter</option>
                    {filterOptions.rimDiameters.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                )}
                {filterOptions.tyreWidths && (
                  <select
                    className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ring)]'
                    value={searchParams.get('tyreWidth') || ''}
                    onChange={(e) =>
                      updateParam('tyreWidth', e.target.value || null)
                    }
                  >
                    <option value=''>Tyre Width</option>
                    {filterOptions.tyreWidths.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                )}
              </>
            )}

            {type === 'ALLOY_WHEEL' && (
              <>
                {filterOptions.alloyDiameters && (
                  <select
                    className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ring)]'
                    value={searchParams.get('alloyDiameter') || ''}
                    onChange={(e) =>
                      updateParam('alloyDiameter', e.target.value || null)
                    }
                  >
                    <option value=''>Diameter</option>
                    {filterOptions.alloyDiameters.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                )}
                {filterOptions.alloyWidths && (
                  <select
                    className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ring)]'
                    value={searchParams.get('alloyWidth') || ''}
                    onChange={(e) =>
                      updateParam('alloyWidth', e.target.value || null)
                    }
                  >
                    <option value=''>Width</option>
                    {filterOptions.alloyWidths.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                )}
              </>
            )}

            {type === 'SERVICE' && filterOptions.serviceTypes && (
              <select
                className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ring)]'
                value={searchParams.get('serviceType') || ''}
                onChange={(e) =>
                  updateParam('serviceType', e.target.value || null)
                }
              >
                <option value=''>All Services</option>
                {filterOptions.serviceTypes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={clearAll}
              className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50'
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
