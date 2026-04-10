'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signUp, signInWithGoogle } from '@/app/auth/actions'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
      <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
    </svg>
  )
}

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signUp, null)

  if (state?.success) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-[#f7f9fa] px-4 py-12">
        <div className="w-full max-w-sm rounded border border-[#d1d7dc] bg-white px-8 py-10 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#a435f0]/10">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#a435f0" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-bold text-[#1c1d1f]">確認メールを送信しました</h2>
          <p className="mb-6 text-sm leading-relaxed text-[#6a6f73]">
            登録メールアドレスに確認メールをお送りしました。
            メール内のリンクをクリックして登録を完了してください。
          </p>
          <Link
            href="/auth/login"
            className="inline-block rounded bg-[#a435f0] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#8710d8]"
          >
            ログインページへ
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-[#f7f9fa] px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#a435f0]">
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <path d="M1 11L4.5 3.5L8 9L10 6L13 11H1Z" fill="white" />
              </svg>
            </div>
            <span className="text-base font-bold text-[#1c1d1f]">ShinCode</span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded border border-[#d1d7dc] bg-white px-8 py-7 shadow-sm">
          <h1 className="mb-1 text-2xl font-bold text-[#1c1d1f]">無料登録</h1>
          <p className="mb-5 text-sm text-[#6a6f73]">登録は無料。いますぐ学習を始めましょう。</p>

          {/* Google */}
          <form action={signInWithGoogle} className="mb-4">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2.5 rounded border border-[#1c1d1f] bg-white py-2.5 text-sm font-bold text-[#1c1d1f] transition-colors hover:bg-[#f7f9fa]"
            >
              <GoogleIcon />
              Googleで登録
            </button>
          </form>

          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#d1d7dc]" />
            <span className="text-xs text-[#6a6f73]">または</span>
            <div className="h-px flex-1 bg-[#d1d7dc]" />
          </div>

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

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-bold text-[#1c1d1f]">
                パスワード
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
              {isPending ? '登録中...' : '無料アカウントを作成'}
            </button>
          </form>

          <p className="mt-4 text-center text-xs leading-relaxed text-[#6a6f73]">
            登録することで
            <span className="font-medium text-[#1c1d1f]">利用規約</span>と
            <span className="font-medium text-[#1c1d1f]">プライバシーポリシー</span>
            に同意したものとみなされます。
          </p>
        </div>

        {/* Login link */}
        <div className="mt-5 rounded border border-[#d1d7dc] bg-white px-8 py-4 text-center text-sm text-[#6a6f73]">
          すでにアカウントをお持ちの方は{' '}
          <Link href="/auth/login" className="font-bold text-[#a435f0] hover:text-[#8710d8] hover:underline">
            ログイン
          </Link>
        </div>
      </div>
    </div>
  )
}
