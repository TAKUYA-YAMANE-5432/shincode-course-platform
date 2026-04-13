# Architecture & Project Structure

## App Router Routes
```
app/
├── page.tsx                        # トップ（講座一覧）
├── layout.tsx                      # ルートレイアウト
├── globals.css                     # グローバルスタイル（Tailwind CSS 4）
├── auth/
│   ├── actions.ts                  # Server Functions（signUp/signIn/signOut/OAuth）
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── reset-password/page.tsx
│   └── callback/route.ts          # メール確認リダイレクト
├── courses/
│   ├── page.tsx                    # 講座一覧（カテゴリ/タグ絞り込み）
│   ├── loading.tsx
│   └── [id]/
│       ├── page.tsx                # 講座詳細（YouTube埋め込み、チャプター一覧）
│       ├── loading.tsx
│       └── CourseDetailClient.tsx
├── profile/
│   ├── page.tsx
│   ├── ProfileForm.tsx
│   └── actions.ts
└── admin/
    ├── page.tsx                    # 管理者ダッシュボード
    ├── actions.ts                  # 講座CRUD Server Functions
    ├── courses/
    │   ├── page.tsx                # 管理者：講座一覧
    │   ├── new/page.tsx
    │   ├── [id]/edit/page.tsx
    │   └── CourseForm.tsx
    └── videos/page.tsx
```

## Shared Components (`components/`)
- `Header.tsx` — ヘッダー（ナビゲーション・ログアウト）
- `CourseCard.tsx` — 講座カード
- `CourseList.tsx` — 講座一覧グリッド
- `CategoryFilter.tsx` — カテゴリ/タグ絞り込み（Client Component）
- `ChapterList.tsx` — チャプター一覧
- `YouTubePlayer.tsx` — YouTube埋め込みプレイヤー（Client Component）
- `AdminNav.tsx` — 管理画面ナビゲーション

## Lib (`lib/`)
- `lib/supabase/client.ts` — createBrowserClient（Client Component用）
- `lib/supabase/server.ts` — createServerClient + cookies（Server Component用）
- `lib/supabase/middleware.ts` — updateSession（セッションリフレッシュ）
- `lib/supabase/public.ts` — 公開データ取得用
- `lib/courses.ts` — 講座データ取得関数
- `lib/types.ts` — 型定義（Course, Section, Chapter, SectionWithChapters, Profile）

## Key Files
- `middleware.ts` — セッションリフレッシュ + 静的ファイル除外matcher
- `next.config.ts` — Next.js設定（cacheComponents: true）
- `tsconfig.json` — `@/*` → プロジェクトルート のパスエイリアス
