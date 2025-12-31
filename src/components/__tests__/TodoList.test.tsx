import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoList } from '../TodoList';
import { Todo } from '@/types/todo';

describe('TodoList', () => {
  const createTodo = (overrides: Partial<Todo> = {}): Todo => ({
    id: 'test-id',
    text: 'テストタスク',
    completed: false,
    createdAt: '2025-01-01T00:00:00.000Z',
    ...overrides,
  });

  describe('空の状態', () => {
    it('タスクがない場合、「タスクがありません」と表示される', () => {
      // Arrange & Act
      render(<TodoList todos={[]} onToggle={vi.fn()} onDelete={vi.fn()} />);

      // Assert
      expect(screen.getByText('タスクがありません')).toBeInTheDocument();
    });
  });

  describe('タスク一覧の表示', () => {
    it('複数のタスクが表示される', () => {
      // Arrange
      const todos: Todo[] = [
        createTodo({ id: '1', text: 'タスク1' }),
        createTodo({ id: '2', text: 'タスク2' }),
        createTodo({ id: '3', text: 'タスク3' }),
      ];

      // Act
      render(<TodoList todos={todos} onToggle={vi.fn()} onDelete={vi.fn()} />);

      // Assert
      expect(screen.getByText('タスク1')).toBeInTheDocument();
      expect(screen.getByText('タスク2')).toBeInTheDocument();
      expect(screen.getByText('タスク3')).toBeInTheDocument();
    });

    it('完了・未完了が混在するタスクを正しく表示する', () => {
      // Arrange
      const todos: Todo[] = [
        createTodo({ id: '1', text: '未完了タスク', completed: false }),
        createTodo({ id: '2', text: '完了タスク', completed: true }),
      ];

      // Act
      render(<TodoList todos={todos} onToggle={vi.fn()} onDelete={vi.fn()} />);

      // Assert
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes[0]).not.toBeChecked();
      expect(checkboxes[1]).toBeChecked();
    });
  });

  describe('イベントの伝播', () => {
    it('タスクをトグルするとonToggleが正しいIDで呼ばれる', async () => {
      // Arrange
      const user = userEvent.setup();
      const onToggle = vi.fn();
      const todos: Todo[] = [
        createTodo({ id: 'target-id', text: 'ターゲットタスク' }),
      ];
      render(<TodoList todos={todos} onToggle={onToggle} onDelete={vi.fn()} />);

      // Act
      await user.click(screen.getByRole('checkbox'));

      // Assert
      expect(onToggle).toHaveBeenCalledWith('target-id');
    });

    it('タスクを削除するとonDeleteが正しいIDで呼ばれる', async () => {
      // Arrange
      const user = userEvent.setup();
      const onDelete = vi.fn();
      const todos: Todo[] = [
        createTodo({ id: 'delete-target-id', text: '削除対象タスク' }),
      ];
      render(<TodoList todos={todos} onToggle={vi.fn()} onDelete={onDelete} />);

      // Act
      await user.click(screen.getByRole('button', { name: '×' }));

      // Assert
      expect(onDelete).toHaveBeenCalledWith('delete-target-id');
    });
  });
});
