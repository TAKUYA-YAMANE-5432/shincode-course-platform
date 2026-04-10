import { createClient } from '@supabase/supabase-js'

// Cookie 不要の公開クライアント（'use cache' 内で使用）
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}
