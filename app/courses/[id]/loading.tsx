export default function Loading() {
  return (
    <main className="bg-[#f7f9fa]">
      <div className="border-b border-[#d1d7dc] bg-[#1c1d1f] px-4 py-6">
        <div className="mx-auto max-w-6xl animate-pulse space-y-3">
          <div className="h-3 w-32 rounded bg-white/20" />
          <div className="h-7 w-2/3 rounded bg-white/20" />
          <div className="flex gap-2">
            <div className="h-5 w-20 rounded bg-white/20" />
            <div className="h-5 w-16 rounded bg-white/20" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 animate-pulse space-y-4">
            <div className="aspect-video rounded bg-gray-200" />
            <div className="h-24 rounded bg-gray-200" />
          </div>
          <div className="animate-pulse space-y-2">
            <div className="h-8 rounded bg-gray-200" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 rounded bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
