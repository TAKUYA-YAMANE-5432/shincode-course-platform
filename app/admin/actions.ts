'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'

// ─── バリデーションスキーマ ───────────────────────────────────────

const ALLOWED_CATEGORIES = ['Web開発', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'バックエンド'] as const

const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/

// サムネイル URL: https:// のみ許可
const thumbnailUrlSchema = z
  .string()
  .max(500, 'サムネイル URL は 500 文字以内で入力してください')
  .refine((v) => v === '' || v.startsWith('https://'), {
    message: 'サムネイル URL は https:// で始まる必要があります',
  })
  .optional()
  .transform((v) => v ?? '')

const chapterSchema = z.object({
  title: z.string().min(1, 'チャプタータイトルは必須です').max(200, 'チャプタータイトルは 200 文字以内で入力してください'),
  youtube_video_id: z
    .string()
    .regex(YOUTUBE_ID_REGEX, 'YouTube 動画 ID は半角英数字・ハイフン・アンダースコアの 11 文字で入力してください'),
})

const sectionSchema = z.object({
  title: z.string().min(1, 'セクションタイトルは必須です').max(200, 'セクションタイトルは 200 文字以内で入力してください'),
  chapters: z.array(chapterSchema).max(100, '1 セクションに登録できる動画は 100 件までです'),
})

const courseSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(200, 'タイトルは 200 文字以内で入力してください'),
  description: z.string().max(5000, '概要は 5,000 文字以内で入力してください').optional().transform((v) => v ?? ''),
  thumbnail_url: thumbnailUrlSchema,
  category: z.enum(['', ...ALLOWED_CATEGORIES]).optional().transform((v) => v ?? ''),
  tags: z.array(
    z.string().max(50, 'タグは 50 文字以内で入力してください')
  ).max(20, 'タグは 20 個まで登録できます'),
  published: z.boolean(),
  sections: z.array(sectionSchema).min(1, 'セクションは 1 つ以上必要です').max(50, 'セクションは 50 個まで登録できます'),
})

// ─── ヘルパー ──────────────────────────────────────────────────────

async function requireAdmin() {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  if (!claimsData?.claims) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', claimsData.claims.sub)
    .single()

  if (profile?.role !== 'admin') redirect('/')
  return supabase
}

type ChapterInput = { title: string; youtube_video_id: string; order: number }

function parseSections(formData: FormData): { title: string; chapters: ChapterInput[] }[] {
  const sections: { title: string; chapters: ChapterInput[] }[] = []
  let si = 0
  while (formData.get(`sections[${si}][title]`) !== null) {
    const sTitle = formData.get(`sections[${si}][title]`) as string
    const chapters: ChapterInput[] = []
    let ci = 0
    while (formData.get(`sections[${si}][chapters][${ci}][title]`) !== null) {
      const chTitle = formData.get(`sections[${si}][chapters][${ci}][title]`) as string
      const chVideoId = formData.get(`sections[${si}][chapters][${ci}][youtube_video_id]`) as string
      if (chTitle && chVideoId) {
        chapters.push({ title: chTitle, youtube_video_id: chVideoId, order: ci + 1 })
      }
      ci++
    }
    sections.push({ title: sTitle, chapters })
    si++
  }
  return sections
}

function parseCourseFormData(formData: FormData) {
  const tagsRaw = formData.get('tags') as string
  return {
    title: formData.get('title') as string,
    description: (formData.get('description') as string) ?? '',
    thumbnail_url: (formData.get('thumbnail_url') as string) ?? '',
    category: (formData.get('category') as string) ?? '',
    tags: tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : [],
    published: formData.get('published') === 'on',
    sections: parseSections(formData),
  }
}

// ─── Server Actions ────────────────────────────────────────────────

export async function createCourse(
  prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await requireAdmin()

  const parsed = courseSchema.safeParse(parseCourseFormData(formData))
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { title, description, thumbnail_url, category, tags, published, sections } = parsed.data

  const { data: course, error } = await supabase
    .from('courses')
    .insert({ title, description, thumbnail_url: thumbnail_url || null, category: category || null, tags, published })
    .select('id')
    .single()

  if (error || !course) return { error: '講座の作成に失敗しました' }

  for (let si = 0; si < sections.length; si++) {
    const { title: sTitle, chapters } = sections[si]

    const { data: section } = await supabase
      .from('sections')
      .insert({ course_id: course.id, title: sTitle, order: si + 1 })
      .select('id')
      .single()

    if (section && chapters.length > 0) {
      await supabase
        .from('chapters')
        .insert(
          chapters.map((ch) => ({ ...ch, course_id: course.id, section_id: section.id }))
        )
    }
  }

  updateTag('courses')
  redirect('/admin/courses')
}

export async function updateCourse(
  prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await requireAdmin()

  const id = formData.get('id') as string
  if (!id || typeof id !== 'string' || id.length > 100) {
    return { error: '無効なリクエストです' }
  }

  const parsed = courseSchema.safeParse(parseCourseFormData(formData))
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { title, description, thumbnail_url, category, tags, published, sections } = parsed.data

  const { error } = await supabase
    .from('courses')
    .update({ title, description, thumbnail_url: thumbnail_url || null, category: category || null, tags, published })
    .eq('id', id)

  if (error) return { error: '更新に失敗しました' }

  await supabase.from('chapters').delete().eq('course_id', id)
  await supabase.from('sections').delete().eq('course_id', id)

  for (let si = 0; si < sections.length; si++) {
    const { title: sTitle, chapters } = sections[si]

    const { data: section } = await supabase
      .from('sections')
      .insert({ course_id: id, title: sTitle, order: si + 1 })
      .select('id')
      .single()

    if (section && chapters.length > 0) {
      await supabase
        .from('chapters')
        .insert(
          chapters.map((ch) => ({ ...ch, course_id: id, section_id: section.id }))
        )
    }
  }

  updateTag('courses')
  redirect('/admin/courses')
}

export async function deleteCourse(formData: FormData) {
  const supabase = await requireAdmin()
  const id = formData.get('id') as string
  if (!id || typeof id !== 'string' || id.length > 100) return
  await supabase.from('courses').delete().eq('id', id)
  updateTag('courses')
  redirect('/admin/courses')
}
