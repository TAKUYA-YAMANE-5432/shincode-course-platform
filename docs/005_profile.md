# 005 プロフィール画面

## 概要
ログイン済みユーザーが自身のプロフィール（メールアドレス・表示名）を確認・編集できる画面。未ログイン時はログインページへリダイレクトする。

## 関連ルート
- `app/profile/page.tsx`

---

## Todo

### アクセス制御
- [x] Server Component で `supabase.auth.getClaims()` を呼び出しログイン確認する
- [x] 未ログインの場合は `redirect('/auth/login')` する

### プロフィール表示
- [x] メールアドレスを表示する（Supabase Auth の `user.email`）
- [x] 表示名（`profiles.display_name`）を表示する

### プロフィール編集フォーム
- [x] 表示名の入力フィールドを用意する
- [x] `'use server'` の Server Function で `profiles` テーブルを `update` する
- [x] `useActionState()` で送信中・成功・エラー状態を管理する
- [x] 保存成功後にフラッシュメッセージを表示する

### UI
- [x] レスポンシブ対応のフォームレイアウトを作成する
- [x] ヘッダーにログアウトボタンを設置する（`002_auth.md` と共通）
