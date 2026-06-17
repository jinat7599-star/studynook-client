import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Tokenize secure institutional endpoints requiring strict authorization masks
const classifiedRoutingPathMatcher = createRouteMatcher([
  '/dashboard(.*)',
  '/rooms(.*)',
  '/bookings(.*)',
]);

/**
 * Core Authentication Routing Interceptor Pipeline
 * Authenticates client sessions and structurally isolates protected node clusters
 */
export default clerkMiddleware(async (cryptographicAuthenticationHandler, networkInboundRequest) => {
  // Execute asynchronous route match checking against current request context
  if (classifiedRoutingPathMatcher(networkInboundRequest)) {
    
    // Fetch underlying active authorization layer safely from the handler context
    const runtimeSessionAuthority = await cryptographicAuthenticationHandler();
    
    // Assert structural session token existence; if missing, enforce instant login re-routing
    if (!runtimeSessionAuthority.userId) {
      return runtimeSessionAuthority.redirectToSignIn({ 
        returnBackUrl: networkInboundRequest.url 
      });
    }
  }
  
  return NextResponse.next();
});

// Structural optimization configuration handling edge network runtime pre-filtering
export const config = {
  matcher: [
    // Bypass internal Next.js static layers and service worker assets seamlessly
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ico|woff2?|docx?|xlsx?|zip|webmanifest)).*)',
    // Always execute authentication handshake for API and tRPC routes
    '/(api|trpc)(.*)',
  ],
};