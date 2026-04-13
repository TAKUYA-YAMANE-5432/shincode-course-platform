import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/auth/actions'

async function HeaderAuthSection() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const isAuthenticated = !!data?.claims

  if (isAuthenticated) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, display_name')
      .eq('id', data.claims.sub)
      .single()
    const isAdmin = profile?.role === 'admin'

    const email = data.claims.email as string | undefined
    const displayName = profile?.display_name as string | undefined
    const initial = (displayName?.[0] ?? email?.[0] ?? 'U').toUpperCase()

    return (
      <>
        {isAdmin && (
          <Link
            href="/admin"
            className="rounded px-3 py-1.5 text-sm font-medium text-[#a435f0] transition-colors hover:bg-[#a435f0]/5"
          >
            管理画面
          </Link>
        )}
        <Link
          href="/profile"
          title={displayName ?? email ?? 'プロフィール'}
          aria-label="プロフィール"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#a435f0] text-sm font-bold text-white transition-opacity hover:opacity-80"
        >
          {initial}
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="rounded border border-[#1c1d1f] px-4 py-1.5 text-sm font-bold text-[#1c1d1f] transition-colors hover:bg-[#f7f9fa]"
          >
            ログアウト
          </button>
        </form>
      </>
    )
  }

  return (
    <>
      <Link
        href="/auth/login"
        className="rounded border border-[#1c1d1f] px-4 py-1.5 text-sm font-bold text-[#1c1d1f] transition-colors hover:bg-[#f7f9fa]"
      >
        ログイン
      </Link>
      <Link
        href="/auth/signup"
        className="rounded bg-[#a435f0] px-4 py-1.5 text-sm font-bold text-white transition-colors hover:bg-[#8710d8]"
      >
        無料登録
      </Link>
    </>
  )
}

function HeaderAuthFallback() {
  return (
    <>
      <div className="h-8 w-16 animate-pulse rounded bg-[#f7f9fa]" />
      <div className="h-8 w-20 animate-pulse rounded bg-[#f7f9fa]" />
    </>
  )
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#d1d7dc] bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-[#a435f0]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 11L4.5 3.5L8 9L10 6L13 11H1Z" fill="white" />
            </svg>
          </div>
          <span className="text-[15px] font-bold text-[#1c1d1f]">ShinCode</span>
        </Link>

        <Link
          href="/courses"
          className="hidden text-sm font-medium text-[#1c1d1f] transition-colors hover:text-[#a435f0] md:block"
        >
          すべての講座
        </Link>

        <div className="flex-1" />

        <nav className="flex items-center gap-2">
          <Suspense fallback={<HeaderAuthFallback />}>
            <HeaderAuthSection />
          </Suspense>
        </nav>
      </div>
    </header>
  )
}
