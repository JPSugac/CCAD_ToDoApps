import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTodos } from '../useTodos';

describe('useTodos', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('初期状態', () => {
    it('初期状態ではtodosが空配列', () => {
      // Arrange & Act
      const { result } = renderHook(() => useTodos());

      // Assert
      expect(result.current.todos).toEqual([]);
    });

    it('localStorageにデータがある場合、読み込まれる', () => {
      // Arrange
      const existingTodos = [
        { id: '1', text: '既存タスク', completed: false, createdAt: '2025-01-01T00:00:00.000Z' },
      ];
      localStorage.setItem('todos', JSON.stringify(existingTodos));

      // Act
      const { result } = renderHook(() => useTodos());

      // Assert
      expect(result.current.todos).toEqual(existingTodos);
    });

    it('isLoadedが最終的にtrueになる', () => {
      // Arrange & Act
      const { result } = renderHook(() => useTodos());

      // Assert
      expect(result.current.isLoaded).toBe(true);
    });
  });

  describe('addTodo', () => {
    it('新しいタスクが追加される', () => {
      // Arrange
      const { result } = renderHook(() => useTodos());

      // Act
      act(() => {
        result.current.addTodo('新しいタスク');
      });

      // Assert
      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].text).toBe('新しいタスク');
      expect(result.current.todos[0].completed).toBe(false);
    });

    it('前後の空白がトリムされる', () => {
      // Arrange
      const { result } = renderHook(() => useTodos());

      // Act
      act(() => {
        result.current.addTodo('  空白付きタスク  ');
      });

      // Assert
      expect(result.current.todos[0].text).toBe('空白付きタスク');
    });

    it('追加後にlocalStorageに保存される', () => {
      // Arrange
      const { result } = renderHook(() => useTodos());

      // Act
      act(() => {
        result.current.addTodo('保存されるタスク');
      });

      // Assert
      expect(localStorage.setItem).toHaveBeenCalled();
      const savedData = JSON.parse(
        (localStorage.setItem as ReturnType<typeof vi.fn>).mock.calls.slice(-1)[0][1]
      );
      expect(savedData[0].text).toBe('保存されるタスク');
    });
  });

  describe('toggleTodo', () => {
    it('未完了タスクを完了にできる', () => {
      // Arrange
      const { result } = renderHook(() => useTodos());
      act(() => {
        result.current.addTodo('トグルテスト');
      });
      const todoId = result.current.todos[0].id;

      // Act
      act(() => {
        result.current.toggleTodo(todoId);
      });

      // Assert
      expect(result.current.todos[0].completed).toBe(true);
    });

    it('完了タスクを未完了に戻せる', () => {
      // Arrange
      const { result } = renderHook(() => useTodos());
      act(() => {
        result.current.addTodo('トグルテスト');
      });
      const todoId = result.current.todos[0].id;
      act(() => {
        result.current.toggleTodo(todoId);
      });

      // Act
      act(() => {
        result.current.toggleTodo(todoId);
      });

      // Assert
      expect(result.current.todos[0].completed).toBe(false);
    });

    it('存在しないIDでは何も起きない', () => {
      // Arrange
      const { result } = renderHook(() => useTodos());
      act(() => {
        result.current.addTodo('テスト');
      });
      const initialTodos = [...result.current.todos];

      // Act
      act(() => {
        result.current.toggleTodo('non-existent-id');
      });

      // Assert
      expect(result.current.todos).toEqual(initialTodos);
    });
  });

  describe('deleteTodo', () => {
    it('タスクを削除できる', () => {
      // Arrange
      const { result } = renderHook(() => useTodos());
      act(() => {
        result.current.addTodo('削除対象');
      });
      const todoId = result.current.todos[0].id;

      // Act
      act(() => {
        result.current.deleteTodo(todoId);
      });

      // Assert
      expect(result.current.todos).toHaveLength(0);
    });

    it('複数タスクから特定のタスクのみ削除される', () => {
      // Arrange
      const { result } = renderHook(() => useTodos());
      act(() => {
        result.current.addTodo('タスク1');
        result.current.addTodo('タスク2');
        result.current.addTodo('タスク3');
      });
      const todoIdToDelete = result.current.todos[1].id;

      // Act
      act(() => {
        result.current.deleteTodo(todoIdToDelete);
      });

      // Assert
      expect(result.current.todos).toHaveLength(2);
      expect(result.current.todos.map(t => t.text)).toEqual(['タスク1', 'タスク3']);
    });
  });

  describe('clearCompleted', () => {
    it('完了済みタスクがすべて削除される', () => {
      // Arrange
      const { result } = renderHook(() => useTodos());
      act(() => {
        result.current.addTodo('未完了1');
        result.current.addTodo('完了予定');
        result.current.addTodo('未完了2');
      });
      const completedTodoId = result.current.todos[1].id;
      act(() => {
        result.current.toggleTodo(completedTodoId);
      });

      // Act
      act(() => {
        result.current.clearCompleted();
      });

      // Assert
      expect(result.current.todos).toHaveLength(2);
      expect(result.current.todos.every(t => !t.completed)).toBe(true);
    });

    it('完了済みタスクがない場合は何も削除されない', () => {
      // Arrange
      const { result } = renderHook(() => useTodos());
      act(() => {
        result.current.addTodo('未完了タスク');
      });

      // Act
      act(() => {
        result.current.clearCompleted();
      });

      // Assert
      expect(result.current.todos).toHaveLength(1);
    });
  });

  describe('remainingCount', () => {
    it('未完了タスク数を正しくカウントする', () => {
      // Arrange
      const { result } = renderHook(() => useTodos());
      act(() => {
        result.current.addTodo('未完了1');
        result.current.addTodo('完了予定');
        result.current.addTodo('未完了2');
      });
      const completedTodoId = result.current.todos[1].id;
      act(() => {
        result.current.toggleTodo(completedTodoId);
      });

      // Assert
      expect(result.current.remainingCount).toBe(2);
    });

    it('タスクがない場合は0', () => {
      // Arrange & Act
      const { result } = renderHook(() => useTodos());

      // Assert
      expect(result.current.remainingCount).toBe(0);
    });
  });
});
