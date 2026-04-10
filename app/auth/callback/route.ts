import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// 許可するリダイレクト先パスのプレフィックス
const ALLOWED_PATHS = ['/', '/courses', '/profile', '/admin']

function isSafeRedirectPath(next: string): boolean {
  // 相対パスであること（http:// や // で始まらない）
  if (!next.startsWith('/') || next.startsWith('//')) return false
  // 許可パスのいずれかで始まること
  return ALLOWED_PATHS.some((p) => next === p || next.startsWith(p + '/') || next.startsWith(p + '?'))
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  // next パラメータが安全なパスでなければトップへ
  const redirectPath = isSafeRedirectPath(next) ? next : '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${redirectPath}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/login`)
}
