import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Search } from 'lucide-react';
import { INamedComponents } from './types';
import qs from 'qs';

export default function TyreSearchSection({
  tyreWidths,
  aspectRatios,
  rimDiameters,
}: {
  tyreWidths: INamedComponents[];
  aspectRatios: INamedComponents[];
  rimDiameters: INamedComponents[];
}) {
  const router = useRouter();

  // State for selected values
  const [selectedTyreWidth, setSelectedTyreWidth] = useState('');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('');
  const [selectedRimDiameter, setSelectedRimDiameter] = useState('');

  // Handle search functionality
  const handleSearch = () => {
    const filters: Record<string, any> = {};

    // Add selected filters to the query object
    if (selectedTyreWidth) {
      filters.tyreWidths = [selectedTyreWidth];
    }
    if (selectedAspectRatio) {
      filters.aspectRatios = [selectedAspectRatio];
    }
    if (selectedRimDiameter) {
      filters.rimDiameters = [selectedRimDiameter];
    }

    // Only proceed if at least one filter is selected
    if (Object.keys(filters).length > 0) {
      const queryString = qs.stringify(filters, {
        encode: false,
        arrayFormat: 'comma',
        skipNulls: true,
      });

      // Redirect to search page with filters
      router.push(`/search?${queryString}`);
    }
  };

  // Handle Enter key press on any select element
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };
  return (
    <div className='w-full'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'>
        {/* Search By Tyre Size */}
        <div className='lg:col-span-3 space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6'>
            <div className='space-y-2'>
              <label className='block text-sm font-semibold text-brand-black'>
                Tyre Width (mm)
              </label>
              <select
                className='w-full p-4 bg-white border-2 border-brand-light-gray rounded-xl text-brand-black appearance-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all font-medium shadow-lg'
                value={selectedTyreWidth}
                onChange={(e) => setSelectedTyreWidth(e.target.value)}
                onKeyPress={handleKeyPress}
              >
                <option value=''>Select Width</option>
                {tyreWidths &&
                  tyreWidths?.map((item) => {
                    return (
                      <option value={item?._id} key={item?._id}>
                        {item?.name}
                      </option>
                    );
                  })}
              </select>
            </div>

            <div className='space-y-2'>
              <label className='block text-sm font-semibold text-brand-black'>
                Aspect Ratio
              </label>
              <select
                className='w-full p-4 bg-white border-2 border-brand-light-gray rounded-xl text-brand-black appearance-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all font-medium shadow-lg'
                value={selectedAspectRatio}
                onChange={(e) => setSelectedAspectRatio(e.target.value)}
                onKeyPress={handleKeyPress}
              >
                <option value=''>Select Ratio</option>
                {aspectRatios &&
                  aspectRatios?.map((item) => {
                    return (
                      <option value={item?._id} key={item?._id}>
                        {item?.name}
                      </option>
                    );
                  })}
              </select>
            </div>

            <div className='space-y-2'>
              <label className='block text-sm font-semibold text-brand-black'>
                Rim Diameter (inch)
              </label>
              <select
                className='w-full p-4 bg-white border-2 border-brand-light-gray rounded-xl text-brand-black appearance-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all font-medium shadow-lg'
                value={selectedRimDiameter}
                onChange={(e) => setSelectedRimDiameter(e.target.value)}
                onKeyPress={handleKeyPress}
              >
                <option value=''>Select Diameter</option>
                {rimDiameters &&
                  rimDiameters?.map((item) => {
                    return (
                      <option value={item?._id} key={item?._id}>
                        {item?.name}
                      </option>
                    );
                  })}
              </select>
            </div>

            <div className='space-y-2'>
              <label className='block text-sm font-semibold text-brand-black'>
                Search Now
              </label>
              <Button
                className={`w-full h-14 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg font-semibold text-lg ${
                  selectedTyreWidth ||
                  selectedAspectRatio ||
                  selectedRimDiameter
                    ? 'gradient-accent hover:opacity-90 text-black'
                    : 'bg-gray-300 hover:bg-gray-400 text-gray-600 cursor-not-allowed'
                }`}
                onClick={handleSearch}
                disabled={
                  !selectedTyreWidth &&
                  !selectedAspectRatio &&
                  !selectedRimDiameter
                }
              >
                <Search className='h-5 w-5' />
                {selectedTyreWidth || selectedAspectRatio || selectedRimDiameter
                  ? 'Search Tyres'
                  : 'Select Filters'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
