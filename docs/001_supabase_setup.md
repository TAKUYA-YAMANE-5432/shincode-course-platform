# 001 Supabase 初期セットアップ

## 概要
Supabase プロジェクトの作成からクライアントユーティリティ・Middleware の実装まで、認証・DB の基盤を整える。

## 関連ファイル
- `.env.local`
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/middleware.ts`
- `middleware.ts`（プロジェクトルート）

---

## Todo

### Supabase プロジェクト
- [ ] Supabase でプロジェクトを新規作成する
- [ ] `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` を取得する
- [ ] `.env.local` を作成して環境変数を設定する

### パッケージ
- [ ] `@supabase/supabase-js` `@supabase/ssr` をインストールする

### DB スキーマ
- [ ] `profiles` テーブルを作成する（id, display_name, role, created_at）
- [ ] `courses` テーブルを作成する（id, title, description, thumbnail_url, category, tags[], published, created_at）
- [ ] `chapters` テーブルを作成する（id, course_id, title, youtube_video_id, order, created_at）
- [ ] Supabase Auth の `users` と `profiles` を外部キーで紐付ける
- [ ] 新規ユーザー登録時に `profiles` レコードを自動生成するトリガーを設定する

### Row Level Security (RLS)
- [ ] `profiles` の RLS を設定する（本人のみ更新可）
- [ ] `courses` の RLS を設定する（全員読み取り可 / admin のみ書き込み可）
- [ ] `chapters` の RLS を設定する（全員読み取り可 / admin のみ書き込み可）

### クライアントユーティリティ
- [ ] `lib/supabase/client.ts` を作成する（`createBrowserClient` — Client Component 用）
- [ ] `lib/supabase/server.ts` を作成する（`createServerClient` + cookies — Server Component 用）
- [ ] `lib/supabase/middleware.ts` を作成する（`updateSession` — セッションリフレッシュ用）

### Middleware
- [ ] プロジェクトルートに `middleware.ts` を作成する
- [ ] matcher を設定して静的ファイルを除外する
- [ ] CDN キャッシュ防止ヘッダー（`Cache-Control` / `Expires` / `Pragma`）をレスポンスに付与する
