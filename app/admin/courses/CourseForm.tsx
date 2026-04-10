'use client'

import { useState, useActionState } from 'react'
import Link from 'next/link'
import { createCourse, updateCourse } from '@/app/admin/actions'
import type { Course, SectionWithChapters } from '@/lib/types'

const CATEGORIES = ['Web開発', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'バックエンド']

type ChapterRow = { title: string; youtube_video_id: string }
type SectionRow = { title: string; chapters: ChapterRow[] }

type Props = {
  course?: Course
  sections?: SectionWithChapters[]
}

const DEFAULT_SECTION: SectionRow = { title: 'セクション1', chapters: [{ title: '', youtube_video_id: '' }] }

export function CourseForm({ course, sections: initialSections }: Props) {
  const action = course ? updateCourse : createCourse
  const [state, formAction, isPending] = useActionState(action, null)

  const [sectionRows, setSectionRows] = useState<SectionRow[]>(() => {
    if (initialSections && initialSections.length > 0) {
      return initialSections.map((s) => ({
        title: s.title,
        chapters: s.chapters.length > 0
          ? s.chapters.map((ch) => ({ title: ch.title, youtube_video_id: ch.youtube_video_id }))
          : [{ title: '', youtube_video_id: '' }],
      }))
    }
    return [DEFAULT_SECTION]
  })

  // Section operations
  function addSection() {
    setSectionRows((prev) => [
      ...prev,
      { title: `セクション${prev.length + 1}`, chapters: [{ title: '', youtube_video_id: '' }] },
    ])
  }

  function removeSection(si: number) {
    setSectionRows((prev) => prev.filter((_, i) => i !== si))
  }

  function updateSectionTitle(si: number, value: string) {
    setSectionRows((prev) => prev.map((s, i) => (i === si ? { ...s, title: value } : s)))
  }

  // Chapter operations
  function addChapter(si: number) {
    setSectionRows((prev) =>
      prev.map((s, i) =>
        i === si ? { ...s, chapters: [...s.chapters, { title: '', youtube_video_id: '' }] } : s
      )
    )
  }

  function removeChapter(si: number, ci: number) {
    setSectionRows((prev) =>
      prev.map((s, i) =>
        i === si ? { ...s, chapters: s.chapters.filter((_, j) => j !== ci) } : s
      )
    )
  }

  function updateChapter(si: number, ci: number, field: keyof ChapterRow, value: string) {
    setSectionRows((prev) =>
      prev.map((s, i) =>
        i === si
          ? { ...s, chapters: s.chapters.map((ch, j) => (j === ci ? { ...ch, [field]: value } : ch)) }
          : s
      )
    )
  }

  const inputClass =
    'w-full rounded border border-[#9e9ea0] px-3 py-2.5 text-sm text-[#1c1d1f] placeholder-[#9e9ea0] outline-none transition focus:border-[#a435f0] focus:ring-2 focus:ring-[#a435f0]/20'
  const labelClass = 'mb-1.5 block text-sm font-bold text-[#1c1d1f]'

  return (
    <form action={formAction} className="space-y-6">
      {course && <input type="hidden" name="id" value={course.id} />}

      {/* Basic info */}
      <div className="rounded border border-[#d1d7dc] bg-white p-6 space-y-4">
        <h2 className="font-bold text-[#1c1d1f]">基本情報</h2>

        <div>
          <label className={labelClass}>タイトル *</label>
          <input name="title" type="text" required defaultValue={course?.title} placeholder="講座タイトル" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>概要</label>
          <textarea
            name="description"
            rows={4}
            defaultValue={course?.description ?? ''}
            placeholder="講座の概要を入力してください"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>サムネイル URL</label>
          <input name="thumbnail_url" type="url" defaultValue={course?.thumbnail_url ?? ''} placeholder="https://..." className={inputClass} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>カテゴリ</label>
            <select name="category" defaultValue={course?.category ?? ''} className={inputClass}>
              <option value="">選択してください</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>タグ（カンマ区切り）</label>
            <input name="tags" type="text" defaultValue={course?.tags?.join(', ') ?? ''} placeholder="React, TypeScript, ..." className={inputClass} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            id="published"
            name="published"
            type="checkbox"
            defaultChecked={course?.published ?? false}
            className="h-4 w-4 rounded border-[#9e9ea0] accent-[#a435f0]"
          />
          <label htmlFor="published" className="text-sm font-medium text-[#1c1d1f]">
            公開する
          </label>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sectionRows.map((section, si) => (
          <div key={si} className="rounded border border-[#d1d7dc] bg-white p-6">
            {/* Section header */}
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#a435f0] text-xs font-bold text-white">
                {si + 1}
              </span>
              <input
                name={`sections[${si}][title]`}
                type="text"
                value={section.title}
                onChange={(e) => updateSectionTitle(si, e.target.value)}
                placeholder="セクションタイトル"
                className="flex-1 rounded border border-[#9e9ea0] px-3 py-2 text-sm font-bold text-[#1c1d1f] outline-none transition focus:border-[#a435f0] focus:ring-2 focus:ring-[#a435f0]/20"
              />
              {sectionRows.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSection(si)}
                  className="rounded border border-red-200 px-3 py-2 text-xs font-bold text-red-500 transition-colors hover:bg-red-50"
                >
                  セクション削除
                </button>
              )}
            </div>

            {/* Chapters */}
            <div className="mb-3 space-y-2 pl-10">
              {section.chapters.map((ch, ci) => (
                <div key={ci} className="flex items-start gap-2">
                  <span className="mt-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f7f9fa] text-xs font-bold text-[#6a6f73]">
                    {ci + 1}
                  </span>
                  <div className="flex-1 grid gap-2 sm:grid-cols-2">
                    <input
                      name={`sections[${si}][chapters][${ci}][title]`}
                      type="text"
                      value={ch.title}
                      onChange={(e) => updateChapter(si, ci, 'title', e.target.value)}
                      placeholder="動画タイトル"
                      className={inputClass}
                    />
                    <input
                      name={`sections[${si}][chapters][${ci}][youtube_video_id]`}
                      type="text"
                      value={ch.youtube_video_id}
                      onChange={(e) => updateChapter(si, ci, 'youtube_video_id', e.target.value)}
                      placeholder="YouTube 動画 ID（例: dS9L2qJa05s）"
                      className={inputClass}
                    />
                  </div>
                  {section.chapters.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeChapter(si, ci)}
                      className="mt-2.5 rounded border border-red-200 p-1.5 text-red-400 transition-colors hover:bg-red-50"
                      aria-label="削除"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="pl-10">
              <button
                type="button"
                onClick={() => addChapter(si)}
                className="text-xs font-bold text-[#a435f0] hover:underline"
              >
                + 動画を追加
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addSection}
          className="w-full rounded border border-dashed border-[#a435f0] py-3 text-sm font-bold text-[#a435f0] transition-colors hover:bg-[#a435f0]/5"
        >
          + セクションを追加
        </button>
      </div>

      {state?.error && (
        <div className="rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-[#a435f0] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#8710d8] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? '保存中...' : course ? '更新する' : '作成する'}
        </button>
        <Link
          href="/admin/courses"
          className="rounded border border-[#1c1d1f] px-6 py-2.5 text-sm font-bold text-[#1c1d1f] transition-colors hover:bg-[#f7f9fa]"
        >
          キャンセル
        </Link>
      </div>
    </form>
  )
}
