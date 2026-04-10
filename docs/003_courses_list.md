# 003 講座一覧画面

## 概要
トップページ（`/`）および `/courses` に講座一覧を表示する。サムネイル・タイトル・概要を表示し、カテゴリ/タグによる絞り込みを提供する。

## 関連ルート
- `app/page.tsx`（トップ = 講座一覧）
- `app/courses/page.tsx`

## 関連ファイル
- `components/CourseCard.tsx`
- `components/CategoryFilter.tsx`

---

## Todo

### データ取得
- [x] Server Component で `courses` テーブルから `published = true` の講座一覧を取得する
- [x] `'use cache'` + `cacheTag('courses')` でキャッシュする
- [x] カテゴリ・タグの一覧を取得する（固定値または DB から）

### 講座カード（`CourseCard`）
- [x] サムネイル画像（`next/image`）を表示する
- [x] タイトル・概要（truncate）を表示する
- [x] カテゴリバッジを表示する
- [x] 講座詳細ページ（`/courses/[id]`）へのリンクを設置する

### カテゴリ/タグ絞り込み（`CategoryFilter`）
- [x] カテゴリ一覧をボタン/タブで表示する
- [x] 選択状態を `useSearchParams()` で管理する（URL クエリ `?category=xxx`）
- [x] 絞り込みはクライアントサイドで行い、サーバーへの再フェッチを最小化する

### ページレイアウト
- [x] グリッドレイアウトでカードを並べる（レスポンシブ: 1→2→3カラム）
- [x] 講座が0件の場合の空状態メッセージを表示する
- [x] `loading.tsx` を作成してスケルトン UI を表示する

### SEO
- [x] `metadata` エクスポートでページタイトル・description を設定する
