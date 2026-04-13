# Project Overview: shincode-course-platform

## Purpose
YouTube動画を講座として提供するWebプラットフォーム（日本語UI）。
ユーザーは会員登録後に講座一覧・詳細を閲覧し、YouTube埋め込みプレイヤーで動画を視聴できる。
将来的にStripe課金・Q&A・お気に入り機能の追加を見据えた設計。

## Tech Stack
- Frontend: Next.js 16.2.3 (App Router), React 19, TypeScript 5, Tailwind CSS 4
- Backend/DB/Auth: Supabase（Postgres + Supabase Auth）
- Infrastructure: Vercel（自動デプロイ）
- Video: YouTube Player 埋め込み
- Analytics: Google Analytics（最低限）
- Validation: Zod 4

## Data Models
- **profiles**: id, display_name, role, created_at（Supabase Auth の users を外部キーで拡張）
- **courses**: id, title, description, thumbnail_url, category, tags[], published, created_at
- **sections**: id, course_id, title, order, created_at
- **chapters**: id, course_id, section_id, title, youtube_video_id, order, created_at

## Auth & Authorization
- Supabase Auth（メール＆パスワード + Google OAuth）
- 管理者判定: `profiles.role = 'admin'`
- サーバーサイドのルート保護には `getClaims()` を使用（`getSession()` は不可）
- Row Level Security (RLS) でDBレベルのアクセス制御
