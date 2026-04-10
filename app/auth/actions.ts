'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signUp(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'メールアドレスの形式が正しくありません' }
  }
  if (!password || password.length < 8) {
    return { error: 'パスワードは8文字以上で入力してください' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({ email, password })

  if (error) return { error: error.message }
  return { success: true }
}

export async function signIn(
  prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: 'メールアドレスまたはパスワードが正しくありません' }
  redirect('/')
}

export async function signInWithGoogle() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
    },
  })

  if (error || !data.url) redirect('/auth/login')
  redirect(data.url)
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}

export async function resetPassword(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const email = formData.get('email') as string

  if (!email) return { error: 'メールアドレスを入力してください' }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/auth/reset-password?step=update`,
  })

  if (error) return { error: error.message }
  return { success: true }
}

export async function updatePassword(
  prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (password !== confirmPassword) return { error: 'パスワードが一致しません' }
  if (password.length < 8) return { error: 'パスワードは8文字以上で入力してください' }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) return { error: error.message }
  redirect('/')
}
