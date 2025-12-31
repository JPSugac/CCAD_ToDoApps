# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

シンプルなToDoアプリケーション。HTML/CSS/JavaScriptのみで構成され、データはlocalStorageに永続化。

## Development

ビルドツール不要。ブラウザで直接 `index.html` を開くか、ローカルサーバーで起動:

```bash
# Python 3
python -m http.server 8000

# Node.js (npx)
npx serve .
```

## Architecture

- `index.html` - メインHTML構造
- `style.css` - スタイリング（グラデーション背景、カードレイアウト）
- `app.js` - アプリロジック

### データ構造

```javascript
// localStorage key: 'todos'
{
  id: string,        // ユニークID
  text: string,      // タスク内容
  completed: boolean,
  createdAt: string  // ISO日時
}
```

### 主要関数 (app.js)

- `loadTodos()` / `saveTodos()` - localStorage操作
- `addTodo()` / `toggleTodo()` / `deleteTodo()` - CRUD操作
- `render()` - DOM更新
