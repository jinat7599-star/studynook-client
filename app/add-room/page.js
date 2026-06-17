'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { createRoom } from '../../lib/api';
import { PlusCircle, Image as ImgIcon, MapPin, Users, DollarSign } from 'lucide-react';

const ACCOMMODATION_FACILITIES = ['Whiteboard', 'Projector', 'Wi-Fi', 'Power Outlets', 'Quiet Zone', 'Air Conditioning'];

const DISCOVER_CATALOG_IMAGES = [
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
  'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800',
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800',
];

export default function AddRoomPage() {
  const applicationNavigationRouter = useRouter();
  const { getToken: fetchSecurityToken } = useAuth();
  const { user: authenticatedUserProfile } = useUser();
  const [submissionProcessing, setSubmissionProcessing] = useState(false);
  const [spatialFormState, setSpatialFormState] = useState({ 
    name: '', 
    description: '', 
    image: '', 
    floor: '', 
    capacity: '', 
    hourly_rate: '', 
    amenities: [] 
  });

  useEffect(() => { 
    document.title = 'StudyNook – Add Room'; 
  }, []);

  const handleFacilityToggle = (targetedAmenityName) => {
    setSpatialFormState(currentFormSnapshot => ({
      ...currentFormSnapshot,
      amenities: currentFormSnapshot.amenities.includes(targetedAmenityName)
        ? currentFormSnapshot.amenities.filter(matchedItem => matchedItem !== targetedAmenityName)
        : [...currentFormSnapshot.amenities, targetedAmenityName]
    }));
  };

  const executeFormSubmissionPipeline = async (submissionEvent) => {
    submissionEvent.preventDefault();
    
    if (!spatialFormState.name || !spatialFormState.description || !spatialFormState.floor || !spatialFormState.capacity || !spatialFormState.hourly_rate) {
      return toast.error('Please fill in all required fields');
    }
    
    setSubmissionProcessing(true);
    try {
    
      const runtimeSessionToken = await fetchSecurityToken();
      
      if (!runtimeSessionToken) {
        throw new Error('Authentication token generation failed. Please re-login.');
      }
      
      // Enforce default fallback visual matrix if user skips the optional image path
      const structuralPayload = {
        name: spatialFormState.name,
        description: spatialFormState.description,
        image: spatialFormState.image.trim() || DISCOVER_CATALOG_IMAGES[0],
        floor: spatialFormState.floor,
        capacity: parseInt(spatialFormState.capacity, 10),
        hourly_rate: parseFloat(spatialFormState.hourly_rate),
        amenities: spatialFormState.amenities,
        owner_name: authenticatedUserProfile?.fullName || authenticatedUserProfile?.firstName || 'Anonymous Host',
        owner_email: authenticatedUserProfile?.primaryEmailAddress?.emailAddress || '',
      };

      // 2. Transmit payload and token structurally aligned with lib/api.js interface
      await createRoom(structuralPayload, runtimeSessionToken);
      
      toast.success('Room added successfully! 🎉');
      applicationNavigationRouter.push('/my-listings');
    } catch (pipelineExecutionError) {
      toast.error(pipelineExecutionError.message || 'Failed to add room');
    } finally { 
      setSubmissionProcessing(false); 
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-widest mb-2">Earn from your space</p>
        <h1 className="section-title mb-2">Add a Study Room</h1>
        <p className="text-gray-500 dark:text-gray-400">Fill in the details below to list your study room on StudyNook</p>
      </div>

      <form onSubmit={executeFormSubmissionPipeline} className="card p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Room Name *</label>
          <input type="text" value={spatialFormState.name} onChange={e => setSpatialFormState(f => ({ ...f, name: e.target.value }))}
            className="input-field" placeholder="e.g., Quiet Reading Room A" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description *</label>
          <textarea value={spatialFormState.description} onChange={e => setSpatialFormState(f => ({ ...f, description: e.target.value }))}
            className="input-field resize-none" rows={4} placeholder="Describe the room, its environment, and rules…" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            <ImgIcon className="w-4 h-4 inline mr-1" />Image URL
          </label>
          <input type="url" value={spatialFormState.image} onChange={e => setSpatialFormState(f => ({ ...f, image: e.target.value }))}
            className="input-field" placeholder="https://example.com/room.jpg" />
          <div className="mt-2 flex flex-wrap gap-2">
            {DISCOVER_CATALOG_IMAGES.map((url, i) => (
              <button key={i} type="button" onClick={() => setSpatialFormState(f => ({ ...f, image: url }))}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${spatialFormState.image === url ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-primary-400'}`}>
                Sample {i + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <MapPin className="w-4 h-4 inline mr-1" />Floor *
            </label>
            <input type="text" value={spatialFormState.floor} onChange={e => setSpatialFormState(f => ({ ...f, floor: e.target.value }))}
              className="input-field" placeholder="e.g., 3rd Floor" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <Users className="w-4 h-4 inline mr-1" />Capacity *
            </label>
            <input type="number" min="1" value={spatialFormState.capacity} onChange={e => setSpatialFormState(f => ({ ...f, capacity: e.target.value }))}
              className="input-field" placeholder="4" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <DollarSign className="w-4 h-4 inline mr-1" />Hourly Rate ($) *
            </label>
            <input type="number" min="0" step="0.5" value={spatialFormState.hourly_rate} onChange={e => setSpatialFormState(f => ({ ...f, hourly_rate: e.target.value }))}
              className="input-field" placeholder="5" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Amenities</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ACCOMMODATION_FACILITIES.map(a => (
              <label key={a} className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all duration-200 hover:border-primary-400 ${spatialFormState.amenities.includes(a) ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-400' : 'border-gray-200 dark:border-gray-600'}`}>
                <input type="checkbox" checked={spatialFormState.amenities.includes(a)} onChange={() => handleFacilityToggle(a)} className="accent-primary-600 w-4 h-4" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{a}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => applicationNavigationRouter.back()} className="flex-1 btn-secondary">Cancel</button>
          <button type="submit" disabled={submissionProcessing} className="flex-2 btn-primary ripple flex items-center justify-center gap-2 flex-1">
            <PlusCircle className="w-4 h-4" />
            {submissionProcessing ? 'Adding Room…' : 'Add Room'}
          </button>
        </div>
      </form>
    </div>
  );
}