# 変更履歴 2026-04-10

---

## 1. ビルドエラー修正

### 概要
`npm run build` が複数のエラーで失敗していたため修正した。

### 背景
Next.js 16 は従来バージョンと破壊的変更がある。特に以下の 2 点が問題だった。
- キャッシュ無効化 API の仕様変更（`revalidateTag` の引数が変わった）
- `cacheComponents: true` 有効時は `export const dynamic = 'force-dynamic'` が使用不可

### 詳細

#### 1-1. `revalidateTag` → `updateTag` に変更
| ファイル | 変更内容 |
|---------|---------|
| `app/admin/actions.ts` | `import { revalidateTag }` → `import { updateTag }` に変更。`revalidateTag('courses')` の呼び出し 3 箇所を `updateTag('courses')` に置換 |

**理由:** Next.js 16 では `revalidateTag(tag, value)` が 2 引数必須になった。Server Action 内でキャッシュを即時破棄する場合は `updateTag(tag)` を使う。

---

#### 1-2. `force-dynamic` を `<Suspense>` パターンに変更
| ファイル | 変更内容 |
|---------|---------|
| `app/admin/courses/page.tsx` | `export const dynamic = 'force-dynamic'` を削除。ページ本体を `<Suspense>` でラップした `AdminCoursesList` コンポーネントに分離 |
| `app/admin/courses/new/page.tsx` | 同上。`NewCourseContent` コンポーネントに分離 |
| `app/admin/courses/[id]/edit/page.tsx` | 同上。`await params` も Suspense 内で解決するよう変更 |
| `app/profile/page.tsx` | 同上。`ProfileContent` コンポーネントに分離 |
| `app/courses/[id]/page.tsx` | 同上。`CourseDetailContent` コンポーネントに分離 |
| `app/auth/reset-password/page.tsx` | `await searchParams` を Suspense 内の `ResetPasswordContent` に移動 |

**理由:** `cacheComponents: true` と `force-dynamic` は共存不可。Next.js 16 のルールとして、Cookie・searchParams など動的データへのアクセスは `<Suspense>` 境界内で行う必要がある。

---

#### 1-3. Header の動的コンテンツを Suspense 内に分離
| ファイル | 変更内容 |
|---------|---------|
| `components/Header.tsx` | `getClaims()` 呼び出し部分を `HeaderAuthSection`（async Server Component）に切り出し、`<Suspense fallback={<HeaderAuthFallback />}>` でラップ |

**理由:** Root Layout の `<Header />` がビルド時にプリレンダリングされる際、`getClaims()` がキャッシュ外の動的データにアクセスしてエラーになっていた。

---

## 2. 管理画面機能の追加

### 概要
管理画面にダッシュボード・セクション管理・動画管理の 3 機能を追加した。

### 背景
既存の管理画面は講座の CRUD のみで、以下が不足していた。
- 全体の統計を俯瞰できる画面がない
- 動画（チャプター）を講座をまたいで一覧できない
- 講座内のコンテンツが「チャプター」のフラット構造で、Udemy のようなセクション階層がない

### 詳細

#### 2-1. DB マイグレーション（Supabase MCP）
```sql
-- sections テーブル新規作成
CREATE TABLE sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  "order" integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- chapters に section_id カラム追加
ALTER TABLE chapters ADD COLUMN section_id uuid
  REFERENCES sections(id) ON DELETE SET NULL;

-- 既存チャプターを「メインコンテンツ」セクションに自動移行
-- （コース単位でデフォルトセクションを作成し紐付け）
```

---

#### 2-2. 管理者ダッシュボード（新規）
| ファイル | 内容 |
|---------|------|
| `app/admin/page.tsx` | 統計カード（講座数・セクション数・動画数・ユーザー数）とクイックアクション（講座管理・新規追加・動画管理）を表示 |

---

#### 2-3. 動画管理ページ（新規）
| ファイル | 内容 |
|---------|------|
| `app/admin/videos/page.tsx` | 全動画を「動画タイトル / 講座名 / セクション名 / YouTube ID」付きで一覧表示。YouTube ID はリンクで動画に直接アクセス可能。「講座を編集」ボタンで対応する講座編集ページへ遷移 |

---

