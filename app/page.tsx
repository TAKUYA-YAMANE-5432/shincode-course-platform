import Link from 'next/link'
import { getCoursesCount, getFeaturedCourses } from '@/lib/courses'
import { CourseCard } from '@/components/CourseCard'

const CATEGORIES = [
  { name: 'Web 開発',    count: '3コース', bg: 'bg-violet-50  hover:bg-violet-100  border-violet-200'  },
  { name: 'JavaScript', count: '1コース', bg: 'bg-yellow-50  hover:bg-yellow-100  border-yellow-300'  },
  { name: 'TypeScript', count: '1コース', bg: 'bg-blue-50    hover:bg-blue-100    border-blue-200'    },
  { name: 'React',      count: '1コース', bg: 'bg-cyan-50    hover:bg-cyan-100    border-cyan-200'    },
  { name: 'Next.js',    count: '1コース', bg: 'bg-gray-50    hover:bg-gray-100    border-gray-300'    },
  { name: 'バックエンド', count: '2コース', bg: 'bg-green-50   hover:bg-green-100   border-green-200'   },
]

export default async function HomePage() {
  const [totalCount, featured] = await Promise.all([
    getCoursesCount(),
    getFeaturedCourses(4),
  ])

  return (
    <div className="flex flex-1 flex-col">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#1c1d1f]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 70% 100% at 75% 50%, rgba(164,53,240,0.18) 0%, transparent 60%)',
          }}
        />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-20 md:flex-row md:items-center md:py-28">
          <div className="flex-1 animate-fade-up">
            <p className="mb-3 text-sm font-semibold tracking-widest text-[#cec0fc] uppercase">
              YouTube × コースプラットフォーム
            </p>
            <h1 className="mb-5 text-4xl font-bold leading-tight text-white md:text-5xl">
              コードで、
              <br />
              <span className="text-[#cec0fc]">未来を切り拓こう</span>
            </h1>
            <p className="mb-8 max-w-md text-base leading-relaxed text-[#9e9ea0]">
              現役エンジニアによる実践的なプログラミング講座。
              YouTube動画でいつでも・どこでも学べます。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/courses"
                className="rounded bg-[#a435f0] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#8710d8]"
              >
                講座を探す
              </Link>
              <Link
                href="/auth/signup"
                className="rounded border-2 border-white px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white hover:text-[#1c1d1f]"
              >
                無料で始める
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:w-72 animate-fade-up delay-200">
            {[
              { value: `${totalCount}`,  label: '講座数' },
              { value: '1,200+',             label: '受講者数' },
              { value: '4.8',                label: '平均評価' },
              { value: '100%',               label: '無料アクセス' },
            ].map((s) => (
              <div key={s.label} className="rounded border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="text-xl font-bold text-[#cec0fc]">{s.value}</div>
                <div className="mt-0.5 text-xs text-[#9e9ea0]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────── */}
      <section className="border-b border-[#d1d7dc] bg-white px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-xl font-bold text-[#1c1d1f]">カテゴリから探す</h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/courses?category=${encodeURIComponent(cat.name)}`}
                className={`rounded border p-3 transition-colors ${cat.bg}`}
              >
                <p className="text-sm font-bold text-[#1c1d1f]">{cat.name}</p>
                <p className="mt-0.5 text-xs text-[#6a6f73]">{cat.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured courses ─────────────────────────────────────── */}
      <section className="bg-white px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#1c1d1f]">注目の講座</h2>
              <p className="mt-1 text-sm text-[#6a6f73]">受講者に人気の講座をピックアップ</p>
            </div>
            <Link href="/courses" className="text-sm font-bold text-[#a435f0] hover:text-[#8710d8]">
              すべて見る →
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {featured.map((course, i) => (
                <CourseCard key={course.id} course={course} priority={i < 2} />
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-[#6a6f73]">講座を準備中です。もうしばらくお待ちください。</p>
          )}
        </div>
      </section>

      {/* ── Why ShinCode ─────────────────────────────────────────── */}
      <section className="bg-[#1c1d1f] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="mb-4 text-2xl font-bold text-white">なぜ ShinCode Courses なのか？</h2>
              <p className="mb-6 leading-relaxed text-[#9e9ea0]">
                現役フルスタックエンジニアが、実務で即使えるスキルを丁寧に教えます。
                初心者でも安心して始められる環境を提供します。
              </p>
              <ul className="space-y-4">
                {[
                  { icon: '▶', text: 'YouTube動画で質の高いコンテンツを無制限に視聴' },
                  { icon: '⚡', text: '体系的なカリキュラムで効率よくスキルアップ' },
                  { icon: '🎯', text: '実プロジェクトを作りながら実践力を養成' },
                  { icon: '🔄', text: 'いつでも見直せる永久アクセス' },
                ].map(({ icon, text }) => (
                  <li key={text} className="flex items-start gap-3 text-sm text-[#cec0fc]">
                    <span className="mt-0.5 shrink-0">{icon}</span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded border border-white/10 bg-white/5 p-8">
              <div className="mb-4 flex gap-1">
                {[1,2,3,4,5].map((i) => (
                  <svg key={i} width="18" height="18" viewBox="0 0 12 12" className="text-[#e59819]">
                    <path fill="currentColor" d="M6 0l1.5 4.1H12L8.6 6.6l1.3 4.2L6 8.4l-3.9 2.4 1.3-4.2L0 4.1h4.5z" />
                  </svg>
                ))}
              </div>
              <blockquote className="mb-6 leading-relaxed text-[#cec0fc]">
                &ldquo;ShinCode の講座は説明がわかりやすく、手を動かしながら学べるので挫折せずに続けられました。転職活動でも大いに役立ちました！&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#a435f0]/20 text-sm font-bold text-[#cec0fc]">T</div>
                <div>
                  <p className="text-sm font-semibold text-white">田中 一郎</p>
                  <p className="text-xs text-[#6a6f73]">Web エンジニア（転職成功）</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────── */}
      <section className="border-t border-[#d1d7dc] bg-[#f7f9fa] px-4 py-16 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="mb-3 text-2xl font-bold text-[#1c1d1f]">今すぐ学習を始めましょう</h2>
          <p className="mb-7 text-[#6a6f73]">アカウント登録は無料。すべての講座にアクセスできます。</p>
          <Link
            href="/auth/signup"
            className="inline-block rounded bg-[#a435f0] px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-[#8710d8]"
          >
            無料で始める
          </Link>
        </div>
      </section>
    </div>
  )
}
