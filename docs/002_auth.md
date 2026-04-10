# 002 認証機能

## 概要
Supabase Auth（メール＆パスワード）を使った新規登録・ログイン・ログアウト・パスワードリセットを実装する。

## 関連ルート
- `app/auth/login/page.tsx`
- `app/auth/signup/page.tsx`
- `app/auth/reset-password/page.tsx`
- `app/auth/callback/route.ts`（メール確認リダイレクト用）

---

## Todo

### サインアップ画面（`/auth/signup`）
- [x] メールアドレス・パスワード入力フォームを作成する
- [x] `supabase.auth.signUp()` を Server Function で呼び出す
- [x] メール確認送信後の案内メッセージを表示する
- [x] バリデーション（メール形式・パスワード強度）を実装する

### ログイン画面（`/auth/login`）
- [x] メールアドレス・パスワード入力フォームを作成する
- [x] `supabase.auth.signInWithPassword()` を Server Function で呼び出す
- [x] ログイン成功後にトップ（`/`）へリダイレクトする
- [x] エラー時のメッセージ表示を実装する
- [x] サインアップページへのリンクを設置する

### パスワードリセット画面（`/auth/reset-password`）
- [x] メールアドレス入力フォームを作成する（送信フェーズ）
- [x] `supabase.auth.resetPasswordForEmail()` を呼び出す
- [x] 新パスワード入力フォームを作成する（更新フェーズ）
- [x] `supabase.auth.updateUser()` で新パスワードを保存する

### コールバック処理（`/auth/callback`）
- [x] `app/auth/callback/route.ts` を作成する（メール確認リンクの処理）
- [x] `supabase.auth.exchangeCodeForSession()` でセッションを確立する
- [x] 確認完了後にトップへリダイレクトする

### ログアウト
- [x] ヘッダーにログアウトボタンを設置する
- [x] `supabase.auth.signOut()` を Server Function で呼び出す
- [x] ログアウト後にログインページへリダイレクトする

### Google OAuth
- [x] `supabase.auth.signInWithOAuth({ provider: 'google' })` を Server Function で呼び出す
- [x] ログイン・サインアップページに「Googleでサインイン」ボタンを設置する
- [ ] Supabase ダッシュボードで Google プロバイダーを有効化する（手動設定）
- [ ] Google Cloud Console で OAuth クライアントを作成し Client ID / Secret を登録する（手動設定）

### 共通
- [x] ログイン済みユーザーが `/auth/*` にアクセスした場合はトップへリダイレクトする
- [x] 未ログインユーザーが保護ページにアクセスした場合は `/auth/login` へリダイレクトする
