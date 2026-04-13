# Code Style & Conventions

## TypeScript
- 型定義は `lib/types.ts` に集約
- 型ヒントを積極的に使用
- `zod` でバリデーション

## Next.js (v16.2.3) ルール
- デフォルトはServer Component。`'use client'` は必要な場合のみ（ブラウザAPI・イベント・useState/useEffect）
- `'use client'` はファイル先頭、全importより上に記述
- `params` / `searchParams` は必ず `await` する（Promise型）
- サーバーサイドの認証チェックは `getClaims()` を使用（`getSession()` は不可）
- `useRouter` は `next/navigation` から（`next/router` は廃止）
- `redirect()` は try/catch の外に置く

## Supabase
- Client Component用: `lib/supabase/client.ts`（createBrowserClient）
- Server Component用: `lib/supabase/server.ts`（createServerClient + cookies）
- 環境変数: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## Naming
- ファイル名: PascalCase（Components）、camelCase（utils/actions）
- コンポーネント: PascalCase
- 関数: camelCase
- 型: PascalCase

## Styling
- Tailwind CSS 4（`@import "tailwindcss"` 構文、`tailwind.config.js` 不要）
- レスポンシブ対応必須

## Cache
- `'use cache'` + `cacheTag('courses')` でキャッシュ
- `updateTag('courses')` でオンデマンド無効化
