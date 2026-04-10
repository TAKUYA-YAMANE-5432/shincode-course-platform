import Link from 'next/link'

const NAV_ITEMS = [
  { href: '/admin', label: 'ダッシュボード' },
  { href: '/admin/courses', label: '講座管理' },
  { href: '/admin/videos', label: '動画管理' },
]

export function AdminNav({ current }: { current: string }) {
  return (
    <div className="border-b border-[#d1d7dc] bg-white">
      <div className="mx-auto flex max-w-5xl gap-1 px-4">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === current
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-[#a435f0] text-[#a435f0]'
                  : 'border-transparent text-[#6a6f73] hover:text-[#1c1d1f]'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
