import { Suspense } from 'react'
import Link from 'next/link'
import { ResetPasswordForm } from './ResetPasswordForm'
import { UpdatePasswordForm } from './UpdatePasswordForm'

async function ResetPasswordContent({
  searchParams,
}: {
  searchParams: Promise<{ step?: string }>
}) {
  const { step } = await searchParams
  return step === 'update' ? <UpdatePasswordForm /> : <ResetPasswordForm />
}

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ step?: string }>
}) {
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
          <Suspense fallback={<div className="py-4 text-center text-sm text-[#6a6f73]">読み込み中...</div>}>
            <ResetPasswordContent searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
