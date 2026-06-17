'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { getMyBookings, cancelBooking } from '../../lib/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Calendar, Clock, DollarSign, XCircle, AlertTriangle, BookOpen } from 'lucide-react';

function RenderStatusIndicator({ operationalStatus }) {
  return (
    <span className={`badge font-semibold ${operationalStatus === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
      <span className={`w-1.5 h-1.5 rounded-full inline-block mr-1.5 ${operationalStatus === 'confirmed' ? 'bg-green-500' : 'bg-red-500'}`} />
      {operationalStatus === 'confirmed' ? 'Confirmed' : 'Cancelled'}
    </span>
  );
}

export default function MyBookingsPage() {
  const { getToken: fetchSecurityToken } = useAuth();
  const [profileReservations, setProfileReservations] = useState([]);
  const [interfaceLoadingState, setInterfaceLoadingState] = useState(true);
  const [revocationTargetNode, setRevocationTargetNode] = useState(null);
  const [processingCancellation, setProcessingCancellation] = useState(false);

  useEffect(() => { 
    document.title = 'StudyNook – My Bookings'; 
  }, []);

  const synchronizeDashboardLogs = async () => {
    setInterfaceLoadingState(true);
    try {
      const secureSessionToken = await fetchSecurityToken();
      const compiledReservationsData = await getMyBookings(secureSessionToken);
      setProfileReservations(compiledReservationsData);
    } catch { 
      toast.error('Failed to load bookings'); 
    } finally { 
      setInterfaceLoadingState(false); 
    }
  };

  useEffect(() => { 
    synchronizeDashboardLogs(); 
  }, []);

  const executeCancellationPipeline = async () => {
    setProcessingCancellation(true);
    try {
      const operationalToken = await fetchSecurityToken();
      await cancelBooking(revocationTargetNode.id, operationalToken);
      toast.success('Booking cancelled');
      
      setProfileReservations(currentCollection => 
        currentCollection.map(reservationItem => 
          reservationItem.id === revocationTargetNode.id 
            ? { ...reservationItem, status: 'cancelled' } 
            : reservationItem
        )
      );
      setRevocationTargetNode(null);
    } catch (pipelineError) {
      toast.error(pipelineError.message || 'Cancel failed');
    } finally { 
      setProcessingCancellation(false); 
    }
  };

  const verifyRevocationWindow = (reservationBlock) => {
    if (reservationBlock.status !== 'confirmed') return false;
    
    // Split exact YYYY-MM-DD to break away from raw timezone conversion glitches
    const [calendarYear, calendarMonth, calendarDay] = reservationBlock.date.split('T')[0].split('-');
    const parsingTargetDate = new Date(calendarYear, calendarMonth - 1, calendarDay);
    
    const operationalCurrentTime = new Date(); 
    operationalCurrentTime.setHours(0, 0, 0, 0);
    
    return parsingTargetDate >= operationalCurrentTime;
  };

  const transformTimeDigitalOutput = (rawTimeInputString) => {
    const [timeHourSegment, timeMinuteSegment] = rawTimeInputString.split(':');
    const computedNumericalHour = parseInt(timeHourSegment, 10);
    const conceptualPeriodSuffix = computedNumericalHour >= 12 ? 'PM' : 'AM';
    const standardizedHourFormat = computedNumericalHour > 12 ? computedNumericalHour - 12 : computedNumericalHour === 0 ? 12 : computedNumericalHour;
    
    return `${standardizedHourFormat}:${timeMinuteSegment} ${conceptualPeriodSuffix}`;
  };

  const convertIsoDateToHumanFormat = (rawDateString) => {
    const [targetYear, targetMonth, targetDay] = rawDateString.split('T')[0].split('-');
    const isolatedLocalDateObject = new Date(targetYear, targetMonth - 1, targetDay);
    return isolatedLocalDateObject.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (interfaceLoadingState) return <LoadingSpinner text="Loading your bookings…" />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-widest mb-1">Dashboard</p>
        <h1 className="section-title">My Bookings</h1>
      </div>

      {profileReservations.length === 0 ? (
        <div className="text-center py-24 card p-12">
          <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <BookOpen className="w-10 h-10 text-primary-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No bookings yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Find and book your perfect study room</p>
          <Link href="/rooms" className="btn-primary ripple">Browse Rooms</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {profileReservations.map(b => (
            <div key={b.id} className="card p-5 flex flex-col sm:flex-row gap-4 hover:-translate-y-0.5">
              <div className="relative w-full sm:w-28 h-28 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src={b.room_image || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400'}
                  alt={b.room_name} fill className="object-cover" unoptimized
                />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <Link href={`/rooms/${b.room_id}`} className="font-display font-semibold text-lg text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      {b.room_name}
                    </Link>
                    {b.room_floor && <p className="text-xs text-gray-500 dark:text-gray-400">{b.room_floor}</p>}
                  </div>
                  <RenderStatusIndicator operationalStatus={b.status} />
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-primary-500" />
                    {convertIsoDateToHumanFormat(b.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-primary-500" />
                    {transformTimeDigitalOutput(b.start_time)} – {transformTimeDigitalOutput(b.end_time)}
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-white">
                    <DollarSign className="w-4 h-4 text-primary-500" />
                    ${parseFloat(b.total_cost).toFixed(2)}
                  </span>
                </div>
                {b.special_note && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-1.5">
                    Note: {b.special_note}
                  </p>
                )}
              </div>
              {verifyRevocationWindow(b) && (
                <div className="flex sm:flex-col items-center justify-end">
                  <button onClick={() => setRevocationTargetNode(b)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-all whitespace-nowrap">
                    <XCircle className="w-4 h-4" /> Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {revocationTargetNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-slide-up">
            <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="font-display font-bold text-xl mb-2 text-gray-900 dark:text-white">Cancel Booking?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Your booking for <strong className="text-gray-900 dark:text-white">{revocationTargetNode.room_name}</strong> will be cancelled.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setRevocationTargetNode(null)} className="flex-1 btn-secondary">Keep It</button>
              <button onClick={executeCancellationPipeline} disabled={processingCancellation} className="flex-1 btn-danger">{processingCancellation ? 'Cancelling…' : 'Cancel Booking'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}