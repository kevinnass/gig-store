import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

export async function proxy(request: NextRequest) {
  // Met à jour la session utilisateur et gère la redirection pour /admin
  return await updateSession(request)
}

export const config = {
  matcher: ['/admin/:path*'],
}
