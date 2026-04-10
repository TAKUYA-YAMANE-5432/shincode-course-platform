import { CourseCard } from '@/components/CourseCard'
import type { Course } from '@/lib/types'

type Props = {
  courses: Course[]
  category?: string
}

export function CourseList({ courses, category }: Props) {
  const filtered = category
    ? courses.filter((c) => c.category === category)
    : courses

  if (filtered.length === 0) {
    return (
      <div className="mt-16 text-center">
        <p className="text-[#6a6f73]">
          {category
            ? `「${category}」の講座はまだありません。`
            : '講座はまだありません。'}
        </p>
      </div>
    )
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}
