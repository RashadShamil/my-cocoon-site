// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define which routes need authentication.
const isProtectedRoute = createRouteMatcher([
  '/checkout(.*)',
  '/api(.*)',
  '/admin(.*)',
]);

// ✅ FIX: Remove the parentheses () after auth
export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // It should be await auth.protect() in Clerk v6
    await auth.protect();
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