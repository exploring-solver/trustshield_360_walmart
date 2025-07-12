import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  // Auth routes
  '/sign-in(.*)',
  '/sign-up(.*)',
  
  // Public pages
  '/',
  
  // Existing public API routes
  '/api/cortex(.*)',
  '/api/fraud-rings(.*)',
  '/api/vision-guard(.*)',
  '/api/crypto/handshake(.*)',
  '/api/blockchain/log(.*)',
  
  // TrustShield CLI-accessible routes
  '/api/trace/(.*)',
  '/api/risk/(.*)',
  '/api/credentials/revoke(.*)',
  '/api/wallet/(.*)',
  '/api/biometric/verify(.*)',
  '/api/analytics/(.*)',
  '/api/quantum/status(.*)',
  '/api/monitoring/events(.*)',
  '/api/ai-models/performance(.*)',
  '/api/admin/system-health(.*)',
  '/api/seed-graph(.*)',
  
  // Optional: Make all API routes public for development
  '/api/(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}