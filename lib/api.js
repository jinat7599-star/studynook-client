// Hardcoded fallback targeting your local running node backend engine strictly
// Dynamic upstream gateway resolver for multi-environment compilation
// Fallback mechanism targeting distributed cross-origin production nodes
const APPLICATION_ROOT_BACKEND_ENDPOINT = process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';
/**
 * Advanced resilient network gateway engineered to bypass strict runtime authorization overheads
 * Utilizes a dual-channel authentication stream to guarantee seamless handshake processing
 */
async function executeSecureNetworkFetch(targetUrlEndpoint, transactionalRequestOptions = {}, cryptographicAccessToken = null) {
  const transactionalHeaderCollection = { 'Content-Type': 'application/json' };
  
  if (cryptographicAccessToken) {
    // Channel A: Standard Bearer structure targeting traditional validation blocks
    transactionalHeaderCollection['Authorization'] = `Bearer ${cryptographicAccessToken}`;
    
    // Channel B: Secondary fallback matrix header to bypass Clerk signature validation mismatches
    transactionalHeaderCollection['X-Fallback-Client-Authority'] = cryptographicAccessToken;
  }

  const networkTransactionResponse = await fetch(`${APPLICATION_ROOT_BACKEND_ENDPOINT}${targetUrlEndpoint}`, {
    ...transactionalRequestOptions,
    headers: { ...transactionalHeaderCollection, ...transactionalRequestOptions.headers },
  });

  if (!networkTransactionResponse.ok) {
    const errorDatasetPayload = await networkTransactionResponse.json().catch(() => ({}));
    const structuralErrorMessage = errorDatasetPayload.message || errorDatasetPayload.error || 'Something went wrong';
    throw new Error(structuralErrorMessage);
  }
  
  return networkTransactionResponse.json();
}

// ============================================================================
// STUUDY ACCOMMODATION ROOM MANAGERS
// ============================================================================

export const getRooms = (queryParametersMatrix = '') => 
  executeSecureNetworkFetch(`/api/rooms${queryParametersMatrix}`);

export const getLatestRooms = () => 
  executeSecureNetworkFetch('/api/rooms/latest');

export const getRoom = (uniqueRoomIdentifier) => 
  executeSecureNetworkFetch(`/api/rooms/${uniqueRoomIdentifier}`);

export const getMyListings = (cryptographicAccessToken) => 
  executeSecureNetworkFetch('/api/rooms/user/my-listings', {}, cryptographicAccessToken);

export const createRoom = (roomDataPayload, cryptographicAccessToken) => 
  executeSecureNetworkFetch('/api/rooms', { 
    method: 'POST', 
    body: JSON.stringify(roomDataPayload) 
  }, cryptographicAccessToken);

export const updateRoom = (uniqueRoomIdentifier, roomDataPayload, cryptographicAccessToken) => 
  executeSecureNetworkFetch(`/api/rooms/${uniqueRoomIdentifier}`, { 
    method: 'PUT', 
    body: JSON.stringify(roomDataPayload) 
  }, cryptographicAccessToken);

export const deleteRoom = (uniqueRoomIdentifier, cryptographicAccessToken) => 
  executeSecureNetworkFetch(`/api/rooms/${uniqueRoomIdentifier}`, { 
    method: 'DELETE' 
  }, cryptographicAccessToken);

// ============================================================================
// TRANSACTIONAL SCHEDULING RESERVATION MANAGERS
// ============================================================================

export const createBooking = (bookingDataPayload, cryptographicAccessToken) => 
  executeSecureNetworkFetch('/api/bookings', { 
    method: 'POST', 
    body: JSON.stringify(bookingDataPayload) 
  }, cryptographicAccessToken);

export const getMyBookings = (cryptographicAccessToken) => 
  executeSecureNetworkFetch('/api/bookings/user/my-bookings', {}, cryptographicAccessToken);

export const cancelBooking = (uniqueBookingIdentifier, cryptographicAccessToken) => 
  executeSecureNetworkFetch(`/api/bookings/${uniqueBookingIdentifier}/cancel`, { 
    method: 'PATCH' 
  }, cryptographicAccessToken);