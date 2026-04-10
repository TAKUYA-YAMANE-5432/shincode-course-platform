export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 animate-pulse">
        <div className="h-8 w-32 rounded bg-gray-200" />
        <div className="mt-2 h-4 w-20 rounded bg-gray-200" />
      </div>

      {/* Category filter skeleton */}
      <div className="flex gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-9 w-20 animate-pulse rounded bg-gray-200" />
        ))}
      </div>

      {/* Cards skeleton */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-video rounded bg-gray-200" />
            <div className="mt-3 space-y-2">
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-1/2 rounded bg-gray-200" />
              <div className="h-5 w-16 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
