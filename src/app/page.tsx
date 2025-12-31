'use client';

import { useTodos } from '@/hooks/useTodos';
import { TodoForm } from '@/components/TodoForm';
import { TodoList } from '@/components/TodoList';
import { Footer } from '@/components/Footer';

export default function Home() {
  const {
    todos,
    isLoaded,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    remainingCount,
  } = useTodos();

  if (!isLoaded) {
    return (
      <div className="container">
        <h1>ToDo List</h1>
        <p style={{ textAlign: 'center', color: '#888' }}>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>ToDo List</h1>
      <TodoForm onAdd={addTodo} />
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
      <Footer remainingCount={remainingCount} onClearCompleted={clearCompleted} />
    </div>
  );
}
