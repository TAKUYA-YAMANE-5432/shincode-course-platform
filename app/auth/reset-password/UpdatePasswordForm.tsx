'use client'

import { useActionState } from 'react'
import { updatePassword } from '@/app/auth/actions'

export function UpdatePasswordForm() {
  const [state, formAction, isPending] = useActionState(updatePassword, null)

  return (
    <>
      <h1 className="mb-1 text-2xl font-bold text-[#1c1d1f]">新しいパスワードを設定</h1>
      <p className="mb-5 text-sm text-[#6a6f73]">新しいパスワードを入力してください。</p>

      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-bold text-[#1c1d1f]">
            新しいパスワード
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="w-full rounded border border-[#9e9ea0] px-3 py-2.5 text-sm text-[#1c1d1f] placeholder-[#9e9ea0] outline-none transition focus:border-[#a435f0] focus:ring-2 focus:ring-[#a435f0]/20"
            placeholder="8文字以上のパスワード"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-bold text-[#1c1d1f]">
            パスワード（確認）
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            className="w-full rounded border border-[#9e9ea0] px-3 py-2.5 text-sm text-[#1c1d1f] placeholder-[#9e9ea0] outline-none transition focus:border-[#a435f0] focus:ring-2 focus:ring-[#a435f0]/20"
            placeholder="もう一度入力してください"
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
          {isPending ? '更新中...' : 'パスワードを更新'}
        </button>
      </form>
    </>
  )
}
