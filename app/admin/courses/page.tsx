import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getAllCoursesForAdmin } from '@/lib/courses'
import { deleteCourse } from '@/app/admin/actions'
import { AdminNav } from '@/components/AdminNav'

export const metadata: Metadata = { title: '講座管理 | ShinCode Courses' }

async function AdminCoursesList() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.claims.sub)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  const courses = await getAllCoursesForAdmin()

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1c1d1f]">講座管理</h1>
        <Link
          href="/admin/courses/new"
          className="rounded bg-[#a435f0] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#8710d8]"
        >
          + 新規追加
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="rounded border border-dashed border-[#d1d7dc] py-16 text-center text-[#6a6f73]">
          講座がまだありません
        </div>
      ) : (
        <div className="overflow-hidden rounded border border-[#d1d7dc] bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-[#d1d7dc] bg-[#f7f9fa]">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-[#1c1d1f]">タイトル</th>
                <th className="hidden px-4 py-3 text-left font-bold text-[#1c1d1f] md:table-cell">カテゴリ</th>
                <th className="px-4 py-3 text-left font-bold text-[#1c1d1f]">ステータス</th>
                <th className="px-4 py-3 text-right font-bold text-[#1c1d1f]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d1d7dc]">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-[#f7f9fa]">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#1c1d1f] line-clamp-1">{course.title}</p>
                  </td>
                  <td className="hidden px-4 py-3 text-[#6a6f73] md:table-cell">
                    {course.category ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded px-2 py-0.5 text-xs font-bold ${
                      course.published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {course.published ? '公開中' : '非公開'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/courses/${course.id}/edit`}
                        className="rounded border border-[#1c1d1f] px-3 py-1 text-xs font-bold text-[#1c1d1f] transition-colors hover:bg-[#f7f9fa]"
                      >
                        編集
                      </Link>
                      <form action={deleteCourse}>
                        <input type="hidden" name="id" value={course.id} />
                        <button
                          type="submit"
                          className="rounded border border-red-300 px-3 py-1 text-xs font-bold text-red-600 transition-colors hover:bg-red-50"
                        >
                          削除
                        </button>
                      </form>
                    </div>
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

export default function AdminCoursesPage() {
  return (
    <>
      <AdminNav current="/admin/courses" />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <Suspense fallback={<div className="py-16 text-center text-[#6a6f73]">読み込み中...</div>}>
          <AdminCoursesList />
        </Suspense>
      </main>
    </>
  )
}
