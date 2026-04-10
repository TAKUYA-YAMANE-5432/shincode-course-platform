import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCourse, getSectionsWithChapters } from '@/lib/courses'
import { createClient } from '@/lib/supabase/server'
import { CourseDetailClient } from './CourseDetailClient'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const course = await getCourse(id)
  if (!course) return {}
  return {
    title: `${course.title} | ShinCode Courses`,
    description: course.description ?? undefined,
  }
}

async function CourseDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [course, sections, supabase] = await Promise.all([
    getCourse(id),
    getSectionsWithChapters(id),
    createClient(),
  ])

  if (!course) notFound()

  const { data } = await supabase.auth.getClaims()
  const isAuthenticated = !!data?.claims

  return (
    <CourseDetailClient
      course={course}
      sections={sections}
      isAuthenticated={isAuthenticated}
    />
  )
}

export default function CourseDetailPage({ params }: Props) {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-2/3 rounded bg-gray-200" />
          <div className="h-4 w-1/2 rounded bg-gray-200" />
          <div className="aspect-video w-full rounded bg-gray-200" />
        </div>
      </div>
    }>
      <CourseDetailContent params={params} />
    </Suspense>
  )
}
