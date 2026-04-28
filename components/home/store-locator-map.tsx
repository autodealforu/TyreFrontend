'use client';

import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet';
import { MapPin, Store, Info, Loader2, Phone, Compass, ExternalLink, Globe, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface StoreStats {
  [key: string]: number;
}

const StoreLocatorMap = () => {
  const [geoData, setGeoData] = useState<any>(null);
  const [storeStats, setStoreStats] = useState<StoreStats>({});
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [stateVendors, setStateVendors] = useState<any[]>([]);
  const [vendorsLoading, setVendorsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const statsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/vendors/stats/by-state`);
        const normalizedStats: StoreStats = {};
        Object.keys(statsRes.data).forEach(state => {
          normalizedStats[state.toUpperCase().trim()] = statsRes.data[state];
        });
        setStoreStats(normalizedStats);

        const geoRes = await fetch('/india_states_simplified.geojson');
        const data = await geoRes.json();
        setGeoData(data);
      } catch (error) {
        console.error('Error fetching map data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const project = (coords: [number, number]) => {
    const [lon, lat] = coords;
    const x = (lon - 68) * 26;
    const y = (38 - lat) * 26;
    return [x, y];
  };

  const mapPaths = useMemo(() => {
    if (!geoData) return [];
    return geoData.features.map((feature: any, idx: number) => {
      const stateName = feature.properties.NAME_1 || feature.properties.name || "Unknown";
      const normName = stateName.toUpperCase().trim();
      const storeCount = storeStats[normName] || 0;

      let d = '';
      const processCoords = (coords: any[]) => {
        coords.forEach((coord: [number, number], i: number) => {
          const [x, y] = project(coord);
          d += i === 0 ? `M ${x} ${y} ` : `L ${x} ${y} `;
        });
        d += 'Z ';
      };

      if (feature.geometry.type === 'Polygon') {
        feature.geometry.coordinates.forEach(processCoords);
      } else if (feature.geometry.type === 'MultiPolygon') {
        feature.geometry.coordinates.forEach((multiPoly: any) => {
          multiPoly.forEach(processCoords);
        });
      }

      return {
        id: idx,
        name: stateName,
        normName,
        path: d,
        count: storeCount,
      };
    });
  }, [geoData, storeStats]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200 mx-4 md:mx-20">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-[#fca311]/20"></div>
          <Loader2 className="w-16 h-16 text-[#fca311] animate-spin relative" />
        </div>
        <p className="mt-8 text-slate-500 font-bold text-xl animate-pulse">Initializing Store Map...</p>
      </div>
    );
  }

  const handleStateClick = async (stateName: string) => {
    setSelectedState(stateName);
    setIsSheetOpen(true);

    try {
      setVendorsLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/vendors`, {
        params: {
          'search[vendor.pickup_address.state]': stateName.trim()
        }
      });
      setStateVendors(response.data.vendors || []);
    } catch (error) {
      console.error('Error fetching vendors for state:', error);
      setStateVendors([]);
    } finally {
      setVendorsLoading(false);
    }
  };

  return (
    <section className="py-10 mb-15 bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-linear-to-br from-[#fca311]/5 to-transparent rounded-full blur-3xl -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-linear-to-tr from-[#14213d]/5 to-transparent rounded-full blur-3xl -ml-20 -mb-20"></div>

      <div className="container mx-auto px-4 md:px-20 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-px w-12 bg-[#fca311]"></div>
              <span className="text-[#fca311] font-bold uppercase tracking-[0.3em] text-sm">Nationwide Presence</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight text-slate-900">
              Find Your Nearest <span className="text-transparent bg-clip-text bg-linear-to-r from-[#14213d] to-[#fca311]">Premium Experience</span>
            </h2>
            <p className="text-2xl text-slate-500 font-medium leading-relaxed">
              Explore our extensive network of authorized stores. Click a state to discover premium tyre solutions in your region.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 bg-white shadow-xl shadow-slate-200/50 p-4 rounded-4xl border border-slate-100">
            <div className="flex items-center gap-3 px-4 py-2 bg-[#fca311] rounded-2xl text-white shadow-lg shadow-[#fca311]/30">
              <Store className="w-5 h-5" />
              <span className="font-bold">Active Outlets</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-2xl text-slate-600">
              <Globe className="w-5 h-5 opacity-50" />
              <span className="font-bold">Other Regions</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-stretch">
          {/* Map Container */}
          <div className="lg:col-span-8 bg-[#f8fafc] dark:bg-slate-900/50 rounded-[3.5rem] p-6 md:p-12 border border-slate-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05),0_30px_60px_-15px_rgba(0,0,0,0.1)] relative group overflow-hidden">
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#14213d_1px,transparent_1px)] bg-size-[20px_20px]"></div>

            <svg
              viewBox="0 0 800 850"
              className="w-full h-auto max-h-[800px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-transform duration-1000 ease-in-out"
              style={{ transform: hoveredState ? 'scale(1.02)' : 'scale(1)' }}
            >
              <defs>
                <linearGradient id="stateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#14213d', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#2b457a', stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#fca311', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#ffbb4d', stopOpacity: 1 }} />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <g>
                {mapPaths.map((state: any) => {
                  const isActive = state.count > 0;
                  const isSelected = selectedState === state.name;
                  const isHovered = hoveredState === state.name;

                  return (
                    <path
                      key={state.id}
                      d={state.path}
                      className="transition-all duration-300 cursor-pointer ease-in-out"
                      fill={
                        isSelected || (isActive && isHovered)
                          ? 'url(#activeGradient)'
                          : isActive
                            ? 'url(#stateGradient)'
                            : '#cbd5e1'
                      }
                      stroke={isSelected ? '#fff' : isActive ? '#ffffff40' : '#94a3b8'}
                      strokeWidth={isSelected ? 3 : isActive ? 1.5 : 0.8}
                      filter={isSelected ? 'url(#glow)' : 'none'}
                      style={{
                        transform: isSelected ? 'translateY(-2px)' : 'none',
                      }}
                      onClick={() => handleStateClick(state.name)}
                      onMouseEnter={() => setHoveredState(state.name)}
                      onMouseLeave={() => setHoveredState(null)}
                    >
                      <title>{`${state.name}: ${state.count} Stores`}</title>
                    </path>
                  );
                })}
              </g>
            </svg>

            {/* Hover Tooltip Overlay (Small Label) */}
            {hoveredState && (
              <div
                className="absolute top-10 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xl px-8 py-4 rounded-3xl border border-slate-200 shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <div className="w-3 h-3 rounded-full bg-[#fca311] shadow-[0_0_10px_#fca311]"></div>
                <div className="flex flex-col">
                  <span className="font-black text-slate-900 text-lg">{hoveredState}</span>
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                    {mapPaths.find((p: { name: string; }) => p.name === hoveredState)?.count || 0} Authorized Stores
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Info Side Area */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card className="flex-1 bg-white border-slate-100 shadow-[0_20px_40px_rgba(0,0,0,0.05)] rounded-[3rem] overflow-hidden group hover:shadow-[0_30px_60px_rgba(252,163,17,0.15)] transition-all duration-500">
              <CardContent className="p-12 relative flex flex-col h-full">
                <div className="w-20 h-20 bg-[#fca311]/10 rounded-3xl flex items-center justify-center mb-10 group-hover:rotate-12 transition-transform duration-500">
                  <Sparkles className="w-10 h-10 text-[#fca311]" />
                </div>
                <h3 className="text-4xl font-black mb-6 text-slate-900 leading-tight tracking-tight">Beyond Excellence</h3>
                <p className="text-xl text-slate-500 leading-relaxed font-medium mb-10">
                  "Our verified stores are standard-bearers of quality, offering precision alignment and multi-brand options."
                </p>
                <div className="mt-auto flex flex-wrap gap-3">
                  {['ISO Certified', '24h Support', 'Genuine Stock'].map(tag => (
                    <Badge key={tag} variant="outline" className="px-5 py-2 border-slate-200 text-slate-600 font-bold rounded-full text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="p-10 bg-[#14213d] rounded-[3rem] text-white shadow-2xl shadow-[#14213d]/30 relative overflow-hidden group border-4 border-[#14213d]">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#fca311]/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4 text-[#fca311]">
                  <Store className="w-6 h-6" />
                  <span className="font-black uppercase tracking-widest text-xs">Cumulative Strength</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-8xl font-black text-white tracking-tighter">
                    {Object.values(storeStats).reduce((a, b) => a + b, 0)}
                  </span>
                  <span className="text-4xl font-bold text-[#fca311]">+</span>
                </div>
                <p className="text-slate-300 font-bold text-lg mt-4 leading-relaxed">
                  Premium stores actively serving customers nationwide with top-tier technology.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={(open) => { setIsSheetOpen(open); if (!open) setSelectedState(null); }}>
        <SheetContent side="right" className="w-full sm:w-[650px] p-0 border-l-0 shadow-2xl bg-white flex flex-col rounded-l-[3.5rem]">
          {/* Header Section */}
          <div className="min-h-[300px] bg-[#14213d] relative p-12 flex flex-col justify-end overflow-hidden">
            <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-[#fca311] rounded-full blur-[80px] opacity-40 animate-pulse"></div>

            <Badge className="bg-[#fca311] text-[#14213d] w-fit mb-6 font-black py-2.5 px-8 rounded-full text-xs shadow-2xl shadow-[#fca311]/30 border-none">
              {selectedState ? storeStats[selectedState.toUpperCase()] || 0 : 0} ACTIVE OUTLETS
            </Badge>
            <h2 className="text-6xl font-black text-white tracking-tighter mb-2 italic underline decoration-[#fca311] decoration-8 underline-offset-12">
              {selectedState}
            </h2>
            <p className="text-white/60 font-black ml-1 uppercase tracking-[0.2em] text-xs mt-4">Official Authorized Zone</p>
          </div>

          <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
            <div className="space-y-12">
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-[#fca311]/10 rounded-2xl flex items-center justify-center text-[#fca311] shadow-inner">
                    <Store className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Authorized Stores</h3>
                </div>

                {vendorsLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <Loader2 className="w-10 h-10 text-[#fca311] animate-spin" />
                    <p className="text-slate-500 font-bold">Scanning for authorized stores...</p>
                  </div>
                ) : stateVendors.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {stateVendors.map((vendor, i) => {
                      const address = vendor.vendor?.pickup_address?.[0];
                      const fullAddress = address
                        ? `${address.address_1}${address.address_2 ? `, ${address.address_2}` : ''}, ${address.city}, ${address.state} - ${address.pin}`
                        : 'Address not available';

                      return (
                        <Card key={i} className="rounded-[2.5rem] bg-slate-50 border border-slate-100 group hover:border-[#fca311]/50 transition-all hover:bg-white hover:shadow-2xl overflow-hidden">
                          <CardContent className="p-8 flex flex-col gap-6">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-4">
                                <div className="p-4 bg-white rounded-2xl shadow-md text-[#fca311] group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                  <Store className="w-6 h-6" />
                                </div>
                                <div>
                                  <h4 className="font-black text-slate-900 text-xl mb-1">{vendor.vendor?.store_name || vendor.name}</h4>
                                  <Badge className="bg-green-500/10 text-green-600 border-none px-3 py-1 text-[10px] font-black uppercase">Verified Partner</Badge>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 text-slate-500">
                              <MapPin className="w-5 h-5 mt-1 shrink-0 text-[#fca311]" />
                              <p className="text-sm font-bold leading-relaxed">
                                {fullAddress}
                                {address?.landmark && (
                                  <span className="block text-xs mt-1 text-slate-400 italic">Near {address.landmark}</span>
                                )}
                              </p>
                            </div>

                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-10 rounded-[2.5rem] bg-slate-50 border-2 border-dashed border-slate-200 text-center">
                    <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h4 className="text-xl font-black text-slate-900 mb-2">Expanding Soon</h4>
                    <p className="text-slate-500 font-bold text-sm">We currently don't have listed stores in {selectedState}, but we're expanding rapidly. Check back soon!</p>
                  </div>
                )}
              </section>
            </div>

          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default StoreLocatorMap;
