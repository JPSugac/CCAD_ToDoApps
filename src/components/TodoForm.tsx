'use client';

import { useState, FormEvent } from 'react';

interface TodoFormProps {
  onAdd: (text: string) => void;
}

export function TodoForm({ onAdd }: TodoFormProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text);
      setText('');
    }
  };

  return (
    <form id="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        id="todo-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="新しいタスクを入力..."
        required
      />
      <button type="submit">追加</button>
    </form>
  );
}