#### 2-4. セクション管理（CourseForm 改修）
| ファイル | 変更内容 |
|---------|---------|
| `app/admin/courses/CourseForm.tsx` | フォームをセクション→動画の階層構造に全面改修。セクションの追加・削除・タイトル編集、セクション内への動画追加・削除が可能 |
| `app/admin/actions.ts` | `createCourse` / `updateCourse` をセクション対応に更新。`parseSections()` ヘルパーで FormData からセクション・動画を階層パース。更新時はセクション・チャプターを洗い替え |

**フォームデータ構造（変更後）:**
```
sections[0][title]
sections[0][chapters][0][title]
sections[0][chapters][0][youtube_video_id]
sections[1][title]
sections[1][chapters][0][title]
...
```

---

#### 2-5. AdminNav コンポーネント（新規）
| ファイル | 内容 |
|---------|------|
| `components/AdminNav.tsx` | 管理画面共通のタブナビゲーション。現在のパスに応じてアクティブタブをハイライト。全管理ページに適用 |

---

#### 2-6. 型・データ取得の更新
| ファイル | 変更内容 |
|---------|---------|
| `lib/types.ts` | `Section`・`SectionWithChapters` 型を追加。`Chapter` に `section_id: string \| null` を追加 |
| `lib/courses.ts` | `getSectionsWithChapters(courseId)` を追加。sections と chapters を別クエリで取得し、`section_id` でグループ化して返す |

---

#### 2-7. 受講者側の表示更新
| ファイル | 変更内容 |
|---------|---------|
| `components/ChapterList.tsx` | props を `sections: SectionWithChapters[]` に変更。セクションヘッダーを表示し、その下にチャプターをグループ表示 |
| `app/courses/[id]/CourseDetailClient.tsx` | props を `sections` に変更。チャプター数表示を「セクション数・動画数」に更新 |
| `app/courses/[id]/page.tsx` | `getChapters()` → `getSectionsWithChapters()` に変更 |

---

#### 2-8. ヘッダーのリンク変更
| ファイル | 変更内容 |
|---------|---------|
| `components/Header.tsx` | 管理者向けリンクの遷移先を `/admin/courses` → `/admin`（ダッシュボード）に変更 |

---

## 3. パフォーマンス改善

### 概要
クライアント JS バンドルの削減と LCP（最大コンテンツ描画）の改善を実施した。

### 背景
パフォーマンス監査の結果、以下の 2 点が優先度が高いと判断された。
1. `CourseList` が `'use client'` であるため、全コースデータがクライアントに転送されてからフィルタリングされていた
2. トップページの Featured 画像が `priority` なしで読み込まれており、LCP が遅延していた

---

#### 3-1. CourseList の Server Component 化
| ファイル | 変更内容 |
|---------|---------|
| `components/CourseList.tsx` | `'use client'` を削除。`useSearchParams()` を廃止し、props として `category?: string` を受け取りサーバー側でフィルタリング |
| `app/courses/page.tsx` | `searchParams` を受け取る `CourseListSection`（async Server Component）を追加し Suspense でラップ。`CategoryFilter` も独立した Suspense でラップ |

**効果:**
- クライアントバンドルから `CourseList`・`CourseCard` が削除（約 12KB 削減）
- 全コースデータのシリアライズ転送がなくなる
- `getCourses()` はキャッシュ済みのため DB への追加クエリなし

**変更前後のデータフロー:**
```
変更前: DB → (キャッシュ) → サーバー → [全コースJSON] → クライアント → JS でフィルタ → 表示
変更後: DB → (キャッシュ) → サーバー → サーバーでフィルタ → HTML → クライアント → 表示
```

---

#### 3-2. Featured 画像への priority 付与
| ファイル | 変更内容 |
|---------|---------|
| `components/CourseCard.tsx` | `priority?: boolean`（デフォルト `false`）props を追加。`<Image>` に `priority={priority}` を渡す |
| `app/page.tsx` | Featured の最初の 2 枚（`i < 2`）に `priority={true}` を渡す |

**効果:**
- 最初の 2 枚の画像に `<link rel="preload">` が出力され、ブラウザが他リソースより優先して取得
- LCP の改善（Featured 画像が LCP 要素になるケースが多い）

**なぜ 2 枚か:**
グリッドが `grid-cols-2`（モバイル）〜 `grid-cols-4`（デスクトップ）のため、最初の 2 枚はどの画面幅でもビューポート内に確実に表示される。3 枚目以降は遅延読み込みのままにしてネットワーク帯域を節約している。
