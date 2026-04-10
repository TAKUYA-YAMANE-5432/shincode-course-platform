import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { createPublicClient } from '@/lib/supabase/public'
import { AdminNav } from '@/components/AdminNav'

export const metadata: Metadata = { title: '管理者ダッシュボード | ShinCode Courses' }

async function DashboardContent() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.claims.sub)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  const publicClient = createPublicClient()
  const [
    { data: coursesData },
    { count: totalSections },
    { count: totalVideos },
    { count: totalUsers },
  ] = await Promise.all([
    publicClient.from('courses').select('published'),
    publicClient.from('sections').select('*', { count: 'exact', head: true }),
    publicClient.from('chapters').select('*', { count: 'exact', head: true }),
    publicClient.from('profiles').select('*', { count: 'exact', head: true }),
  ])

  const totalCourses = coursesData?.length ?? 0
  const publishedCourses = coursesData?.filter((c) => c.published).length ?? 0

  const stats = [
    {
      label: '総講座数',
      value: totalCourses ?? 0,
      sub: `公開中 ${publishedCourses ?? 0} / 非公開 ${(totalCourses ?? 0) - (publishedCourses ?? 0)}`,
      color: 'text-[#a435f0]',
    },
    {
      label: 'セクション数',
      value: totalSections ?? 0,
      sub: '全講座合計',
      color: 'text-blue-600',
    },
    {
      label: '動画数',
      value: totalVideos ?? 0,
      sub: '全チャプター合計',
      color: 'text-green-600',
    },
    {
      label: '登録ユーザー数',
      value: totalUsers ?? 0,
      sub: '全ユーザー',
      color: 'text-orange-500',
    },
  ]

  const quickActions = [
    {
      href: '/admin/courses',
      label: '講座管理',
      desc: '講座の一覧・編集・削除',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      href: '/admin/courses/new',
      label: '新規講座追加',
      desc: '講座を新しく作成する',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      href: '/admin/videos',
      label: '動画管理',
      desc: '全動画の一覧・確認',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ]

  return (
    <>
      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded border border-[#d1d7dc] bg-white p-5">
            <p className="text-sm text-[#6a6f73]">{stat.label}</p>
            <p className={`mt-1 text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="mt-1 text-xs text-[#9e9ea0]">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="mb-4 text-lg font-bold text-[#1c1d1f]">クイックアクション</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-start gap-4 rounded border border-[#d1d7dc] bg-white p-5 transition-colors hover:border-[#a435f0] hover:bg-[#a435f0]/5"
          >
            <div className="shrink-0 text-[#a435f0]">{action.icon}</div>
            <div>
              <p className="font-bold text-[#1c1d1f]">{action.label}</p>
              <p className="mt-0.5 text-sm text-[#6a6f73]">{action.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}

export default function AdminDashboardPage() {
  return (
    <>
      <AdminNav current="/admin" />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-8 text-2xl font-bold text-[#1c1d1f]">管理者ダッシュボード</h1>
        <Suspense fallback={
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded border border-[#d1d7dc] bg-gray-100" />
            ))}
          </div>
        }>
          <DashboardContent />
        </Suspense>
      </main>
    </>
  )
}
