'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { resetPassword } from '@/app/auth/actions'

export function ResetPasswordForm() {
  const [state, formAction, isPending] = useActionState(resetPassword, null)

  if (state?.success) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#a435f0]/10">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#a435f0" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        <h2 className="mb-2 text-xl font-bold text-[#1c1d1f]">メールを送信しました</h2>
        <p className="mb-6 text-sm leading-relaxed text-[#6a6f73]">
          パスワードリセット用のリンクをメールでお送りしました。
          メール内のリンクから新しいパスワードを設定してください。
        </p>
        <Link
          href="/auth/login"
          className="inline-block rounded bg-[#a435f0] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#8710d8]"
        >
          ログインページへ戻る
        </Link>
      </div>
    )
  }

  return (
    <>
      <h1 className="mb-1 text-2xl font-bold text-[#1c1d1f]">パスワードをリセット</h1>
      <p className="mb-5 text-sm text-[#6a6f73]">
        登録済みのメールアドレスを入力してください。リセット用リンクをお送りします。
      </p>

      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-bold text-[#1c1d1f]">
            メールアドレス
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded border border-[#9e9ea0] px-3 py-2.5 text-sm text-[#1c1d1f] placeholder-[#9e9ea0] outline-none transition focus:border-[#a435f0] focus:ring-2 focus:ring-[#a435f0]/20"
            placeholder="メールアドレスを入力"
          />
        </div>

        {state?.error && (
          <div className="rounded border border-red-300 bg-red-50 px-3 py-2.5 text-sm text-red-700">
            {state.error}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded bg-[#a435f0] py-3 text-sm font-bold text-white transition-colors hover:bg-[#8710d8] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? '送信中...' : 'リセットリンクを送信'}
        </button>
      </form>

      <div className="mt-5 text-center">
        <Link
          href="/auth/login"
          className="text-sm font-medium text-[#a435f0] hover:text-[#8710d8] hover:underline"
        >
          ← ログインページへ戻る
        </Link>
      </div>
    </>
  )
}
