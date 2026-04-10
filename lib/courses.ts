import { cacheTag, cacheLife } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/public'
import type { Course, Chapter, Section, SectionWithChapters } from '@/lib/types'

export async function getCourses(): Promise<Course[]> {
  'use cache'
  cacheTag('courses')
  cacheLife('hours')

  const supabase = createPublicClient()
  const { data } = await supabase
    .from('courses')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  return (data as Course[]) ?? []
}

export async function getCourse(id: string): Promise<Course | null> {
  'use cache'
  cacheTag('courses')
  cacheLife('hours')

  const supabase = createPublicClient()
  const { data } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single()

  return (data as Course) ?? null
}

export async function getChapters(courseId: string): Promise<Chapter[]> {
  'use cache'
  cacheTag('courses')
  cacheLife('hours')

  const supabase = createPublicClient()
  const { data } = await supabase
    .from('chapters')
    .select('*')
    .eq('course_id', courseId)
    .order('order', { ascending: true })

  return (data as Chapter[]) ?? []
}

export async function getSectionsWithChapters(courseId: string): Promise<SectionWithChapters[]> {
  'use cache'
  cacheTag('courses')
  cacheLife('hours')

  const supabase = createPublicClient()
  const [{ data: sections }, { data: chapters }] = await Promise.all([
    supabase
      .from('sections')
      .select('*')
      .eq('course_id', courseId)
      .order('order', { ascending: true }),
    supabase
      .from('chapters')
      .select('*')
      .eq('course_id', courseId)
      .order('order', { ascending: true }),
  ])

  const chaptersBySectionId = new Map<string, Chapter[]>()
  for (const ch of (chapters ?? []) as Chapter[]) {
    if (!ch.section_id) continue
    if (!chaptersBySectionId.has(ch.section_id)) {
      chaptersBySectionId.set(ch.section_id, [])
    }
    chaptersBySectionId.get(ch.section_id)!.push(ch)
  }

  return ((sections ?? []) as Section[]).map((s) => ({
    ...s,
    chapters: chaptersBySectionId.get(s.id) ?? [],
  }))
}

export async function getAllCoursesForAdmin(): Promise<Course[]> {
  'use cache'
  cacheTag('courses')
  cacheLife('hours')

  const supabase = createPublicClient()
  const { data } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })

  return (data as Course[]) ?? []
}

export async function getAllVideosForAdmin(): Promise<{
  chapters: Chapter[]
  courseMap: Record<string, string>
  sectionMap: Record<string, string>
}> {
  'use cache'
  cacheTag('courses')
  cacheLife('hours')

  const supabase = createPublicClient()
  const [{ data: chapters }, { data: courses }, { data: sections }] = await Promise.all([
    supabase.from('chapters').select('*').order('course_id').order('order'),
    supabase.from('courses').select('id, title'),
    supabase.from('sections').select('id, title'),
  ])

  const courseMap = Object.fromEntries(
    ((courses ?? []) as { id: string; title: string }[]).map((c) => [c.id, c.title])
  )
  const sectionMap = Object.fromEntries(
    ((sections ?? []) as { id: string; title: string }[]).map((s) => [s.id, s.title])
  )

  return { chapters: (chapters ?? []) as Chapter[], courseMap, sectionMap }
}
