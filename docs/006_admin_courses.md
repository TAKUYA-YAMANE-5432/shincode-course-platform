# 006 管理者：講座管理

## 概要
管理者（`profiles.role = 'admin'`）のみがアクセスできる講座の追加・編集・削除画面。チャプター（YouTube 動画）の紐付けも管理する。

## 関連ルート
- `app/admin/courses/page.tsx`（講座一覧）
- `app/admin/courses/new/page.tsx`（講座追加）
- `app/admin/courses/[id]/edit/page.tsx`（講座編集）

---

## Todo

### アクセス制御（共通）
- [x] 各ページの Server Component で `getClaims()` を呼び出しログイン確認する
- [x] `profiles.role !== 'admin'` の場合は 404 または `/` へリダイレクトする
- [ ] Supabase RLS でも DB レベルの書き込みを admin のみに制限する

### 管理者：講座一覧（`/admin/courses`）
- [x] 全講座（未公開含む）を一覧表示する
- [x] 公開/非公開ステータスをバッジで表示する
- [x] 各講座の「編集」「削除」ボタンを設置する
- [x] 「新規追加」ボタンを設置する

### 講座追加（`/admin/courses/new`）
- [x] タイトル・概要・サムネイル URL・カテゴリ・タグ・公開フラグの入力フォームを作成する
- [x] `'use server'` の Server Function で `courses` テーブルに `insert` する
- [x] チャプター（youtube_video_id・タイトル・順番）を複数追加できる UI を作成する
- [x] `chapters` テーブルに一括 `insert` する
- [x] 保存後に `/admin/courses` へリダイレクトし `updateTag('courses')` を呼ぶ
- [x] `useActionState()` でバリデーションエラーを表示する

### 講座編集（`/admin/courses/[id]/edit`）
- [x] 既存データをフォームの初期値として表示する
- [x] `'use server'` の Server Function で `courses` テーブルを `update` する
- [x] チャプターの追加・削除・並び替えができる UI を作成する
- [x] 保存後に `/admin/courses` へリダイレクトし `updateTag('courses')` を呼ぶ

### 講座削除
- [x] 削除確認ダイアログを実装する（CourseForm の削除ボタン）
- [x] `'use server'` の Server Function で `courses` レコードを `delete` する（`chapters` はカスケード削除）
- [x] 削除後に `updateTag('courses')` を呼ぶ
