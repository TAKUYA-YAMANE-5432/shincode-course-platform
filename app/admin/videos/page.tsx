import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getAllVideosForAdmin } from '@/lib/courses'
import { AdminNav } from '@/components/AdminNav'
import type { Chapter } from '@/lib/types'

export const metadata: Metadata = { title: '動画管理 | ShinCode Courses' }

type VideoRow = Chapter & {
  courseName: string
  courseId: string
  sectionName: string
}

async function VideoList() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.claims.sub)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  const { chapters, courseMap, sectionMap } = await getAllVideosForAdmin()

  const videos: VideoRow[] = chapters.map((ch) => ({
    ...ch,
    courseName: courseMap[ch.course_id] ?? '—',
    courseId: ch.course_id,
    sectionName: ch.section_id ? (sectionMap[ch.section_id] ?? '—') : '—',
  }))

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1c1d1f]">動画管理</h1>
          <p className="mt-1 text-sm text-[#6a6f73]">全 {videos.length} 件の動画</p>
        </div>
      </div>

      {videos.length === 0 ? (
        <div className="rounded border border-dashed border-[#d1d7dc] py-16 text-center text-[#6a6f73]">
          動画がまだありません
        </div>
      ) : (
        <div className="overflow-hidden rounded border border-[#d1d7dc] bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-[#d1d7dc] bg-[#f7f9fa]">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-[#1c1d1f]">動画タイトル</th>
                <th className="hidden px-4 py-3 text-left font-bold text-[#1c1d1f] md:table-cell">講座</th>
                <th className="hidden px-4 py-3 text-left font-bold text-[#1c1d1f] lg:table-cell">セクション</th>
                <th className="px-4 py-3 text-left font-bold text-[#1c1d1f]">YouTube ID</th>
                <th className="px-4 py-3 text-right font-bold text-[#1c1d1f]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d1d7dc]">
              {videos.map((video) => (
                <tr key={video.id} className="hover:bg-[#f7f9fa]">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#1c1d1f] line-clamp-1">{video.title}</p>
                    <p className="mt-0.5 text-xs text-[#9e9ea0]">#{video.order}</p>
                  </td>
                  <td className="hidden px-4 py-3 text-[#6a6f73] md:table-cell line-clamp-1">
                    {video.courseName}
                  </td>
                  <td className="hidden px-4 py-3 text-[#6a6f73] lg:table-cell">
                    {video.sectionName}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`https://www.youtube.com/watch?v=${video.youtube_video_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-[#a435f0] hover:underline"
                    >
                      {video.youtube_video_id}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/courses/${video.courseId}/edit`}
                      className="rounded border border-[#1c1d1f] px-3 py-1 text-xs font-bold text-[#1c1d1f] transition-colors hover:bg-[#f7f9fa]"
                    >
                      講座を編集
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default function AdminVideosPage() {
  return (
    <>
      <AdminNav current="/admin/videos" />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <Suspense fallback={<div className="py-16 text-center text-[#6a6f73]">読み込み中...</div>}>
          <VideoList />
        </Suspense>
      </main>
    </>
  )
}
