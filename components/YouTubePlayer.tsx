'use client'

import { useState } from 'react'
import Image from 'next/image'

type Props = {
  videoId: string
  title?: string
}

export function YouTubePlayer({ videoId, title }: Props) {
  const [activated, setActivated] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

  if (!activated) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
        <Image
          src={thumbnailUrl}
          alt={title ?? '講座動画のサムネイル'}
          fill
          priority
          className="object-cover"
        />
        {/* dark overlay */}
        <div className="absolute inset-0 bg-black/20" />
        {/* play button */}
        <button
          onClick={() => setActivated(true)}
          aria-label="動画を再生する"
          className="absolute inset-0 flex items-center justify-center group"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ff0000] shadow-lg transition-transform group-hover:scale-110">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="white"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      </div>
    )
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gray-800" />
      )}
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1`}
        title={title ?? '講座動画'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}

export function LoginPrompt() {
  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#d1d7dc] bg-[#f7f9fa]">
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#9e9ea0"
        strokeWidth="1.5"
        className="mb-4"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
      <p className="mb-1 font-bold text-[#1c1d1f]">動画を視聴するにはログインが必要です</p>
      <p className="mb-4 text-sm text-[#6a6f73]">無料アカウントを作成するとすべての講座が視聴できます</p>
      <div className="flex gap-3">
        <a
          href="/auth/login"
          className="rounded border border-[#1c1d1f] px-4 py-2 text-sm font-bold text-[#1c1d1f] transition-colors hover:bg-[#f7f9fa]"
        >
          ログイン
        </a>
        <a
          href="/auth/signup"
          className="rounded bg-[#a435f0] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#8710d8]"
        >
          無料登録
        </a>
      </div>
    </div>
  )
}
