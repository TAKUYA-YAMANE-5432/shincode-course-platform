import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  const { response, claims } = await updateSession(request)
  const isAuthenticated = !!claims
  const { pathname } = request.nextUrl

  // ログイン済みユーザーを /auth/login・/auth/signup からトップへリダイレクト
  const guestOnlyPaths = ['/auth/login', '/auth/signup']
  if (isAuthenticated && guestOnlyPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 未ログインユーザーを保護ページから /auth/login へリダイレクト
  const protectedPaths = ['/profile', '/admin']
  if (!isAuthenticated && protectedPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
