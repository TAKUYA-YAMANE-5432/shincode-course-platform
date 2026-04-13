# Todo Progress (as of 2026-04-13)

## 001 Supabase 初期セットアップ
- [ ] Supabaseプロジェクト作成・環境変数設定（.env.local）
- [ ] DBスキーマ（profiles, courses, chapters テーブル）
- [ ] RLS設定
- [ ] lib/supabase/client.ts, server.ts, middleware.ts 作成
- [ ] middleware.ts（プロジェクトルート）作成

## 002 認証機能
- [x] サインアップ・ログイン・パスワードリセット画面
- [x] Google OAuth ボタン実装
- [ ] Supabaseダッシュボードでのプロバイダー有効化（手動）
- [ ] Google Cloud Console OAuth設定（手動）
- [x] 認証済みユーザーのリダイレクト

## 003 講座一覧画面
- [x] 全Todo完了（データ取得・CourseCard・CategoryFilter・レイアウト・SEO）

## 004 講座詳細画面
- [x] ほぼ完了
- [ ] generateStaticParams()（認証チェックとの競合のため未実装）

## 005 プロフィール画面
- [x] 全Todo完了

## 006 管理者：講座管理
- [x] ほぼ完了
- [ ] Supabase RLS の admin 書き込み制限（未実装）

## Notes
- `docs/` の各ファイルのTodoチェックボックスが進捗管理の正式ソース
- タスク完了時は `docs/00X_*.md` の `[ ]` → `[x]` を更新すること
