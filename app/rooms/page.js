'use client';
import { useEffect, useState, useCallback } from 'react';
import { getRooms } from '../../lib/api';
import RoomCard from '../../components/RoomCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const STATIC_AMENITIES_CATALOG = ['Whiteboard', 'Projector', 'Wi-Fi', 'Power Outlets', 'Quiet Zone', 'Air Conditioning'];

export default function RoomsPage() {
  const [architecturalRoomsCollection, setArchitecturalRoomsCollection] = useState([]);
  const [catalogFetchLoading, setCatalogFetchLoading] = useState(true);
  const [liveSearchQuery, setLiveSearchQuery] = useState('');
  const [activeSelectedAmenities, setActiveSelectedAmenities] = useState([]);
  const [minimumHourlyRate, setMinimumHourlyRate] = useState('');
  const [maximumHourlyRate, setMaximumHourlyRate] = useState('');
  const [isFilterPanelVisible, setIsFilterPanelVisible] = useState(false);

  useEffect(() => { 
    document.title = 'StudyNook – Available Rooms'; 
  }, []);

  // Isolated stable reference to bypass functional recreation on state updates
  const executeInventorySyncPipeline = useCallback(async (currentSearch, currentAmenities, currentMin, currentMax) => {
    setCatalogFetchLoading(true);
    try {
      const URLQueryParameterCompiler = new URLSearchParams();
      if (currentSearch) URLQueryParameterCompiler.append('search', currentSearch);
      if (currentAmenities.length) URLQueryParameterCompiler.append('amenities', currentAmenities.join(','));
      if (currentMin) URLQueryParameterCompiler.append('minRate', currentMin);
      if (currentMax) URLQueryParameterCompiler.append('maxRate', currentMax);
      
      const structuredQueryString = URLQueryParameterCompiler.toString() ? '?' + URLQueryParameterCompiler.toString() : '';
      const synchronizedRoomsPayload = await getRooms(structuredQueryString);
      setArchitecturalRoomsCollection(synchronizedRoomsPayload);
    } catch { 
      setArchitecturalRoomsCollection([]); 
    } finally { 
      setCatalogFetchLoading(false); 
    }
  }, []);

  // Safe debounce hook structure triggering from raw value tracking directly
  useEffect(() => {
    const debouncedNetworkTimer = setTimeout(() => {
      executeInventorySyncPipeline(liveSearchQuery, activeSelectedAmenities, minimumHourlyRate, maximumHourlyRate);
    }, 350);

    return () => clearTimeout(debouncedNetworkTimer);
  }, [liveSearchQuery, activeSelectedAmenities, minimumHourlyRate, maximumHourlyRate, executeInventorySyncPipeline]);

  const toggleTargetAmenityFilter = (targetAmenityName) => {
    setActiveSelectedAmenities(previousSelectionCache => 
      previousSelectionCache.includes(targetAmenityName) 
        ? previousSelectionCache.filter(item => item !== targetAmenityName) 
        : [...previousSelectionCache, targetAmenityName]
    );
  };

  const flushAllAppliedFilters = () => { 
    setLiveSearchQuery(''); 
    setActiveSelectedAmenities([]); 
    setMinimumHourlyRate(''); 
    setMaximumHourlyRate(''); 
  };

  const verifyActiveFilterPresence = liveSearchQuery || activeSelectedAmenities.length || minimumHourlyRate || maximumHourlyRate;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-widest mb-2">Browse</p>
        <h1 className="section-title mb-2">Available Study Rooms</h1>
        <p className="text-gray-500 dark:text-gray-400">Find the perfect quiet space for your study session</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
            <input
              type="text" placeholder="Search rooms by name…"
              value={liveSearchQuery} onChange={e => setLiveSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <button
            onClick={() => setIsFilterPanelVisible(!isFilterPanelVisible)}
            className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl border font-medium text-sm transition-all duration-200 ${isFilterPanelVisible ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-400'}`}
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
            {activeSelectedAmenities.length > 0 && <span className="w-5 h-5 bg-white text-primary-600 text-xs font-bold rounded-full flex items-center justify-center">{activeSelectedAmenities.length}</span>}
          </button>
          {verifyActiveFilterPresence && (
            <button onClick={flushAllAppliedFilters} className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 transition-all">
              <X className="w-4 h-4" /> Clear
            </button>
          )}
        </div>

        {isFilterPanelVisible && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-4 animate-slide-up">
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2.5">Amenities</p>
              <div className="flex flex-wrap gap-2">
                {STATIC_AMENITIES_CATALOG.map(a => (
                  <button key={a} onClick={() => toggleTargetAmenityFilter(a)}
                    className={`badge cursor-pointer transition-all duration-200 hover:scale-105 ${activeSelectedAmenities.includes(a) ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20'}`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Min Rate ($/hr)</label>
                <input type="number" placeholder="0" value={minimumHourlyRate} onChange={e => setMinimumHourlyRate(e.target.value)} className="input-field" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Max Rate ($/hr)</label>
                <input type="number" placeholder="100" value={maximumHourlyRate} onChange={e => setMaximumHourlyRate(e.target.value)} className="input-field" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {catalogFetchLoading ? <LoadingSpinner text="Finding rooms…" /> : architecturalRoomsCollection.length === 0 ? (
        <div className="text-center py-24">
          <Search className="w-14 h-14 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No rooms found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Try adjusting your search or filters</p>
          <button onClick={flushAllAppliedFilters} className="btn-primary ripple">Clear Filters</button>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{architecturalRoomsCollection.length} room{architecturalRoomsCollection.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {architecturalRoomsCollection.map(r => <RoomCard key={r.id} room={r} />)}
          </div>
        </>
      )}
    </div>
  );
}