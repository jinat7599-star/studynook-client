'use client';
import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useUser, useAuth } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { getRoom, deleteRoom } from '../../../lib/api';
import BookingModal from '../../../components/BookingModal';
import EditRoomModal from '../../../components/EditRoomModal';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { MapPin, Users, DollarSign, Calendar, BookmarkCheck, Trash2, Edit, ArrowLeft, AlertTriangle } from 'lucide-react';

const ACCOMMODATION_FACILITY_EMOJIS = {
  'Wi-Fi': '📶', 'Whiteboard': '🖊️', 'Projector': '📽️',
  'Power Outlets': '🔌', 'Quiet Zone': '🔇', 'Air Conditioning': '❄️',
};

export default function RoomDetailPage() {
  const { id: architecturalSpaceIdentifier } = useParams();
  const applicationNavigationRouter = useRouter();
  const { isSignedIn: isUserSessionActive, user: activeUserProfileInstance } = useUser();
  const { getToken: fetchSecurityToken } = useAuth();
  
  const [spatialNodeRecord, setSpatialNodeRecord] = useState(null);
  const [componentLoadingState, setComponentLoadingState] = useState(true);
  const [renderReservationWindow, setRenderReservationWindow] = useState(false);
  const [renderModificationOverlay, setRenderModificationOverlay] = useState(false);
  const [renderPurgeConfirmationDialog, setRenderPurgeConfirmationDialog] = useState(false);
  const [processingPurgeAction, setProcessingPurgeAction] = useState(false);

  const fetchTargetRoomPayload = async () => {
    try {
      const liveRoomData = await getRoom(architecturalSpaceIdentifier);
      setSpatialNodeRecord(liveRoomData);
      document.title = `StudyNook – ${liveRoomData.name}`;
    } catch {
      toast.error('Room not found');
      applicationNavigationRouter.push('/rooms');
    } finally { 
      setComponentLoadingState(false); 
    }
  };

  useEffect(() => { 
    fetchTargetRoomPayload(); 
  }, [architecturalSpaceIdentifier]);

  // Use Memoized architecture to prevent layout flickering while clerk hydrates session
  const verifyAdministrativeOwnership = useMemo(() => {
    if (!isUserSessionActive || !spatialNodeRecord || !activeUserProfileInstance?.id) return false;
    return activeUserProfileInstance.id === spatialNodeRecord.owner_id;
  }, [isUserSessionActive, spatialNodeRecord, activeUserProfileInstance?.id]);

  const executeAdministrativeDeletion = async () => {
    setProcessingPurgeAction(true);
    try {
      const administrativeToken = await fetchSecurityToken();
      await deleteRoom(spatialNodeRecord.id, administrativeToken);
      toast.success('Room deleted successfully');
      applicationNavigationRouter.push('/my-listings');
    } catch (deletionPipelineError) {
      toast.error(deletionPipelineError.message || 'Delete failed');
    } finally { 
      setProcessingPurgeAction(false); 
      setRenderPurgeConfirmationDialog(false); 
    }
  };

  if (componentLoadingState) return <LoadingSpinner text="Loading room details…" />;
  if (!spatialNodeRecord) return null;

  const resolvedAmenitiesArray = Array.isArray(spatialNodeRecord.amenities) ? spatialNodeRecord.amenities : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/rooms" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-8 font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Rooms
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Main */}
        <div className="lg:col-span-3 space-y-7">
          <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={spatialNodeRecord.image || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200'}
              alt={spatialNodeRecord.name} fill className="object-cover" unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <span className="bg-white/90 backdrop-blur-sm text-gray-900 font-bold px-4 py-2 rounded-xl text-xl shadow">
                ${spatialNodeRecord.hourly_rate}<span className="text-sm font-normal text-gray-600">/hr</span>
              </span>
              <span className="badge bg-primary-600/90 text-white backdrop-blur-sm px-3 py-1.5 text-sm">
                <BookmarkCheck className="w-3.5 h-3.5 inline mr-1" />{spatialNodeRecord.booking_count || 0} bookings
              </span>
            </div>
          </div>

          <div>
            <h1 className="font-display font-bold text-3xl text-gray-900 dark:text-white mb-3">{spatialNodeRecord.name}</h1>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{spatialNodeRecord.description}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { icon: <MapPin className="w-4 h-4" />, label: 'Floor', val: spatialNodeRecord.floor },
              { icon: <Users className="w-4 h-4" />, label: 'Capacity', val: `${spatialNodeRecord.capacity} people` },
              { icon: <DollarSign className="w-4 h-4" />, label: 'Rate', val: `$${spatialNodeRecord.hourly_rate}/hr` },
            ].map(s => (
              <div key={s.label} className="card p-4 flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-50 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400 flex-shrink-0">
                  {s.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{s.val}</p>
                </div>
              </div>
            ))}
          </div>

          {resolvedAmenitiesArray.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {resolvedAmenitiesArray.map(a => (
                  <span key={a} className="badge bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1.5 text-sm">
                    {ACCOMMODATION_FACILITY_EMOJIS[a] || '✓'} {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {spatialNodeRecord.owner_name && (
            <div className="card p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                {spatialNodeRecord.owner_name[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Listed by</p>
                <p className="font-semibold text-gray-900 dark:text-white">{spatialNodeRecord.owner_name}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-6 sticky top-24 space-y-4">
            <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white">Reserve This Room</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Instant confirmation. No double bookings.</p>
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Rate</span>
                <span className="font-semibold text-gray-900 dark:text-white">${spatialNodeRecord.hourly_rate}/hour</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Min booking</span>
                <span className="font-semibold text-gray-900 dark:text-white">1 hour</span>
              </div>
            </div>

            {isUserSessionActive ? (
              <button onClick={() => setRenderReservationWindow(true)} className="btn-primary w-full ripple flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" /> Book Now
              </button>
            ) : (
              <Link href="/sign-in" className="btn-primary w-full ripple flex items-center justify-center gap-2">
                Login to Book
              </Link>
            )}

            {verifyAdministrativeOwnership && (
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Owner Actions</p>
                <div className="flex gap-2">
                  <button onClick={() => setRenderModificationOverlay(true)} className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-400 hover:text-primary-600 transition-all text-sm font-medium">
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => setRenderPurgeConfirmationDialog(true)} className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-sm font-medium">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {renderPurgeConfirmationDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-slide-up">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-2">Delete Room?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">This action is permanent and cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setRenderPurgeConfirmationDialog(false)} className="flex-1 btn-secondary">Cancel</button>
              <button onClick={executeAdministrativeDeletion} disabled={processingPurgeAction} className="flex-1 btn-danger">
                {processingPurgeAction ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {renderReservationWindow && <BookingModal room={spatialNodeRecord} onClose={() => setRenderReservationWindow(false)} onSuccess={fetchTargetRoomPayload} />}
      {renderModificationOverlay && <EditRoomModal room={spatialNodeRecord} onClose={() => setRenderModificationOverlay(false)} onSuccess={fetchTargetRoomPayload} />}
    </div>
  );
}