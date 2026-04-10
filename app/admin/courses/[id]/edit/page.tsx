import { Suspense } from 'react'
import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getCourse, getSectionsWithChapters } from '@/lib/courses'
import { CourseForm } from '../../CourseForm'
import { AdminNav } from '@/components/AdminNav'

type Props = { params: Promise<{ id: string }> }

export const metadata: Metadata = { title: '講座編集 | ShinCode Courses' }

async function EditCourseContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.claims.sub)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  const [course, sections] = await Promise.all([getCourse(id), getSectionsWithChapters(id)])
  if (!course) notFound()

  return (
    <>
      <h1 className="mb-8 text-2xl font-bold text-[#1c1d1f]">講座編集</h1>
      <CourseForm course={course} sections={sections} />
    </>
  )
}

export default function EditCoursePage({ params }: Props) {
  return (
    <>
      <AdminNav current="/admin/courses" />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Suspense fallback={<div className="py-16 text-center text-[#6a6f73]">読み込み中...</div>}>
          <EditCourseContent params={params} />
        </Suspense>
      </main>
    </>
  )
}
