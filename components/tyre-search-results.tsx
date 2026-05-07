'use client';

import {
  Star,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Filter,
  Loader2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import qs from 'qs';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { API_URL } from '@/constants';
import { INamedComponents } from './home/types';

// URL parameter utilities
const parseArrayParam = (param: string | null): string[] => {
  if (!param) return [];
  return param.split(',').filter(Boolean);
};

const parseNumberParam = (
  param: string | null,
  defaultValue: number
): number => {
  if (!param) return defaultValue;
  const parsed = parseInt(param, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

const parseRangeParam = (
  param: string | null,
  defaultRange: [number, number]
): [number, number] => {
  if (!param) return defaultRange;
  const [min, max] = param.split('-').map(Number);
  if (isNaN(min) || isNaN(max)) return defaultRange;
  return [min, max];
};

// Types for filters
interface FilterState {
  brands: string[];
  aspectRatios: string[];
  loadIndexes: string[];
  plyRatings: string[];
  threadPatterns: string[];
  productTypes: string[];
  rimDiameters: string[];
  speedSymbols: string[];
  tyreWidths: string[];
  categories: string[];
  specificCategories: string[];
  subCategories: string[];
  constructions: string[];
  warranties: string[];
  tyreWidthTypes: string[];
  publishedStatus: string[];
  gstTaxRates: string[];
  gstTax: string[];
  units: string[];
  hsnCodes: string[];
  priceRange: [number, number];
  page: number;
  sortBy: string;
  viewMode: 'grid' | 'list';
}

// Helper function to construct proper image URLs
const getImageUrl = (imagePath: string | undefined): string => {
  // Early return for empty/undefined paths
  if (!imagePath) {
    return '/default-image.png';
  }

  // If the path is already a complete URL (testing environment with external URLs)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    // Validate that it's a proper URL and return it directly
    try {
      const url = new URL(imagePath);
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        return imagePath; // Return the complete URL as-is
      }
    } catch (error) {
      console.error('Invalid external URL:', imagePath);
      return '/default-image.png';
    }
  }

  // For relative paths, check if API_URL is defined and not empty
  if (!API_URL || API_URL.trim() === '') {
    console.error(
      'API_URL environment variable is not set. Please configure NEXT_PUBLIC_API_URL'
    );
    return '/default-image.png';
  }

  try {
    // Clean up the image path - remove leading slashes and normalize slashes
    const cleanPath = imagePath.replace(/^[\/\\]+/, '').replace(/\\/g, '/');

    // Ensure API_URL doesn't end with a slash
    const baseUrl = API_URL.replace(/\/$/, '');

    // Construct the full URL for production paths (like /uploads/...)
    const fullUrl = `${baseUrl}/${cleanPath}`;

    // Basic validation without using URL constructor for the final URL
    if (fullUrl.includes('undefined') || fullUrl.includes('null')) {
      console.error('Invalid URL contains undefined or null values:', fullUrl);
      return '/default-image.png';
    }

    // Check if it looks like a valid URL (basic check)
    if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
      console.error('URL does not start with http:// or https://:', fullUrl);
      return '/default-image.png';
    }

    return fullUrl;
  } catch (error) {
    console.error('Error constructing image URL:', {
      imagePath,
      API_URL,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return '/default-image.png';
  }
};

// Helper function to safely convert to string array
const toStringArray = (value: any): string[] => {
  if (Array.isArray(value)) {
    return value.filter((v) => typeof v === 'string') as string[];
  }
  if (typeof value === 'string') {
    return value.includes(',') ? value.split(',').filter(Boolean) : [value];
  }
  return [];
};

// Parse URL parameters to get current filter state
const getFiltersFromURL = (): FilterState => {
  if (typeof window === 'undefined') {
    return {
      brands: [],
      aspectRatios: [],
      loadIndexes: [],
      plyRatings: [],
      threadPatterns: [],
      productTypes: [],
      rimDiameters: [],
      speedSymbols: [],
      tyreWidths: [],
      categories: [],
      specificCategories: [],
      subCategories: [],
      constructions: [],
      warranties: [],
      tyreWidthTypes: [],
      publishedStatus: [],
      gstTaxRates: [],
      gstTax: [],
      units: [],
      hsnCodes: [],
      priceRange: [5000, 25000],
      page: 1,
      sortBy: 'popularity',
      viewMode: 'grid',
    };
  }

  // Get the query string from current URL
  const queryString =
    typeof window !== 'undefined' ? window.location.search.slice(1) : ''; // Remove the '?' prefix

  // Parse using qs
  const parsed = qs.parse(queryString);

  // Initialize filters with defaults
  const filters: FilterState = {
    brands: [],
    aspectRatios: [],
    loadIndexes: [],
    plyRatings: [],
    threadPatterns: [],
    productTypes: [],
    rimDiameters: [],
    speedSymbols: [],
    tyreWidths: [],
    categories: [],
    specificCategories: [],
    subCategories: [],
    constructions: [],
    warranties: [],
    tyreWidthTypes: [],
    publishedStatus: [],
    gstTaxRates: [],
    gstTax: [],
    units: [],
    hsnCodes: [],
    priceRange: [5000, 25000],
    page: parseNumberParam(parsed.pageNumber as string, 1),
    sortBy: (parsed.sortBy as string) || 'popularity',
    viewMode: (parsed.viewMode as string as 'grid' | 'list') || 'grid',
  };

  // Map backend field names to frontend filter keys
  const backendToFrontendMapping: Record<string, keyof FilterState> = {
    productBrand: 'brands',
    aspectRatio: 'aspectRatios',
    loadIndex: 'loadIndexes',
    plyRating: 'plyRatings',
    productThreadPattern: 'threadPatterns',
    productType: 'productTypes',
    rimDiameter: 'rimDiameters',
    speedSymbol: 'speedSymbols',
    tyreWidth: 'tyreWidths',
  };

  // Parse exact and conditional queries - handle both old nested structure and new object structure

  // Handle exact queries as nested object
  if (parsed.exact && typeof parsed.exact === 'object') {
    Object.keys(parsed.exact).forEach((fieldName) => {
      const frontendKey = backendToFrontendMapping[fieldName];
      if (frontendKey) {
        const value = (parsed.exact as any)[fieldName];
        if (typeof value === 'string') {
          (filters[frontendKey] as string[]).push(value);
        }
      }
    });
  }

  // Handle old bracket notation for backward compatibility
  Object.keys(parsed).forEach((key) => {
    if (key.startsWith('exact[') && key.endsWith(']')) {
      const fieldName = key.slice(6, -1); // Extract field name from exact[fieldName]
      const frontendKey = backendToFrontendMapping[fieldName];
      if (frontendKey) {
        const value = parsed[key];
        if (typeof value === 'string') {
          (filters[frontendKey] as string[]).push(value);
        }
      }
    }
  });

  // Handle conditional queries (these may be nested objects)
  if (parsed.conditional && typeof parsed.conditional === 'object') {
    Object.keys(parsed.conditional).forEach((fieldName) => {
      const frontendKey = backendToFrontendMapping[fieldName];
      if (frontendKey) {
        const conditionalValue = (parsed.conditional as any)[fieldName];
        if (
          conditionalValue &&
          typeof conditionalValue === 'object' &&
          '$in' in conditionalValue
        ) {
          const inValues = conditionalValue.$in;
          if (typeof inValues === 'string') {
            // Handle comma-separated string
            const values = inValues
              .split(',')
              .map((v) => v.trim())
              .filter(Boolean);
            (filters[frontendKey] as string[]).push(...values);
          } else if (Array.isArray(inValues)) {
            (filters[frontendKey] as string[]).push(...inValues.map(String));
          }
        }
      }
    });
  }

  return filters;
};

export default function StaticSearch({
  initialTyres,
  brands,
  aspectRatios,
  loadIndexes,
  plyRatings,
  productThreadPatterns,
  productTypes,
  rimDiameters,
  speedSymbols,
  tyreWidths,
}: {
  initialTyres: any;
  brands: INamedComponents[];
  aspectRatios?: INamedComponents[];
  loadIndexes?: INamedComponents[];
  plyRatings?: INamedComponents[];
  productThreadPatterns?: INamedComponents[];
  productTypes?: INamedComponents[];
  rimDiameters?: INamedComponents[];
  speedSymbols?: INamedComponents[];
  tyreWidths?: INamedComponents[];
}) {
  // Hook to listen to URL changes
  const [currentURL, setCurrentURL] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentURL(window.location.search);

      const handleURLChange = () => {
        setCurrentURL(window.location.search);
      };

      // Listen for popstate events (back/forward navigation)
      window.addEventListener('popstate', handleURLChange);

      return () => {
        window.removeEventListener('popstate', handleURLChange);
      };
    }
  }, []);

  // Navigation hook
  const router = useRouter();

  // State for loading
  const [isFiltering, setIsFiltering] = useState(false);

  // Use initial tyres directly - no local state needed
  const currentTyres = initialTyres?.tyres || [];
  const totalResults = initialTyres?.count || 0;
  const totalPages = initialTyres?.pages || 1;

  // Helper function to get default filters
  function getDefaultFilters(): FilterState {
    return {
      brands: [],
      aspectRatios: [],
      loadIndexes: [],
      plyRatings: [],
      threadPatterns: [],
      productTypes: [],
      rimDiameters: [],
      speedSymbols: [],
      tyreWidths: [],
      categories: [],
      specificCategories: [],
      subCategories: [],
      constructions: [],
      warranties: [],
      tyreWidthTypes: [],
      publishedStatus: [],
      gstTaxRates: [],
      gstTax: [],
      units: [],
      hsnCodes: [],
      priceRange: [5000, 25000],
      page: 1,
      sortBy: 'popularity',
      viewMode: 'grid',
    };
  }

  // Get current filters from URL and store in state
  const [currentFilters, setCurrentFilters] = useState<FilterState>(() =>
    getFiltersFromURL()
  );

  // Update filters when URL changes
  useEffect(() => {
    const newFilters = getFiltersFromURL();
    setCurrentFilters(newFilters);
  }, [currentURL]);

  // Update URL with new filters
  const updateFilters = useCallback(
    (newFilters: Partial<FilterState>) => {
      const updatedFilters = { ...currentFilters, ...newFilters };
      console.log('Updated filters after merge:', updatedFilters);

      // Reset to page 1 when filters change (except when changing page)
      if (!newFilters.page) {
        updatedFilters.page = 1;
      }

      // Build query object in the format expected by backend
      const queryObject: Record<string, any> = {};

      // Add pagination
      if (updatedFilters.page && updatedFilters.page !== 1) {
        queryObject.pageNumber = updatedFilters.page;
      }

      // Map filter keys to backend field names
      const filterMapping: Record<string, string> = {
        brands: 'productBrand',
        aspectRatios: 'aspectRatio',
        loadIndexes: 'loadIndex',
        plyRatings: 'plyRating',
        threadPatterns: 'productThreadPattern',
        productTypes: 'productType',
        rimDiameters: 'rimDiameter',
        speedSymbols: 'speedSymbol',
        tyreWidths: 'tyreWidth',
      };

      // Initialize exact and conditional objects
      const exact: Record<string, any> = {};
      const conditional: Record<string, any> = {};

      // Build queries for each filter
      Object.entries(updatedFilters).forEach(([key, value]) => {
        if (key === 'priceRange') {
          const [min, max] = value as [number, number];
          if (min !== 5000 || max !== 25000) {
            // Handle price range as conditional query
            conditional.price = {
              $gte: min,
              $lte: max,
            };
          }
        } else if (
          Array.isArray(value) &&
          value.length > 0 &&
          filterMapping[key]
        ) {
          const fieldName = filterMapping[key];
          // Handle multiple selections
          if (value.length === 1) {
            exact[fieldName] = value[0];
          } else {
            // For multiple values, use conditional with $in
            conditional[fieldName] = { $in: value };
          }
        } else if (typeof value === 'string' && value !== '') {
          if (key === 'sortBy' && value !== 'popularity') {
            queryObject[key] = value;
          } else if (key === 'viewMode' && value !== 'grid') {
            queryObject[key] = value;
          }
        }
      });

      // Add exact and conditional objects to query if they have properties
      if (Object.keys(exact).length > 0) {
        queryObject.exact = exact;
      }
      if (Object.keys(conditional).length > 0) {
        queryObject.conditional = conditional;
      }

      console.log('Final queryObject:', queryObject);

      const queryString = qs.stringify(queryObject, {
        encode: false,
        skipNulls: true,
      });

      const currentPath =
        typeof window !== 'undefined' ? window.location.pathname : '/search';
      const newURL = queryString ? `?${queryString}` : currentPath;

      // Update state with the new filters
      setCurrentFilters(updatedFilters);

      // Navigate to new URL
      setIsFiltering(true);
      router.push(newURL, { scroll: false });
    },
    [currentFilters, router]
  );

  // Filter change handlers
  const handleArrayFilterChange = useCallback(
    (filterKey: keyof FilterState, value: string) => {
      const currentValues = currentFilters[filterKey] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      // Update filters by calling updateFilters with the new values
      updateFilters({ [filterKey]: newValues });
    },
    [currentFilters, updateFilters]
  );

  const handlePriceRangeChange = useCallback(
    (newRange: [number, number]) => {
      updateFilters({ priceRange: newRange });
    },
    [updateFilters]
  );

  const handleSortChange = useCallback(
    (sortBy: string) => {
      updateFilters({ sortBy });
    },
    [updateFilters]
  );

  const handleViewModeChange = useCallback(
    (viewMode: 'grid' | 'list') => {
      updateFilters({ viewMode });
    },
    [updateFilters]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateFilters({ page });
    },
    [updateFilters]
  );

  const clearAllFilters = useCallback(() => {
    setIsFiltering(true);
    router.push(window.location.pathname, { scroll: false });
  }, [router]);

  // Listen for URL changes
  useEffect(() => {
    const handleURLChange = () => {
      setIsFiltering(false); // Clear loading when URL changes complete
    };

    window.addEventListener('popstate', handleURLChange);

    return () => {
      window.removeEventListener('popstate', handleURLChange);
    };
  }, []);

  // Clear loading state on mount and when data changes
  useEffect(() => {
    setIsFiltering(false);
  }, [initialTyres]); // Clear loading when new data arrives

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Breadcrumb */}
      <div className='bg-white border-b'>
        <div className='container mx-auto px-4 py-4'>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/'>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href='/tyres'>Tyres</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Search Results</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className='container mx-auto px-4 py-2'>
        <div className='grid lg:grid-cols-5 gap-6'>
          {/* Filters Sidebar - More Compact with Scrollable Content */}
          <div className='lg:col-span-1'>
            <div className='sticky top-4'>
              <Card className='shadow-lg'>
                {/* <CardHeader className='pb-3'>
                  <CardTitle className='flex items-center gap-2 text-base'>
                    <SlidersHorizontal className='h-4 w-4' />
                    Filters
                  </CardTitle>
                </CardHeader> */}
                <CardContent className='p-0'>
                  {/* Selected Filters Badges - Fixed at top */}
                  <div className='p-4 pb-0'>
                    <div className='bg-blue-50 p-3 rounded-lg border border-blue-100'>
                      <h3 className='font-semibold text-gray-900 mb-2 text-sm'>
                        Active Filters ({totalResults} results)
                      </h3>

                      {/* Filter Badges */}
                      <div className='flex flex-wrap gap-1 max-h-20 overflow-y-auto'>
                        {/* Price Range Badge */}
                        {(currentFilters.priceRange[0] !== 5000 ||
                          currentFilters.priceRange[1] !== 25000) && (
                          <span className='inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full'>
                            ₹{currentFilters.priceRange[0].toLocaleString()}-₹
                            {currentFilters.priceRange[1].toLocaleString()}
                            <button
                              onClick={() =>
                                handlePriceRangeChange([5000, 25000])
                              }
                              className='ml-1 text-purple-600 hover:text-purple-800'
                            >
                              ×
                            </button>
                          </span>
                        )}

                        {/* Brand Badges */}
                        {currentFilters.brands.map((brandId) => {
                          const brand = brands?.find((b) => b._id === brandId);
                          return brand ? (
                            <span
                              key={brandId}
                              className='inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full'
                            >
                              {brand.name}
                              <button
                                onClick={() =>
                                  handleArrayFilterChange('brands', brandId)
                                }
                                className='ml-1 text-blue-600 hover:text-blue-800'
                              >
                                ×
                              </button>
                            </span>
                          ) : null;
                        })}

                        {/* Tyre Width Badges */}
                        {currentFilters.tyreWidths.map((widthId) => {
                          const width = tyreWidths?.find(
                            (w) => w._id === widthId
                          );
                          return width ? (
                            <span
                              key={widthId}
                              className='inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full'
                            >
                              {width.name}mm
                              <button
                                onClick={() =>
                                  handleArrayFilterChange('tyreWidths', widthId)
                                }
                                className='ml-1 text-green-600 hover:text-green-800'
                              >
                                ×
                              </button>
                            </span>
                          ) : null;
                        })}

                        {/* Aspect Ratio Badges */}
                        {currentFilters.aspectRatios.map((ratioId) => {
                          const ratio = aspectRatios?.find(
                            (r) => r._id === ratioId
                          );
                          return ratio ? (
                            <span
                              key={ratioId}
                              className='inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full'
                            >
                              {ratio.name}%
                              <button
                                onClick={() =>
                                  handleArrayFilterChange(
                                    'aspectRatios',
                                    ratioId
                                  )
                                }
                                className='ml-1 text-yellow-600 hover:text-yellow-800'
                              >
                                ×
                              </button>
                            </span>
                          ) : null;
                        })}

                        {/* Rim Diameter Badges */}
                        {currentFilters.rimDiameters.map((rimId) => {
                          const rim = rimDiameters?.find(
                            (r) => r._id === rimId
                          );
                          return rim ? (
                            <span
                              key={rimId}
                              className='inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full'
                            >
                              {rim.name}"
                              <button
                                onClick={() =>
                                  handleArrayFilterChange('rimDiameters', rimId)
                                }
                                className='ml-1 text-indigo-600 hover:text-indigo-800'
                              >
                                ×
                              </button>
                            </span>
                          ) : null;
                        })}

                        {/* Speed Symbol Badges */}
                        {currentFilters.speedSymbols.map((speedId) => {
                          const speed = speedSymbols?.find(
                            (s) => s._id === speedId
                          );
                          return speed ? (
                            <span
                              key={speedId}
                              className='inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full'
                            >
                              {speed.name}
                              <button
                                onClick={() =>
                                  handleArrayFilterChange(
                                    'speedSymbols',
                                    speedId
                                  )
                                }
                                className='ml-1 text-red-600 hover:text-red-800'
                              >
                                ×
                              </button>
                            </span>
                          ) : null;
                        })}

                        {/* Load Index Badges */}
                        {currentFilters.loadIndexes.map((loadId) => {
                          const load = loadIndexes?.find(
                            (l) => l._id === loadId
                          );
                          return load ? (
                            <span
                              key={loadId}
                              className='inline-flex items-center px-2 py-1 bg-teal-100 text-teal-800 text-xs font-medium rounded-full'
                            >
                              Load {load.name}
                              <button
                                onClick={() =>
                                  handleArrayFilterChange('loadIndexes', loadId)
                                }
                                className='ml-1 text-teal-600 hover:text-teal-800'
                              >
                                ×
                              </button>
                            </span>
                          ) : null;
                        })}

                        {/* Ply Rating Badges */}
                        {currentFilters.plyRatings.map((plyId) => {
                          const ply = plyRatings?.find((p) => p._id === plyId);
                          return ply ? (
                            <span
                              key={plyId}
                              className='inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full'
                            >
                              {ply.name} Ply
                              <button
                                onClick={() =>
                                  handleArrayFilterChange('plyRatings', plyId)
                                }
                                className='ml-1 text-orange-600 hover:text-orange-800'
                              >
                                ×
                              </button>
                            </span>
                          ) : null;
                        })}

                        {/* Thread Pattern Badges */}
                        {currentFilters.threadPatterns.map((patternId) => {
                          const pattern = productThreadPatterns?.find(
                            (p) => p._id === patternId
                          );
                          return pattern ? (
                            <span
                              key={patternId}
                              className='inline-flex items-center px-2 py-1 bg-pink-100 text-pink-800 text-xs font-medium rounded-full'
                            >
                              {pattern.name}
                              <button
                                onClick={() =>
                                  handleArrayFilterChange(
                                    'threadPatterns',
                                    patternId
                                  )
                                }
                                className='ml-1 text-pink-600 hover:text-pink-800'
                              >
                                ×
                              </button>
                            </span>
                          ) : null;
                        })}

                        {/* Product Type Badges */}
                        {currentFilters.productTypes.map((typeId) => {
                          const type = productTypes?.find(
                            (t) => t._id === typeId
                          );
                          return type ? (
                            <span
                              key={typeId}
                              className='inline-flex items-center px-2 py-1 bg-cyan-100 text-cyan-800 text-xs font-medium rounded-full'
                            >
                              {type.name}
                              <button
                                onClick={() =>
                                  handleArrayFilterChange(
                                    'productTypes',
                                    typeId
                                  )
                                }
                                className='ml-1 text-cyan-600 hover:text-cyan-800'
                              >
                                ×
                              </button>
                            </span>
                          ) : null;
                        })}

                        {/* Show message when no filters */}
                        {currentFilters.brands.length === 0 &&
                          currentFilters.tyreWidths.length === 0 &&
                          currentFilters.aspectRatios.length === 0 &&
                          currentFilters.rimDiameters.length === 0 &&
                          currentFilters.speedSymbols.length === 0 &&
                          currentFilters.loadIndexes.length === 0 &&
                          currentFilters.plyRatings.length === 0 &&
                          currentFilters.threadPatterns.length === 0 &&
                          currentFilters.productTypes.length === 0 &&
                          currentFilters.priceRange[0] === 5000 &&
                          currentFilters.priceRange[1] === 25000 && (
                            <span className='text-xs text-gray-500 italic'>
                              No filters applied
                            </span>
                          )}
                      </div>
                    </div>
                  </div>

                  {/* Scrollable Filters Container */}
                  <div className='px-4 pb-4 max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
                    <div className='space-y-4'>
                      {/* Price Range - More Compact */}
                      <div>
                        <h3 className='font-semibold mb-2 text-sm'>
                          Price Range
                        </h3>
                        <div className='space-y-3'>
                          <Slider
                            value={currentFilters.priceRange}
                            onValueChange={handlePriceRangeChange}
                            max={30000}
                            min={5000}
                            step={1000}
                            className='w-full'
                          />
                          <div className='flex justify-between text-xs text-gray-600'>
                            <span>
                              ₹{currentFilters.priceRange[0].toLocaleString()}
                            </span>
                            <span>
                              ₹{currentFilters.priceRange[1].toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Brands - More Compact */}
                      <div>
                        <h3 className='font-semibold mb-2 text-sm'>Brands</h3>
                        <div className='space-y-1 max-h-32 overflow-y-auto'>
                          {brands &&
                            brands?.map((item) => {
                              return (
                                <div
                                  className='flex items-center space-x-2'
                                  key={item?._id}
                                >
                                  <Checkbox
                                    id={`brand-${item?._id}`}
                                    checked={currentFilters.brands.includes(
                                      item?._id
                                    )}
                                    onCheckedChange={() =>
                                      handleArrayFilterChange(
                                        'brands',
                                        item?._id
                                      )
                                    }
                                    className='h-3 w-3'
                                  />
                                  <label
                                    htmlFor={`brand-${item?._id}`}
                                    className='text-xs font-medium cursor-pointer'
                                  >
                                    {item?.name}
                                  </label>
                                </div>
                              );
                            })}
                        </div>
                      </div>

                      {/* Tyre Width - More Compact */}
                      {tyreWidths && tyreWidths.length > 0 && (
                        <div>
                          <h3 className='font-semibold mb-2 text-sm'>
                            Tyre Width
                          </h3>
                          <div className='space-y-1 max-h-32 overflow-y-auto'>
                            {tyreWidths.map((item) => (
                              <div
                                className='flex items-center space-x-2'
                                key={item?._id}
                              >
                                <Checkbox
                                  id={`width-${item?._id}`}
                                  checked={currentFilters.tyreWidths.includes(
                                    item?._id
                                  )}
                                  onCheckedChange={() =>
                                    handleArrayFilterChange(
                                      'tyreWidths',
                                      item?._id
                                    )
                                  }
                                  className='h-3 w-3'
                                />
                                <label
                                  htmlFor={`width-${item?._id}`}
                                  className='text-xs font-medium cursor-pointer'
                                >
                                  {item?.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Aspect Ratio - More Compact */}
                      {aspectRatios && aspectRatios.length > 0 && (
                        <div>
                          <h3 className='font-semibold mb-2 text-sm'>
                            Aspect Ratio
                          </h3>
                          <div className='space-y-1 max-h-32 overflow-y-auto'>
                            {aspectRatios.map((item) => (
                              <div
                                className='flex items-center space-x-2'
                                key={item?._id}
                              >
                                <Checkbox
                                  id={`ratio-${item?._id}`}
                                  checked={currentFilters.aspectRatios.includes(
                                    item?._id
                                  )}
                                  onCheckedChange={() =>
                                    handleArrayFilterChange(
                                      'aspectRatios',
                                      item?._id
                                    )
                                  }
                                  className='h-3 w-3'
                                />
                                <label
                                  htmlFor={`ratio-${item?._id}`}
                                  className='text-xs font-medium cursor-pointer'
                                >
                                  {item?.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Rim Diameter */}
                      {rimDiameters && rimDiameters.length > 0 && (
                        <div>
                          <h3 className='font-semibold mb-2 text-sm'>
                            Rim Diameter
                          </h3>
                          <div className='space-y-1 max-h-32 overflow-y-auto'>
                            {rimDiameters.map((item) => (
                              <div
                                className='flex items-center space-x-2'
                                key={item?._id}
                              >
                                <Checkbox
                                  id={`rim-${item?._id}`}
                                  checked={currentFilters.rimDiameters.includes(
                                    item?._id
                                  )}
                                  onCheckedChange={() =>
                                    handleArrayFilterChange(
                                      'rimDiameters',
                                      item?._id
                                    )
                                  }
                                  className='h-3 w-3'
                                />
                                <label
                                  htmlFor={`rim-${item?._id}`}
                                  className='text-xs font-medium cursor-pointer'
                                >
                                  {item?.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Speed Symbols */}
                      {speedSymbols && speedSymbols.length > 0 && (
                        <div>
                          <h3 className='font-semibold mb-2 text-sm'>
                            Speed Rating
                          </h3>
                          <div className='space-y-1 max-h-32 overflow-y-auto'>
                            {speedSymbols.map((item) => (
                              <div
                                className='flex items-center space-x-2'
                                key={item?._id}
                              >
                                <Checkbox
                                  id={`speed-${item?._id}`}
                                  checked={currentFilters.speedSymbols.includes(
                                    item?._id
                                  )}
                                  onCheckedChange={() =>
                                    handleArrayFilterChange(
                                      'speedSymbols',
                                      item?._id
                                    )
                                  }
                                  className='h-3 w-3'
                                />
                                <label
                                  htmlFor={`speed-${item?._id}`}
                                  className='text-xs font-medium cursor-pointer'
                                >
                                  {item?.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Load Index */}
                      {loadIndexes && loadIndexes.length > 0 && (
                        <div>
                          <h3 className='font-semibold mb-2 text-sm'>
                            Load Index
                          </h3>
                          <div className='space-y-1 max-h-32 overflow-y-auto'>
                            {loadIndexes.map((item) => (
                              <div
                                className='flex items-center space-x-2'
                                key={item?._id}
                              >
                                <Checkbox
                                  id={`load-${item?._id}`}
                                  checked={currentFilters.loadIndexes.includes(
                                    item?._id
                                  )}
                                  onCheckedChange={() =>
                                    handleArrayFilterChange(
                                      'loadIndexes',
                                      item?._id
                                    )
                                  }
                                  className='h-3 w-3'
                                />
                                <label
                                  htmlFor={`load-${item?._id}`}
                                  className='text-xs font-medium cursor-pointer'
                                >
                                  {item?.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Ply Rating */}
                      {plyRatings && plyRatings.length > 0 && (
                        <div>
                          <h3 className='font-semibold mb-2 text-sm'>
                            Ply Rating
                          </h3>
                          <div className='space-y-1 max-h-32 overflow-y-auto'>
                            {plyRatings.map((item) => (
                              <div
                                className='flex items-center space-x-2'
                                key={item?._id}
                              >
                                <Checkbox
                                  id={`ply-${item?._id}`}
                                  checked={currentFilters.plyRatings.includes(
                                    item?._id
                                  )}
                                  onCheckedChange={() =>
                                    handleArrayFilterChange(
                                      'plyRatings',
                                      item?._id
                                    )
                                  }
                                  className='h-3 w-3'
                                />
                                <label
                                  htmlFor={`ply-${item?._id}`}
                                  className='text-xs font-medium cursor-pointer'
                                >
                                  {item?.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Product Thread Patterns */}
                      {productThreadPatterns &&
                        productThreadPatterns.length > 0 && (
                          <div>
                            <h3 className='font-semibold mb-2 text-sm'>
                              Thread Pattern
                            </h3>
                            <div className='space-y-1 max-h-32 overflow-y-auto'>
                              {productThreadPatterns.map((item) => (
                                <div
                                  className='flex items-center space-x-2'
                                  key={item?._id}
                                >
                                  <Checkbox
                                    id={`pattern-${item?._id}`}
                                    checked={currentFilters.threadPatterns.includes(
                                      item?._id
                                    )}
                                    onCheckedChange={() =>
                                      handleArrayFilterChange(
                                        'threadPatterns',
                                        item?._id
                                      )
                                    }
                                    className='h-3 w-3'
                                  />
                                  <label
                                    htmlFor={`pattern-${item?._id}`}
                                    className='text-xs font-medium cursor-pointer'
                                  >
                                    {item?.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Product Types */}
                      {productTypes && productTypes.length > 0 && (
                        <div>
                          <h3 className='font-semibold mb-2 text-sm'>
                            Product Type
                          </h3>
                          <div className='space-y-1 max-h-32 overflow-y-auto'>
                            {productTypes.map((item) => (
                              <div
                                className='flex items-center space-x-2'
                                key={item?._id}
                              >
                                <Checkbox
                                  id={`type-${item?._id}`}
                                  checked={currentFilters.productTypes.includes(
                                    item?._id
                                  )}
                                  onCheckedChange={() =>
                                    handleArrayFilterChange(
                                      'productTypes',
                                      item?._id
                                    )
                                  }
                                  className='h-3 w-3'
                                />
                                <label
                                  htmlFor={`type-${item?._id}`}
                                  className='text-xs font-medium cursor-pointer'
                                >
                                  {item?.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Clear Filters - Fixed at bottom */}
                  <div className='p-4 pt-0 border-t border-gray-100'>
                    <Button
                      variant='outline'
                      className='w-full bg-transparent text-xs py-2'
                      onClick={clearAllFilters}
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content - More Space */}
          <div className='lg:col-span-4'>
            {/* Loading Spinner */}
            {isFiltering && (
              <div className='fixed top-4 left-1/2 transform -translate-x-1/2 z-50'>
                <div className='bg-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2 border'>
                  <Loader2 className='h-4 w-4 animate-spin text-blue-600' />
                  <span className='text-sm font-medium text-gray-700'>
                    Updating results...
                  </span>
                </div>
              </div>
            )}

            {/* Header with Sort and View Options */}
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
              <div>
                <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>
                  Search Results
                </h1>
                <p className='text-gray-600 mt-1'>
                  Showing {currentTyres.length} of {totalResults} results for
                  "Car Tyres"
                </p>
              </div>

              <div className='flex items-center gap-4'>
                {/* Sort By */}
                <div className='flex items-center gap-2'>
                  <span className='text-sm font-medium'>Sort by:</span>
                  <Select
                    value={currentFilters.sortBy}
                    onValueChange={handleSortChange}
                  >
                    <SelectTrigger className='w-[180px]'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='popularity'>Popularity</SelectItem>
                      <SelectItem value='price-low'>
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value='price-high'>
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value='rating'>Customer Rating</SelectItem>
                      <SelectItem value='newest'>Newest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* View Mode */}
                <div className='flex items-center border rounded-lg'>
                  <Button
                    variant={
                      currentFilters.viewMode === 'grid' ? 'default' : 'ghost'
                    }
                    size='sm'
                    onClick={() => handleViewModeChange('grid')}
                    className='rounded-r-none'
                  >
                    <Grid className='h-4 w-4' />
                  </Button>
                  <Button
                    variant={
                      currentFilters.viewMode === 'list' ? 'default' : 'ghost'
                    }
                    size='sm'
                    onClick={() => handleViewModeChange('list')}
                    className='rounded-l-none'
                  >
                    <List className='h-4 w-4' />
                  </Button>
                </div>

                {/* Mobile Filter */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant='outline'
                      size='sm'
                      className='lg:hidden bg-transparent'
                    >
                      <Filter className='h-4 w-4 mr-2' />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side='left'>
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                      <SheetDescription>
                        Filter tyres by your preferences
                      </SheetDescription>
                    </SheetHeader>
                    <div className='mt-6 space-y-6'>
                      {/* Price Range */}
                      <div>
                        <h3 className='font-semibold mb-3'>Price Range</h3>
                        <Slider
                          value={currentFilters.priceRange}
                          onValueChange={handlePriceRangeChange}
                          max={30000}
                          min={5000}
                          step={1000}
                          className='w-full'
                        />
                        <div className='flex justify-between text-sm text-gray-600 mt-2'>
                          <span>
                            ₹{currentFilters.priceRange[0].toLocaleString()}
                          </span>
                          <span>
                            ₹{currentFilters.priceRange[1].toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Brands */}
                      <div>
                        <h3 className='font-semibold mb-3'>Brands</h3>
                        <div className='space-y-2 max-h-32 overflow-y-auto'>
                          {brands?.map((item) => (
                            <div
                              className='flex items-center space-x-2'
                              key={item?._id}
                            >
                              <Checkbox
                                id={`mobile-brand-${item?._id}`}
                                checked={currentFilters.brands.includes(
                                  item?._id
                                )}
                                onCheckedChange={() =>
                                  handleArrayFilterChange('brands', item?._id)
                                }
                              />
                              <label
                                htmlFor={`mobile-brand-${item?._id}`}
                                className='text-sm font-medium cursor-pointer'
                              >
                                {item?.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Categories */}
                      <div>
                        <h3 className='font-semibold mb-3'>Category</h3>
                        <div className='space-y-2'>
                          {[
                            'CAR Tyre',
                            'TRUCK Tyre',
                            'BIKE Tyre',
                            'SCOOTER Tyre',
                          ].map((category) => (
                            <div
                              className='flex items-center space-x-2'
                              key={category}
                            >
                              <Checkbox
                                id={`mobile-category-${category}`}
                                checked={currentFilters.categories.includes(
                                  category
                                )}
                                onCheckedChange={() =>
                                  handleArrayFilterChange(
                                    'categories',
                                    category
                                  )
                                }
                              />
                              <label
                                htmlFor={`mobile-category-${category}`}
                                className='text-sm font-medium cursor-pointer'
                              >
                                {category}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Clear Filters */}
                      <Button
                        variant='outline'
                        className='w-full'
                        onClick={clearAllFilters}
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Products Grid */}
            <div className='relative'>
              {/* Subtle loading overlay */}
              {isFiltering && (
                <div className='absolute inset-0 bg-white/50 backdrop-blur-[0.5px] z-10 flex items-center justify-center'>
                  <div className='bg-white shadow-lg rounded-lg px-4 py-2 flex items-center gap-2 border'>
                    <Loader2 className='h-4 w-4 animate-spin text-blue-600' />
                    <span className='text-sm font-medium text-gray-700'>
                      Loading...
                    </span>
                  </div>
                </div>
              )}

              {currentFilters.viewMode === 'grid' ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
                  {isFiltering ? (
                    <div className='col-span-full text-center py-12'>
                      <div className='flex items-center justify-center gap-2'>
                        <Loader2 className='h-6 w-6 animate-spin text-blue-600' />
                        <p className='text-gray-500 text-lg'>
                          Loading results...
                        </p>
                      </div>
                    </div>
                  ) : currentTyres.length > 0 ? (
                    currentTyres?.map((tyre) => {
                      return (
                        <Card
                          className='group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:border-gray-300 transition-colors duration-200'
                          key={tyre?._id}
                        >
                          {/* Image Section - Wider aspect ratio */}
                          <div className='relative aspect-[4/3] bg-gray-50'>
                            <Link
                              href={`/product/${tyre?._id}`}
                              className='block w-full h-full'
                            >
                              <Image
                                src={getImageUrl(tyre?.productImages?.[0])}
                                alt={`${tyre?.productBrand?.name} ${tyre?.tyreWidth?.name}/${tyre?.aspectRatio?.name}${tyre?.construction}${tyre?.rimDiameter?.name} Tyre`}
                                width={320}
                                height={240}
                                className='w-full h-full object-contain p-2'
                              />
                            </Link>
                            <div className='absolute top-2 right-2'>
                              <span className='inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full'>
                                In Stock
                              </span>
                            </div>
                          </div>

                          {/* Content Section - Compact & Clean */}
                          <div className='p-4 space-y-3'>
                            {/* Brand & Title */}
                            <div>
                              <p className='text-xs text-gray-500 font-medium mb-1'>
                                {tyre?.productBrand?.name}
                              </p>
                              <h3 className='font-semibold text-sm text-gray-900 leading-tight'>
                                {tyre?.tyreWidth?.name}/
                                {tyre?.aspectRatio?.name}
                                {tyre?.construction}
                                {tyre?.rimDiameter?.name}
                                {' '}
                                {tyre?.plyRating?.name}
                                {' '}
                                {tyre?.loadIndex?.name}
                                {' '}
                                {tyre?.speedSymbol?.name}
                                {' '}
                                {tyre?.productThreadPattern?.name}
                                {' '}
                                {tyre?.unit}
                              </h3>
                            </div>

                            {/* Specifications Grid */}
                            <div className='grid grid-cols-2 gap-x-3 gap-y-1 text-xs'>
                              <div className='flex justify-between'>
                                <span className='text-gray-500'>Load:</span>
                                <span className='font-medium text-gray-700'>
                                  {tyre?.loadIndex?.name || 'N/A'}
                                </span>
                              </div>
                              <div className='flex justify-between'>
                                <span className='text-gray-500'>Speed:</span>
                                <span className='font-medium text-gray-700'>
                                  {tyre?.speedSymbol?.name || 'N/A'}
                                </span>
                              </div>
                              <div className='flex justify-between'>
                                <span className='text-gray-500'>Type:</span>
                                <span className='font-medium text-gray-700'>
                                  {tyre?.construction === 'R'
                                    ? 'Radial'
                                    : tyre?.construction === 'D'
                                    ? 'Diagonal'
                                    : tyre?.construction || 'N/A'}
                                </span>
                              </div>
                              <div className='flex justify-between'>
                                <span className='text-gray-500'>Category:</span>
                                <span className='font-medium text-gray-700'>
                                  {tyre?.broadCategory || 'N/A'}
                                </span>
                              </div>
                            </div>

                            {/* Features */}
                            <div className='flex flex-wrap gap-1.5'>
                              {tyre?.warranty === 'YES' && (
                                <span className='inline-flex items-center px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded'>
                                  Warranty
                                </span>
                              )}
                              {tyre?.productType?.name && (
                                <span className='inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded'>
                                  {tyre?.productType?.name}
                                </span>
                              )}
                            </div>

                            {/* Action Button */}
                            <Link href={`/product/${tyre?._id}`}>
                              <button className='w-full mt-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors duration-200'>
                                View Details
                              </button>
                            </Link>
                          </div>
                        </Card>
                      );
                    })
                  ) : (
                    <div className='col-span-full text-center py-12'>
                      <p className='text-gray-500 text-lg'>
                        No tyres found matching your filters.
                      </p>
                      <Button onClick={clearAllFilters} className='mt-4'>
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                /* List View */
                <div className='space-y-4'>
                  {isFiltering ? (
                    <div className='text-center py-12'>
                      <div className='flex items-center justify-center gap-2'>
                        <Loader2 className='h-6 w-6 animate-spin text-blue-600' />
                        <p className='text-gray-500 text-lg'>
                          Loading results...
                        </p>
                      </div>
                    </div>
                  ) : currentTyres.length > 0 ? (
                    currentTyres?.map((tyre) => {
                      console.log('tyre', tyre);
                      return (
                        <Card
                          className='group hover:shadow-lg transition-shadow'
                          key={tyre?._id}
                        >
                          <CardContent className='p-6'>
                            <div className='grid md:grid-cols-4 gap-6 items-center'>
                              <div className='relative'>
                                <Link href={`/product/${tyre?._id}`}>
                                  <Image
                                    src={getImageUrl(tyre?.productImages?.[0])}
                                    alt={`${tyre?.productBrand?.name} ${tyre?.tyreWidth?.name}/${tyre?.aspectRatio?.name}${tyre?.construction}${tyre?.rimDiameter?.name} Tyre`}
                                    width={200}
                                    height={200}
                                    className='w-full h-32 object-contain rounded-lg'
                                  />
                                </Link>
                                <Badge className='absolute top-2 right-2 bg-green-500'>
                                  In Stock
                                </Badge>
                              </div>

                              <div className='md:col-span-2'>
                                <div className='mb-2'>
                                  <Badge variant='outline' className='text-xs'>
                                    {tyre?.productBrand?.name}
                                  </Badge>
                                </div>
                                <h3 className='text-xl font-semibold mb-2'>
                                  {tyre?.productBrand?.name}{' '}
                                  {tyre?.tyreWidth?.name}/
                                  {tyre?.aspectRatio?.name}
                                  {tyre?.construction}
                                  {tyre?.rimDiameter?.name}
                                  {' '}
                                  {tyre?.plyRating?.name}
                                  {' '}
                                  {tyre?.loadIndex?.name}
                                  {' '}
                                  {tyre?.speedSymbol?.name}
                                  {' '}
                                  {tyre?.productThreadPattern?.name}
                                  {' '}
                                  {tyre?.unit}
                                </h3>
                                <p className='text-sm text-muted-foreground mb-2'>
                                  {tyre?.tyreWidth?.name}/
                                  {tyre?.aspectRatio?.name}
                                  {tyre?.construction}
                                  {tyre?.rimDiameter?.name}
                                </p>

                                <p className='text-sm text-gray-600 mb-3'>
                                  {tyre?.productType?.name} -{' '}
                                  {tyre?.broadCategory} with{' '}
                                  {tyre?.warranty === 'YES'
                                    ? 'warranty'
                                    : 'no warranty'}
                                </p>

                                <div className='flex flex-wrap gap-1'>
                                  <Badge
                                    variant='secondary'
                                    className='text-xs'
                                  >
                                    {tyre?.productType?.name}
                                  </Badge>
                                  <Badge
                                    variant='secondary'
                                    className='text-xs'
                                  >
                                    {tyre?.broadCategory}
                                  </Badge>
                                  <Badge
                                    variant='secondary'
                                    className='text-xs'
                                  >
                                    {tyre?.speedSymbol?.name} Speed
                                  </Badge>
                                </div>
                              </div>

                              <div className='text-right'>
                                <div className='mb-4'>
                                  <div className='text-sm text-gray-600 mb-2'>
                                    Load: {tyre?.loadIndex?.name} | Speed:{' '}
                                    {tyre?.speedSymbol?.name}
                                  </div>
                                  {/* Uncomment when price data is available
                                <div className='text-2xl font-bold text-primary'>
                                  ₹15,999
                                </div>
                                <div className='text-sm text-muted-foreground line-through'>
                                  ₹18,999
                                </div>
                                <Badge className='bg-red-500 mt-1'>
                                  Save ₹3,000
                                </Badge>
                                */}
                                </div>

                                <div className='space-y-2'>
                                  <Button className='w-full' size='sm' asChild>
                                    <Link href={`/product/${tyre?._id}`}>
                                      View Details
                                    </Link>
                                  </Button>
                                  <Button
                                    variant='outline'
                                    className='w-full bg-transparent'
                                    size='sm'
                                  >
                                    Compare
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  ) : (
                    <div className='text-center py-12'>
                      <p className='text-gray-500 text-lg'>
                        No tyres found matching your filters.
                      </p>
                      <Button onClick={clearAllFilters} className='mt-4'>
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className='flex items-center justify-between mt-8'>
              <div className='text-sm text-gray-600'>
                Showing {currentTyres.length} of {totalResults} results
              </div>

              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() =>
                    handlePageChange(Math.max(1, currentFilters.page - 1))
                  }
                  disabled={currentFilters.page === 1}
                >
                  <ChevronLeft className='h-4 w-4' />
                  Previous
                </Button>

                <div className='flex items-center gap-1'>
                  <Button
                    variant={currentFilters.page === 1 ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => handlePageChange(1)}
                    className='w-10'
                  >
                    1
                  </Button>
                  {totalPages > 1 && (
                    <Button
                      variant={
                        currentFilters.page === 2 ? 'default' : 'outline'
                      }
                      size='sm'
                      onClick={() => handlePageChange(2)}
                      className='w-10'
                    >
                      2
                    </Button>
                  )}
                </div>

                <Button
                  variant='outline'
                  size='sm'
                  onClick={() =>
                    handlePageChange(
                      Math.min(totalPages, currentFilters.page + 1)
                    )
                  }
                  disabled={currentFilters.page === totalPages}
                >
                  Next
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
