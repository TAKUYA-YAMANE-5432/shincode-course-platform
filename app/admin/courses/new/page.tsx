import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { CourseForm } from '../CourseForm'
import { AdminNav } from '@/components/AdminNav'

export const metadata: Metadata = { title: '講座追加 | ShinCode Courses' }

async function NewCourseContent() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.claims.sub)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  return (
    <>
      <h1 className="mb-8 text-2xl font-bold text-[#1c1d1f]">新規講座追加</h1>
      <CourseForm />
    </>
  )
}

export default function NewCoursePage() {
  return (
    <>
      <AdminNav current="/admin/courses" />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Suspense fallback={<div className="py-16 text-center text-[#6a6f73]">読み込み中...</div>}>
          <NewCourseContent />
        </Suspense>
      </main>
    </>
  )
}
