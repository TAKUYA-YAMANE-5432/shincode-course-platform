import Link from 'next/link'
import Image from 'next/image'
import type { Course } from '@/lib/types'

const CATEGORY_COLORS: Record<string, string> = {
  'Web開発':     'bg-violet-100 text-violet-700',
  'TypeScript':  'bg-blue-100   text-blue-700',
  'JavaScript':  'bg-yellow-100 text-yellow-700',
  'React':       'bg-cyan-100   text-cyan-700',
  'Next.js':     'bg-gray-100   text-gray-700',
  'バックエンド': 'bg-green-100  text-green-700',
}

export function CourseCard({ course, priority = false }: { course: Course; priority?: boolean }) {
  const badgeClass =
    (course.category && CATEGORY_COLORS[course.category]) ?? 'bg-gray-100 text-gray-700'

  return (
    <Link href={`/courses/${course.id}`} className="group block">
      {/* Thumbnail */}
      <div className="relative mb-3 aspect-video overflow-hidden rounded bg-gray-200">
        {course.thumbnail_url ? (
          <Image
            src={course.thumbnail_url}
            alt={course.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-500 to-indigo-700">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white" opacity="0.8">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="space-y-1.5">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-[#1c1d1f] transition-colors group-hover:text-[#a435f0]">
          {course.title}
        </h3>
        {course.description && (
          <p className="line-clamp-2 text-xs leading-relaxed text-[#6a6f73]">
            {course.description}
          </p>
        )}
        {course.category && (
          <span className={`inline-block rounded px-2 py-0.5 text-[11px] font-semibold ${badgeClass}`}>
            {course.category}
          </span>
        )}
      </div>
    </Link>
  )
}
