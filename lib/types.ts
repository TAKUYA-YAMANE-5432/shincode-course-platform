export type Course = {
  id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  category: string | null
  tags: string[]
  published: boolean
  created_at: string
}

export type Section = {
  id: string
  course_id: string
  title: string
  order: number
  created_at: string
}

export type Chapter = {
  id: string
  course_id: string
  section_id: string | null
  title: string
  youtube_video_id: string
  order: number
  created_at: string
}

export type SectionWithChapters = Section & { chapters: Chapter[] }

export type Profile = {
  id: string
  display_name: string | null
  role: string
  created_at: string
}
