# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## ワークフロー

- タスクを実装したら、対応する `docs/00X_*.md` の Todo チェックボックスを `[ ]` → `[x]` に更新する。

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test framework is configured.

## プロジェクト概要

YouTubeで公開した動画を講座として提供するWebプラットフォーム（日本語UI）。
ユーザーは会員登録後に講座一覧・詳細を閲覧し、YouTube埋め込みプレイヤーで動画を視聴できる。
将来の課金（Stripe）・Q&A・お気に入り機能の追加を見据えた設計とする。

## スタック

| 役割 | 技術 |
|------|------|
| フロントエンド | Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4 |
| バックエンド/DB/認証 | Supabase（Postgres + Supabase Auth） |
| インフラ | Vercel（自動デプロイ） |
| 動画 | YouTube Player 埋め込み |
| アクセス解析 | Google Analytics（最低限） |

## 画面構成（App Router ルート）

```
app/
├── page.tsx                  # トップ（講座一覧）
├── auth/
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── reset-password/page.tsx
├── courses/
│   ├── page.tsx              # 講座一覧（カテゴリ/タグ絞り込み）
│   └── [id]/page.tsx         # 講座詳細（YouTube埋め込み、チャプター一覧）
├── profile/page.tsx          # プロフィール表示・編集
└── admin/
    └── courses/
        ├── page.tsx          # 管理者：講座一覧
        ├── new/page.tsx      # 管理者：講座追加
        └── [id]/edit/page.tsx # 管理者：講座編集
```

## データモデル（Supabase）

- **users** — Supabase Auth が管理。`profiles` テーブルで拡張（display_name 等）
- **courses** — id, title, description, thumbnail_url, category, tags[], published, created_at
- **chapters** — id, course_id, title, youtube_video_id, order, created_at
- **categories / tags** — MVP では固定値でも可

## 認証・認可

- Supabase Auth（メール＆パスワード）を使用
- 管理者判定は `profiles.role = 'admin'` で行い、管理画面・CRUD操作を保護する
- Supabase の Row Level Security (RLS) でDBレベルのアクセス制御を行う

## Architecture

This is a **Next.js App Router** project (Next.js 16.2.3, React 19, TypeScript 5, Tailwind CSS 4).

- `app/` — All routes use the App Router file-based convention (`page.tsx`, `layout.tsx`, `loading.tsx`, etc.)
- `app/layout.tsx` — Root layout; sets global fonts (Geist via CSS variables) and metadata
- `app/globals.css` — Global styles; uses Tailwind CSS 4's `@import "tailwindcss"` syntax (not the v3 `@tailwind` directives)
- `public/` — Static assets served at root path

**Path alias:** `@/*` resolves to the project root (e.g., `@/app/...`, `@/components/...`).

**Tailwind CSS 4:** Uses `@tailwindcss/postcss` via `postcss.config.mjs`. No `tailwind.config.js` is needed for basic usage.

**ESLint:** Flat config format (`eslint.config.mjs`) extending `next/core-web-vitals` and `next/typescript`.

> **Important:** Next.js 16.2.3 has breaking changes from prior versions. Before writing any Next.js-specific code, read the relevant guide in `node_modules/next/dist/docs/` and heed deprecation notices.

## Next.js ベストプラクティス（v16.2.3）

### Server / Client Components

- **デフォルトは Server Component**。`'use client'` が必要なのはブラウザ API・イベントハンドラ・useState/useEffect を使う場合のみ。
- `'use client'` ディレクティブはファイルの**先頭、すべての import より上**に置く。
- Server→Client に渡す props は**シリアライズ可能な値のみ**（関数・Map・Set・Date オブジェクト等は不可）。
- Server 専用コードの誤混入を防ぐため `server-only` パッケージを活用する。

### params / searchParams は Promise（破壊的変更）

```tsx
// 動的ルートの params は必ず await する
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
}

// searchParams も同様
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { q } = await searchParams
}
```

`searchParams` を使うとそのページは**動的レンダリング**になる。クライアント側だけのフィルタリングなら `useSearchParams()` を使う。

### データ取得

