'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'

const CATEGORIES = ['Web開発', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'バックエンド']

export function CategoryFilter() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const current = searchParams.get('category') ?? ''

  function select(cat: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (cat) params.set('category', cat)
    else params.delete('category')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const base = 'rounded border px-3 py-1.5 text-sm font-medium transition-colors'
  const active = 'border-[#a435f0] bg-[#a435f0] text-white'
  const inactive = 'border-[#d1d7dc] bg-white text-[#1c1d1f] hover:border-[#a435f0] hover:text-[#a435f0]'

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => select('')}
        className={`${base} ${current === '' ? active : inactive}`}
      >
        すべて
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => select(cat)}
          className={`${base} ${current === cat ? active : inactive}`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
