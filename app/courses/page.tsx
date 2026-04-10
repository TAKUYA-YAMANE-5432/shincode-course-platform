import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getCourses } from '@/lib/courses'
import { CourseList } from '@/components/CourseList'
import { CategoryFilter } from '@/components/CategoryFilter'

export const metadata: Metadata = {
  title: '講座一覧 | ShinCode Courses',
  description: 'プログラミング講座の一覧です。Web開発・TypeScript・React・Next.js など多数の講座を無料で学べます。',
}

type Props = { searchParams: Promise<{ category?: string }> }

async function CourseListSection({ searchParams }: Props) {
  const { category } = await searchParams
  const courses = await getCourses()
  const count = category
    ? courses.filter((c) => c.category === category).length
    : courses.length

  return (
    <>
      <p className="text-sm text-[#6a6f73]">
        {category ? `「${category}」: ${count} 件` : `全 ${count} 件の講座`}
      </p>
      <CourseList courses={courses} category={category} />
    </>
  )
}

function CourseCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-video rounded bg-gray-200" />
      <div className="mt-3 space-y-2">
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-3 w-1/2 rounded bg-gray-200" />
        <div className="h-5 w-16 rounded bg-gray-200" />
      </div>
    </div>
  )
}

function CoursesListSkeleton() {
  return (
    <>
      <div className="mb-2 h-4 w-24 animate-pulse rounded bg-gray-200" />
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    </>
  )
}

export default function CoursesPage({ searchParams }: Props) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1c1d1f]">講座一覧</h1>
      </div>

      {/* CategoryFilter は useSearchParams() を使うため Suspense でラップ */}
      <Suspense fallback={<div className="h-10" />}>
        <CategoryFilter />
      </Suspense>

      {/* searchParams の await を Suspense 内で処理しサーバー側でフィルタ */}
      <Suspense fallback={<CoursesListSkeleton />}>
        <CourseListSection searchParams={searchParams} />
      </Suspense>
    </main>
  )
}
