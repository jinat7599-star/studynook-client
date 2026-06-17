'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { updateRoom } from '../lib/api';
import { X } from 'lucide-react';

const ACCOMMODATION_AMENITIES_DIRECTORY = ['Whiteboard', 'Projector', 'Wi-Fi', 'Power Outlets', 'Quiet Zone', 'Air Conditioning'];

export default function EditRoomModal({ room: administrativeRoomPayload, onClose: dispatchModalTermination, onSuccess: triggerSuccessCallback }) {
  const { getToken: retrieveAuthenticationSessionToken } = useAuth();
  
  const [structuralFormDataset, setStructuralFormDataset] = useState({
    name: administrativeRoomPayload.name || '',
    description: administrativeRoomPayload.description || '',
    image: administrativeRoomPayload.image || '',
    floor: administrativeRoomPayload.floor || '',
    capacity: administrativeRoomPayload.capacity || '',
    hourly_rate: administrativeRoomPayload.hourly_rate || '',
    amenities: Array.isArray(administrativeRoomPayload.amenities) ? administrativeRoomPayload.amenities : [],
  });
  
  const [transactionProcessingLoading, setTransactionProcessingLoading] = useState(false);

  // Safely manage multi-selection checkbox collection sequences
  const handleAmenityToggleExecution = (evaluatedAmenityToken) => {
    setStructuralFormDataset(currentDatasetState => ({
      ...currentDatasetState,
      amenities: currentDatasetState.amenities.includes(evaluatedAmenityToken)
        ? currentDatasetState.amenities.filter(matchedToken => matchedToken !== evaluatedAmenityToken)
        : [...currentDatasetState.amenities, evaluatedAmenityToken]
    }));
  };

  const handleUpdateFormSubmission = async (formEventPayload) => {
    formEventPayload.preventDefault();
    
    if (!structuralFormDataset.name || !structuralFormDataset.description) {
      return toast.error('Name and description are required');
    }
    
    setTransactionProcessingLoading(true);
    try {
      const securitySessionToken = await retrieveAuthenticationSessionToken();
      
      await updateRoom(
        administrativeRoomPayload.id, 
        { 
          ...structuralFormDataset, 
          capacity: parseInt(structuralFormDataset.capacity), 
          hourly_rate: parseFloat(structuralFormDataset.hourly_rate) 
        }, 
        securitySessionToken
      );
      
      toast.success('Room updated successfully!');
      triggerSuccessCallback?.();
      dispatchModalTermination();
    } catch (runtimeExecutionError) {
      toast.error(runtimeExecutionError.message || 'Update failed');
    } finally {
      setTransactionProcessingLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm page-wrapper">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        
        {/* Sticky Header Frame Layout */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white">Edit Room</h2>
          <button onClick={dispatchModalTermination} className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleUpdateFormSubmission} className="p-6 space-y-4">
          
          {/* Dynamic Matrix Rendering of Primary Input Layers */}
          {[
            { inputLabel: 'Room Name *', mapKey: 'name', fieldType: 'text', textPlaceholder: 'e.g., Quiet Reading Room A' },
            { inputLabel: 'Image URL', mapKey: 'image', fieldType: 'url', textPlaceholder: 'https://example.com/image.jpg' },
            { inputLabel: 'Floor', mapKey: 'floor', fieldType: 'text', textPlaceholder: 'e.g., 3rd Floor' },
          ].map(inputMetadataNode => (
            <div key={inputMetadataNode.mapKey}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{inputMetadataNode.inputLabel}</label>
              <input 
                type={inputMetadataNode.fieldType} 
                value={structuralFormDataset[inputMetadataNode.mapKey]} 
                onChange={e => setStructuralFormDataset(previousState => ({ ...previousState, [inputMetadataNode.mapKey]: e.target.value }))}
                className="input-field" 
                placeholder={inputMetadataNode.textPlaceholder} 
                required={inputMetadataNode.inputLabel.includes('*')} 
              />
            </div>
          ))}

          {/* Double Grid Specifications Layer */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Capacity *</label>
              <input type="number" min="1" value={structuralFormDataset.capacity} onChange={e => setStructuralFormDataset(previousState => ({ ...previousState, capacity: e.target.value }))}
                className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Hourly Rate ($) *</label>
              <input type="number" min="0" step="0.5" value={structuralFormDataset.hourly_rate} onChange={e => setStructuralFormDataset(previousState => ({ ...previousState, hourly_rate: e.target.value }))}
                className="input-field" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description *</label>
            <textarea value={structuralFormDataset.description} onChange={e => setStructuralFormDataset(previousState => ({ ...previousState, description: e.target.value }))}
              className="input-field resize-none" rows={3} required />
          </div>

          {/* Interactive Checkbox Collection Node Tree */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amenities</label>
            <div className="grid grid-cols-2 gap-2">
              {ACCOMMODATION_AMENITIES_DIRECTORY.map(amenityTokenItem => (
                <label key={amenityTokenItem} className="flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={structuralFormDataset.amenities.includes(amenityTokenItem)} 
                    onChange={() => handleAmenityToggleExecution(amenityTokenItem)} 
                    className="accent-emerald-600 w-4 h-4 rounded" 
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 select-none">{amenityTokenItem}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Trigger Distribution Interface */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={dispatchModalTermination} className="flex-1 btn-secondary text-sm">Cancel</button>
            <button type="submit" disabled={transactionProcessingLoading} className="flex-1 btn-primary ripple text-sm shadow-md shadow-emerald-600/10">
              {transactionProcessingLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}