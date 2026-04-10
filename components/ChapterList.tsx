'use client'

import type { Chapter, SectionWithChapters } from '@/lib/types'

type Props = {
  sections: SectionWithChapters[]
  activeId: string
  onSelect: (chapter: Chapter) => void
}

export function ChapterList({ sections, activeId, onSelect }: Props) {
  return (
    <div className="divide-y divide-[#d1d7dc] rounded border border-[#d1d7dc]">
      {sections.map((section) => (
        <div key={section.id}>
          {/* Section header */}
          <div className="bg-[#f7f9fa] px-4 py-2">
            <p className="text-xs font-bold text-[#6a6f73] uppercase tracking-wide">
              {section.title}
            </p>
          </div>

          {/* Chapters */}
          {section.chapters.map((chapter) => {
            const isActive = chapter.id === activeId
            return (
              <button
                key={chapter.id}
                onClick={() => onSelect(chapter)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                  isActive
                    ? 'bg-[#a435f0]/5 text-[#a435f0]'
                    : 'bg-white text-[#1c1d1f] hover:bg-[#f7f9fa]'
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    isActive
                      ? 'bg-[#a435f0] text-white'
                      : 'bg-[#f7f9fa] text-[#6a6f73]'
                  }`}
                >
                  {chapter.order}
                </span>
                <span className="line-clamp-2 text-sm font-medium leading-snug">
                  {chapter.title}
                </span>
                {isActive && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="ml-auto shrink-0 text-[#a435f0]"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
