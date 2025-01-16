// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { db } from '@/db/drizzle';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Define protected routes
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // Check if user is authenticated
    if (!auth.userId) {
      return Response.redirect(new URL('/sign-in', req.url));
    }

    // Get user from database
    const dbUser = await db.select()
      .from(users)
      .where(eq(users.userId, auth.userId))
      .limit(1);

    // If user doesn't exist in database, redirect to home
    if (!dbUser.length) {
      await auth.sessionClaims?.clearAll();
      return Response.redirect(new URL('/', req.url));
    }

    // Add user type to auth
    auth.sessionClaims = { 
      userType: dbUser[0].userType,
      userId: dbUser[0].id
    };

    // Protect routes based on user type
    const isAdminRoute = req.nextUrl.pathname.startsWith('/dashboard/admin');
    const isSellerRoute = req.nextUrl.pathname.startsWith('/dashboard/seller');

    if (isAdminRoute && dbUser[0].userType !== 'admin') {
      return Response.redirect(new URL('/dashboard/seller', req.url));
    }

    if (isSellerRoute && dbUser[0].userType !== 'seller') {
      return Response.redirect(new URL('/dashboard/admin', req.url));
    }

    await auth.protect();
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.[^?]*$).*)',
    // Run on API routes
    '/(api|trpc)(.*)'
  ],
};