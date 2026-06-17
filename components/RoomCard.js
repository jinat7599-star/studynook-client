import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Users, ChevronRight } from 'lucide-react';

const ACCOMMODATION_AMENITY_EMOJI_REGISTRY = {
  'Wi-Fi': '📶', 'Whiteboard': '🖊️', 'Projector': '📽️',
  'Power Outlets': '🔌', 'Quiet Zone': '🔇', 'Air Conditioning': '❄️',
};

export default function RoomCard({ room: isolatedRoomPayload }) {
  const dynamicAmenitiesCollection = Array.isArray(isolatedRoomPayload.amenities) ? isolatedRoomPayload.amenities : [];
  const primaryVisibleAmenities = dynamicAmenitiesCollection.slice(0, 3);
  const remainingHiddenAmenitiesCount = dynamicAmenitiesCollection.length - 3;
  
  // Safe validation layout handling long text descriptive nodes safely
  const streamlinedTextDescription = isolatedRoomPayload.description?.length > 100 
    ? isolatedRoomPayload.description.slice(0, 100) + '…' 
    : isolatedRoomPayload.description;

  return (
    <div className="card group flex flex-col h-full hover:-translate-y-1 transition-all duration-300 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700/50 page-wrapper shadow-sm hover:shadow-md">
      
      {/* Decorative Core Media Frame Wrapper */}
      <div className="relative w-full h-52 overflow-hidden bg-gray-100 dark:bg-gray-900">
        <Image
          src={isolatedRoomPayload.image || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800'}
          alt={isolatedRoomPayload.name}
          fill
          sizes="(max-width:768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        
        {/* Absolute Floating Invoiced Badge Layer */}
        <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-black text-emerald-700 dark:text-emerald-400 shadow-sm border border-emerald-100/20">
          ${isolatedRoomPayload.hourly_rate}/hr
        </div>
      </div>

      {/* Main Structural Typography Cluster */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white leading-tight line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {isolatedRoomPayload.name}
        </h3>
        
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed flex-1">
          {streamlinedTextDescription}
        </p>

        {/* Technical Specification Analytics Node Matrix */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-gray-500 dark:text-gray-400 select-none">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-500/80" />{isolatedRoomPayload.floor}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-emerald-500/80" />{isolatedRoomPayload.capacity} seats
          </span>
        </div>

        {/* Badges Flow Allocation Layout Block */}
        {dynamicAmenitiesCollection.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {primaryVisibleAmenities.map((amenityTokenString) => (
              <span 
                key={amenityTokenString} 
                className="badge bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px] px-2.5 py-1 rounded-lg border border-emerald-100/20"
              >
                {ACCOMMODATION_AMENITY_EMOJI_REGISTRY[amenityTokenString] || '✓'} {amenityTokenString}
              </span>
            ))}
            
            {remainingHiddenAmenitiesCount > 0 && (
              <span className="badge bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold text-[11px] px-2.5 py-1 rounded-lg">
                +{remainingHiddenAmenitiesCount} more
              </span>
            )}
          </div>
        )}

        {/* Dynamic Route Call Execution Trigger */}
        <Link
          href={`/rooms/${isolatedRoomPayload.id}`}
          className="btn-primary ripple mt-2 flex items-center justify-center gap-2 text-sm font-semibold shadow-sm shadow-emerald-600/10"
        >
          View Details <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      
    </div>
  );
}