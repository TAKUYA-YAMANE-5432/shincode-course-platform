# 004 講座詳細画面

## 概要
`/courses/[id]` に講座の詳細情報・チャプター一覧・YouTube 埋め込みプレイヤーを表示する。ログイン済みユーザーのみ動画視聴可能とする。

## 関連ルート
- `app/courses/[id]/page.tsx`
- `app/courses/[id]/loading.tsx`

## 関連ファイル
- `components/YouTubePlayer.tsx`
- `components/ChapterList.tsx`

---

## Todo

### データ取得
- [x] `params` を `await` して `id` を取得する（Promise 対応）
- [x] `courses` テーブルから該当講座を取得する
- [x] `chapters` テーブルから `course_id` に紐づくチャプター一覧を `order` 昇順で取得する
- [x] 講座が存在しない場合は `notFound()` を呼び出す
- [ ] `generateStaticParams()` で公開済み講座を静的生成する（認証チェックとの競合のため未実装）

### 講座情報表示
- [x] タイトル・概要・カテゴリ・タグを表示する
- [x] サムネイル画像を表示する（`next/image`）

### YouTube 埋め込みプレイヤー（`YouTubePlayer`）
- [x] `'use client'` の Client Component として作成する
- [x] `youtube_video_id` から埋め込み URL を生成する
- [x] レスポンシブ対応（アスペクト比 16:9 を維持）
- [x] 未ログインユーザーへはプレイヤーを非表示にし、ログイン誘導を表示する

### チャプター一覧（`ChapterList`）
- [x] チャプター番号・タイトルを一覧表示する
- [x] チャプターをクリックで対象動画に切り替える（選択状態を管理）
- [x] 現在再生中チャプターをハイライトする

### loading.tsx
- [x] `loading.tsx` を作成してスケルトン UI を表示する

### SEO
- [x] `generateMetadata()` で講座タイトルを動的に `<title>` に設定する
