# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Next.js (App Router) + TypeScriptで構築されたToDoアプリケーション。データはlocalStorageに永続化。

## Commands

```bash
npm run dev      # 開発サーバー起動 (http://localhost:3000)
npm run build    # プロダクションビルド
npm run start    # プロダクションサーバー起動
npm run lint     # ESLint実行
```

## Architecture

```
src/
├── app/
│   ├── layout.tsx      # ルートレイアウト
│   ├── page.tsx        # メインページ（クライアントコンポーネント）
│   └── globals.css     # グローバルスタイル
├── components/
│   ├── TodoForm.tsx    # タスク入力フォーム
│   ├── TodoList.tsx    # タスクリスト表示
│   ├── TodoItem.tsx    # 個別タスク
│   └── Footer.tsx      # カウント・完了済み削除
├── hooks/
│   └── useTodos.ts     # localStorage + 状態管理
└── types/
    └── todo.ts         # Todo型定義
```

### データフロー

1. `useTodos` フック: localStorage読み込み → useState管理 → 変更時にlocalStorage保存
2. `page.tsx`: useTodosからデータ・操作関数を取得し、子コンポーネントにprops渡し
3. 各コンポーネント: propsで受け取ったコールバックを実行

### Todo型

```typescript
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}
```