- `fetch()` は**デフォルトでキャッシュされない**。静的データは `'use cache'` ディレクティブで明示する。
- 同一リクエスト内での重複 fetch は自動でメモ化される（リクエストをまたいだ共有には `React.cache()` を使う）。
- 並列 fetch には `Promise.all()` / `Promise.allSettled()` を使う。
- `getServerSideProps` / `getStaticProps` / `getInitialProps` は廃止。Server Component 内で直接 async fetch する。

### キャッシュ（`'use cache'`）

`next.config.ts` で有効化が必要：

```ts
const nextConfig: NextConfig = { cacheComponents: true }
```

```tsx
// コンポーネントまたは関数に付与
'use cache'
cacheLife('hours') // TTL 設定
cacheTag('courses') // タグで無効化
```

- `revalidateTag('courses')` / `updateTag('courses')` でオンデマンド無効化。
- `cookies()` / `headers()` / `searchParams` などのランタイム API を使うコンポーネントは **`<Suspense>` でラップ**しなければプリレンダリングをブロックする。

### Server Functions（Mutations）

```tsx
'use server'

export async function createCourse(formData: FormData) {
  // 必ず認証・認可チェックを行う（POST で直接呼べるため）
  const session = await getSession()
  if (session?.role !== 'admin') throw new Error('Unauthorized')
  // ...
  revalidateTag('courses')
  redirect('/admin/courses')
}
```

- フォームの `action` に渡すか、`useActionState()` でペンディング状態を管理する。
- `redirect()` は例外をスローする制御フローなので try/catch の外に置く。
- `cookies()` は `await` が必要：`const cookieStore = await cookies()`

### ナビゲーション

- `useRouter` は `next/navigation` からインポートする（`next/router` は廃止）。
- pathname は `usePathname()`、クエリは `useSearchParams()` + `useParams()` で別々に取得する。
- 動的ルートには必ず `loading.tsx` を置く（プリフェッチを有効にし TTFB を改善）。
- リンクのホバー時プリフェッチ：`<Link prefetch={active ? null : false} onMouseEnter={...}>`

### 廃止された API（使用禁止）

| 廃止 | 代替 |
|------|------|
| `pages/` ルーター全般 | `app/` App Router |
| `getServerSideProps` / `getStaticProps` | Server Component 内の async fetch |
| `getStaticPaths` | `generateStaticParams()` |
| `next/head` の `<Head>` | `metadata` エクスポート |
| `next/router` の `useRouter` | `next/navigation` の `useRouter` |
| `<Link><a>children</a></Link>` | `<Link>children</Link>`（`<a>` 不要） |

## Supabase Auth ルール

### インストール

```bash
npm install @supabase/supabase-js @supabase/ssr
```

### 環境変数（`.env.local`）

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

### クライアントユーティリティ

**`lib/supabase/client.ts`** — Client Component 用（ブラウザ）

```ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}
```

`createBrowserClient` はシングルトンなので、複数回呼んでも同一インスタンスが返る。

**`lib/supabase/server.ts`** — Server Component / Server Function 用

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component から呼ばれた場合は無視（Middleware で処理）
          }
        },
      },
    }
  )
}
```

### Middleware（セッション自動リフレッシュ）

**`middleware.ts`**（プロジェクトルート）にセッションリフレッシュ処理を置く。これを省略するとトークンの更新が行われずセッションが失効する。

```ts
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

### セキュリティ：`getClaims()` vs `getSession()`

| メソッド | 用途 | サーバーでの使用 |
|----------|------|----------------|
| `supabase.auth.getClaims()` | JWT を毎回検証する。**ページ保護・認可チェックに使用** | ✅ 必須 |
| `supabase.auth.getSession()` | Cookie から読むだけで JWT 検証しない | ❌ サーバーでは信頼不可 |

**サーバーサイドのルート保護には必ず `getClaims()` を使う。**

### ISR / CDN キャッシュの注意

`setAll` で渡される `Cache-Control` / `Expires` / `Pragma` ヘッダーをレスポンスに付与しないと、CDN がセッション入り Cookie をキャッシュし、別ユーザーにセッションが漏洩する。Middleware 内で必ずこれらのヘッダーを `response` に適用すること。
