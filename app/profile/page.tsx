import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ProfileForm } from './ProfileForm'

export const metadata: Metadata = {
  title: 'プロフィール | ShinCode Courses',
}

async function ProfileContent() {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  if (!claimsData?.claims) redirect('/auth/login')

  const userId = claimsData.claims.sub

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  const { data: user } = await supabase.auth.getUser()
  const email = user?.user?.email ?? ''

  return (
    <>
      {/* Account info */}
      <div className="mb-6 rounded border border-[#d1d7dc] bg-white p-6">
        <h2 className="mb-4 font-bold text-[#1c1d1f]">アカウント情報</h2>
        <dl className="space-y-3">
          <div className="flex items-center gap-4">
            <dt className="w-32 shrink-0 text-sm text-[#6a6f73]">メールアドレス</dt>
            <dd className="text-sm font-medium text-[#1c1d1f]">{email}</dd>
          </div>
          <div className="flex items-center gap-4">
            <dt className="w-32 shrink-0 text-sm text-[#6a6f73]">権限</dt>
            <dd>
              <span className={`rounded px-2 py-0.5 text-xs font-bold ${
                profile?.role === 'admin'
                  ? 'bg-[#a435f0]/10 text-[#a435f0]'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {profile?.role === 'admin' ? '管理者' : '一般ユーザー'}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      {/* Edit form */}
      <div className="rounded border border-[#d1d7dc] bg-white p-6">
        <h2 className="mb-4 font-bold text-[#1c1d1f]">プロフィール編集</h2>
        <ProfileForm displayName={profile?.display_name ?? ''} />
      </div>
    </>
  )
}

export default function ProfilePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold text-[#1c1d1f]">プロフィール</h1>
      <Suspense fallback={<div className="py-16 text-center text-[#6a6f73]">読み込み中...</div>}>
        <ProfileContent />
      </Suspense>
    </main>
  )
}
