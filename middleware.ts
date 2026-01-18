// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define which routes need authentication.
const isProtectedRoute = createRouteMatcher([
  '/checkout(.*)',
  '/api(.*)',
  // Add other private routes here
]);

// ✅ FIX: Remove the parentheses () after auth
export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    // It should be auth.protect(), not auth().protect()
    auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};