'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const displayNameSchema = z
  .string()
  .max(100, '表示名は 100 文字以内で入力してください')
  .transform((v) => v.trim())

export async function updateProfile(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect('/auth/login')

  const parsed = displayNameSchema.safeParse(formData.get('display_name'))
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const userId = data.claims.sub
  const { error } = await supabase
    .from('profiles')
    .update({ display_name: parsed.data })
    .eq('id', userId)

  if (error) return { error: 'プロフィールの更新に失敗しました' }
  return { success: true }
}
