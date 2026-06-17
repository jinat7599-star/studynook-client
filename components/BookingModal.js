'use client';
import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { createBooking } from '../lib/api';
import { X, Calendar, Clock, DollarSign } from 'lucide-react';

const TRANSACTIONAL_TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

export default function BookingModal({ room: transactionalRoomPayload, onClose: executeModalTermination, onSuccess: dispatchSuccessCallback }) {
  const { getToken: fetchSessionAuthenticationToken } = useAuth();
  const { user: authenticatedUserContext } = useUser();
  
  const [interactiveFormState, setInteractiveFormState] = useState({ date: '', startTime: '', endTime: '', specialNote: '' });
  const [operationExecutionLoading, setOperationExecutionLoading] = useState(false);
  const [calculatedFinancialTotal, setCalculatedFinancialTotal] = useState(0);

  const localizedCalendarTodayString = new Date().toISOString().split('T')[0];

  // Dynamically balance hourly rate metrics across selected scheduling boundaries
  useEffect(() => {
    if (interactiveFormState.startTime && interactiveFormState.endTime) {
      const parsedStartHourValue = parseInt(interactiveFormState.startTime.split(':')[0]);
      const parsedEndHourValue = parseInt(interactiveFormState.endTime.split(':')[0]);
      
      if (parsedEndHourValue > parsedStartHourValue) {
        setCalculatedFinancialTotal((parsedEndHourValue - parsedStartHourValue) * parseFloat(transactionalRoomPayload.hourly_rate));
      } else {
        setCalculatedFinancialTotal(0);
      }
    }
  }, [interactiveFormState.startTime, interactiveFormState.endTime, transactionalRoomPayload.hourly_rate]);

  const filteredAvailableEndSlots = TRANSACTIONAL_TIME_SLOTS.filter(evaluatedTimeSlot => evaluatedTimeSlot > interactiveFormState.startTime);

  const handleBookingFormSubmission = async (formSubmissionEvent) => {
    formSubmissionEvent.preventDefault();
    
    if (!interactiveFormState.date || !interactiveFormState.startTime || !interactiveFormState.endTime) {
      return toast.error('Please fill in all required fields');
    }
    if (calculatedFinancialTotal <= 0) {
      return toast.error('End time must be after start time');
    }
    
    setOperationExecutionLoading(true);
    try {
      const activeSecureToken = await fetchSessionAuthenticationToken();
      await createBooking({
        room_id: transactionalRoomPayload.id,
        date: interactiveFormState.date,
        start_time: interactiveFormState.startTime,
        end_time: interactiveFormState.endTime,
        total_cost: calculatedFinancialTotal,
        special_note: interactiveFormState.specialNote,
        user_name: authenticatedUserContext?.fullName || authenticatedUserContext?.firstName || '',
        user_email: authenticatedUserContext?.primaryEmailAddress?.emailAddress || '',
      }, activeSecureToken);
      
      toast.success('Room booked successfully! 🎉');
      dispatchSuccessCallback?.();
      executeModalTermination();
    } catch (transactionalRuntimeError) {
      toast.error(transactionalRuntimeError.message || 'Booking failed. Please try again.');
    } finally {
      setOperationExecutionLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
        
        {/* Modal Structure Title Section */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <div>
            <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white">Book Room</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{transactionalRoomPayload.name}</p>
          </div>
          <button onClick={executeModalTermination} className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleBookingFormSubmission} className="p-6 space-y-4">
          
          {/* Reservation Date Picker Component Row */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <Calendar className="w-4 h-4 inline mr-1 text-emerald-500" />Date *
            </label>
            <input type="date" min={localizedCalendarTodayString} value={interactiveFormState.date}
              onChange={e => setInteractiveFormState({ ...interactiveFormState, date: e.target.value })}
              className="input-field" required />
          </div>

          {/* Time Sequence Dropdown Group matrix */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                <Clock className="w-4 h-4 inline mr-1 text-emerald-500" />Start Time *
              </label>
              <select value={interactiveFormState.startTime} onChange={e => setInteractiveFormState({ ...interactiveFormState, startTime: e.target.value, endTime: '' })} className="input-field" required>
                <option value="">Select</option>
                {TRANSACTIONAL_TIME_SLOTS.slice(0, -1).map(sl => <option key={sl} value={sl}>{sl}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">End Time *</label>
              <select value={interactiveFormState.endTime} onChange={e => setInteractiveFormState({ ...interactiveFormState, endTime: e.target.value })} className="input-field" required disabled={!interactiveFormState.startTime}>
                <option value="">Select</option>
                {filteredAvailableEndSlots.map(sl => <option key={sl} value={sl}>{sl}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Special Note (optional)</label>
            <textarea value={interactiveFormState.specialNote} onChange={e => setInteractiveFormState({ ...interactiveFormState, specialNote: e.target.value })}
              className="input-field resize-none" rows={2} placeholder="Any special requirements..." />
          </div>

          {/* Optimized Injected Cost Invoice Dynamic Wrapper */}
          {calculatedFinancialTotal > 0 && (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-xl p-4 flex items-center justify-between border border-emerald-100/30 dark:border-emerald-900/20">
              <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" />Total Cost
              </span>
              <span className="text-xl font-black text-emerald-700 dark:text-emerald-400">${calculatedFinancialTotal.toFixed(2)}</span>
            </div>
          )}

          {/* Action Call Boundary Handlers */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={executeModalTermination} className="flex-1 btn-secondary py-2.5 text-sm">Cancel</button>
            <button type="submit" disabled={operationExecutionLoading} className="flex-1 btn-primary py-2.5 ripple text-sm shadow-md shadow-emerald-600/10">
              {operationExecutionLoading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}