'use client'

import { useActionState } from 'react'
import { updateProfile } from './actions'

export function ProfileForm({ displayName }: { displayName: string }) {
  const [state, formAction, isPending] = useActionState(updateProfile, null)

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="display_name" className="mb-1.5 block text-sm font-bold text-[#1c1d1f]">
          表示名
        </label>
        <input
          id="display_name"
          name="display_name"
          type="text"
          defaultValue={displayName}
          placeholder="表示名を入力してください"
          className="w-full rounded border border-[#9e9ea0] px-3 py-2.5 text-sm text-[#1c1d1f] placeholder-[#9e9ea0] outline-none transition focus:border-[#a435f0] focus:ring-2 focus:ring-[#a435f0]/20"
        />
      </div>

      {state?.error && (
        <div className="rounded border border-red-300 bg-red-50 px-3 py-2.5 text-sm text-red-700">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="rounded border border-green-300 bg-green-50 px-3 py-2.5 text-sm text-green-700">
          プロフィールを更新しました
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-[#a435f0] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#8710d8] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? '保存中...' : '保存する'}
      </button>
    </form>
  )
}
