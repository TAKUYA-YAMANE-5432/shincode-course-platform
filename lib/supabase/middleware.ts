import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // セッションリフレッシュ & JWT 検証
  const { data } = await supabase.auth.getClaims()

  // CDN キャッシュ防止ヘッダー
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
  response.headers.set('Expires', '0')
  response.headers.set('Pragma', 'no-cache')

  return { response, claims: data?.claims ?? null }
}
