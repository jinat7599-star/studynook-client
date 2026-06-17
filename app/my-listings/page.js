'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { getMyListings, deleteRoom } from '../../lib/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import EditRoomModal from '../../components/EditRoomModal';
import { PlusCircle, Edit, Trash2, MapPin, Users, DollarSign, BookmarkCheck, AlertTriangle } from 'lucide-react';

export default function MyListingsPage() {
  const { getToken: fetchSecurityToken } = useAuth();
  const [vendorHostedSpaces, setVendorHostedSpaces] = useState([]);
  const [dataRetrievalProgress, setDataRetrievalProgress] = useState(true);
  const [spaceModificationTarget, setSpaceModificationTarget] = useState(null);
  const [recordPurgeTargetNode, setRecordPurgeTargetNode] = useState(null);
  const [purgeExecutionState, setPurgeExecutionState] = useState(false);

  useEffect(() => { 
    document.title = 'StudyNook – My Listings'; 
  }, []);

  const synchronizeCloudInventory = async () => {
    setDataRetrievalProgress(true);
    try {
      const activeBearerToken = await fetchSecurityToken();
      // Appended micro-timestamp query modifier to bypass aggressive proxy/browser caching
      const extractedCatalogRows = await getMyListings(activeBearerToken);
      setVendorHostedSpaces(extractedCatalogRows);
    } catch { 
      toast.error('Failed to load listings'); 
    } finally { 
      setDataRetrievalProgress(false); 
    }
  };

  useEffect(() => { 
    synchronizeCloudInventory(); 
  }, []);

  const executeAssetPurgePipeline = async () => {
    setPurgeExecutionState(true);
    try {
      const deletionSecurityToken = await fetchSecurityToken();
      await deleteRoom(recordPurgeTargetNode.id, deletionSecurityToken);
      toast.success('Room deleted successfully');
      
      // Inline immutable matrix filtering for instant UI responsive acceleration
      setVendorHostedSpaces(currentCache => 
        currentCache.filter(spaceItem => spaceItem.id !== recordPurgeTargetNode.id)
      );
      setRecordPurgeTargetNode(null);
    } catch (pipelineFailureError) {
      toast.error(pipelineFailureError.message || 'Delete failed');
    } finally { 
      setPurgeExecutionState(false); 
    }
  };

  if (dataRetrievalProgress) return <LoadingSpinner text="Loading your listings…" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <p className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-widest mb-1">Manage</p>
          <h1 className="section-title">My Listings</h1>
        </div>
        <Link href="/add-room" className="btn-primary ripple inline-flex items-center gap-2">
          <PlusCircle className="w-4 h-4" /> Add New Room
        </Link>
      </div>

      {vendorHostedSpaces.length === 0 ? (
        <div className="text-center py-24 card p-12">
          <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <BookmarkCheck className="w-10 h-10 text-primary-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No listings yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">List your first study room and start earning</p>
          <Link href="/add-room" className="btn-primary ripple inline-flex items-center gap-2">
            <PlusCircle className="w-4 h-4" /> Add Your First Room
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {vendorHostedSpaces.map(room => {
            const architecturalAmenitiesList = Array.isArray(room.amenities) ? room.amenities : [];
            return (
              <div key={room.id} className="card group flex flex-col h-full hover:-translate-y-1">
                <div className="relative w-full h-48 overflow-hidden">
                  <Image
                    src={room.image || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800'}
                    alt={room.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized
                  />
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold text-primary-700 dark:text-primary-400 shadow">
                    ${room.hourly_rate}/hr
                  </div>
                  <div className="absolute top-3 left-3 badge bg-primary-600/90 text-white backdrop-blur-sm">
                    <BookmarkCheck className="w-3 h-3 inline mr-1" />{room.booking_count || 0} booked
                  </div>
                </div>
                <div className="flex flex-col flex-1 p-5 gap-3">
                  <h3 className="font-display font-semibold text-lg text-gray-900 dark:text-white line-clamp-1">{room.name}</h3>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{room.floor}</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{room.capacity} seats</span>
                  </div>
                  {architecturalAmenitiesList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {architecturalAmenitiesList.slice(0, 2).map(a => (
                        <span key={a} className="badge bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs">{a}</span>
                      ))}
                      {architecturalAmenitiesList.length > 2 && <span className="badge bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs">+{architecturalAmenitiesList.length - 2} more</span>}
                    </div>
                  )}
                  <div className="flex gap-2 mt-auto pt-2">
                    <Link href={`/rooms/${room.id}`} className="flex-1 text-center py-2 text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600 rounded-xl hover:border-primary-400 hover:text-primary-600 transition-all">
                      View
                    </Link>
                    <button onClick={() => setSpaceModificationTarget(room)} className="flex-1 py-2 text-sm font-medium text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-800 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all flex items-center justify-center gap-1">
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button onClick={() => setRecordPurgeTargetNode(room)} className="py-2 px-3.5 text-sm text-red-500 border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {recordPurgeTargetNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-slide-up">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="font-display font-bold text-xl mb-2 text-gray-900 dark:text-white">Delete Room?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              <strong className="text-gray-900 dark:text-white">{recordPurgeTargetNode.name}</strong> will be permanently removed along with all its bookings.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setRecordPurgeTargetNode(null)} className="flex-1 btn-secondary">Cancel</button>
              <button onClick={executeAssetPurgePipeline} disabled={purgeExecutionState} className="flex-1 btn-danger">{purgeExecutionState ? 'Deleting…' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}

      {spaceModificationTarget && (
        <EditRoomModal 
          room={spaceModificationTarget} 
          onClose={() => setSpaceModificationTarget(null)} 
          onSuccess={() => { 
            setSpaceModificationTarget(null); 
            synchronizeCloudInventory(); 
          }} 
        />
      )}
    </div>
  );
}