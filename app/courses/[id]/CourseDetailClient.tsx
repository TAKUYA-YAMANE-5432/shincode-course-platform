'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { YouTubePlayer, LoginPrompt } from '@/components/YouTubePlayer'
import { ChapterList } from '@/components/ChapterList'
import type { Course, Chapter, SectionWithChapters } from '@/lib/types'

const CATEGORY_COLORS: Record<string, string> = {
  'Web開発':     'bg-violet-100 text-violet-700',
  'TypeScript':  'bg-blue-100   text-blue-700',
  'JavaScript':  'bg-yellow-100 text-yellow-700',
  'React':       'bg-cyan-100   text-cyan-700',
  'Next.js':     'bg-gray-100   text-gray-700',
  'バックエンド': 'bg-green-100  text-green-700',
}

type Props = {
  course: Course
  sections: SectionWithChapters[]
  isAuthenticated: boolean
}

export function CourseDetailClient({ course, sections, isAuthenticated }: Props) {
  const firstChapter = sections[0]?.chapters[0] ?? null
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(firstChapter)

  const totalChapters = sections.reduce((sum, s) => sum + s.chapters.length, 0)

  return (
    <main className="bg-[#f7f9fa]">
      {/* Hero bar */}
      <div className="border-b border-[#d1d7dc] bg-[#1c1d1f] px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-2 flex items-center gap-2 text-xs text-[#9e9ea0]">
            <Link href="/courses" className="hover:text-white">講座一覧</Link>
            <span>/</span>
            <span className="text-white">{course.title}</span>
          </div>
          <h1 className="mb-3 text-xl font-bold text-white md:text-2xl">{course.title}</h1>
          <div className="flex flex-wrap items-center gap-3">
            {course.category && (
              <span className={`rounded px-2 py-0.5 text-xs font-semibold ${CATEGORY_COLORS[course.category] ?? 'bg-gray-100 text-gray-700'}`}>
                {course.category}
              </span>
            )}
            {course.tags.map((tag) => (
              <span key={tag} className="rounded bg-white/10 px-2 py-0.5 text-xs text-[#cec0fc]">
                {tag}
              </span>
            ))}
            <span className="text-xs text-[#9e9ea0]">
              {sections.length} セクション・{totalChapters} 動画
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Player */}
            {isAuthenticated && activeChapter ? (
              <YouTubePlayer
                videoId={activeChapter.youtube_video_id}
                title={activeChapter.title}
              />
            ) : (
              <LoginPrompt />
            )}

            {/* Active chapter title */}
            {isAuthenticated && activeChapter && (
              <div className="rounded border border-[#d1d7dc] bg-white p-4">
                <p className="text-xs text-[#6a6f73]">再生中</p>
                <p className="mt-1 font-bold text-[#1c1d1f]">{activeChapter.title}</p>
              </div>
            )}

            {/* Description */}
            <div className="rounded border border-[#d1d7dc] bg-white p-6">
              <h2 className="mb-3 font-bold text-[#1c1d1f]">講座について</h2>
              <p className="text-sm leading-relaxed text-[#6a6f73]">
                {course.description ?? '説明はありません。'}
              </p>
            </div>

            {/* Thumbnail (non-auth) */}
            {!isAuthenticated && course.thumbnail_url && (
              <div className="relative aspect-video overflow-hidden rounded">
                <Image
                  src={course.thumbnail_url}
                  alt={course.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded border border-[#d1d7dc] bg-white p-4">
              <h2 className="mb-3 font-bold text-[#1c1d1f]">
                コンテンツ
                <span className="ml-2 text-sm font-normal text-[#6a6f73]">
                  ({sections.length} セクション・{totalChapters} 動画)
                </span>
              </h2>
              {sections.length > 0 ? (
                <ChapterList
                  sections={sections}
                  activeId={activeChapter?.id ?? ''}
                  onSelect={setActiveChapter}
                />
              ) : (
                <p className="text-sm text-[#6a6f73]">コンテンツはまだありません。</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
