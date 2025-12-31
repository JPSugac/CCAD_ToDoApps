import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from '../TodoItem';
import { Todo } from '@/types/todo';

describe('TodoItem', () => {
  const createTodo = (overrides: Partial<Todo> = {}): Todo => ({
    id: 'test-id-1',
    text: 'テストタスク',
    completed: false,
    createdAt: '2025-01-01T00:00:00.000Z',
    ...overrides,
  });

  describe('タスクの表示', () => {
    it('タスクのテキストが表示される', () => {
      // Arrange
      const todo = createTodo({ text: '買い物に行く' });

      // Act
      render(<TodoItem todo={todo} onToggle={vi.fn()} onDelete={vi.fn()} />);

      // Assert
      expect(screen.getByText('買い物に行く')).toBeInTheDocument();
    });

    it('未完了タスクはチェックボックスがオフ', () => {
      // Arrange
      const todo = createTodo({ completed: false });

      // Act
      render(<TodoItem todo={todo} onToggle={vi.fn()} onDelete={vi.fn()} />);

      // Assert
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('完了タスクはチェックボックスがオン', () => {
      // Arrange
      const todo = createTodo({ completed: true });

      // Act
      render(<TodoItem todo={todo} onToggle={vi.fn()} onDelete={vi.fn()} />);

      // Assert
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('完了タスクはcompletedクラスが付与される', () => {
      // Arrange
      const todo = createTodo({ completed: true });

      // Act
      const { container } = render(
        <TodoItem todo={todo} onToggle={vi.fn()} onDelete={vi.fn()} />
      );

      // Assert
      expect(container.querySelector('.todo-item.completed')).toBeInTheDocument();
    });
  });

  describe('タスクの完了切り替え', () => {
    it('チェックボックスをクリックするとonToggleが呼ばれる', async () => {
      // Arrange
      const user = userEvent.setup();
      const onToggle = vi.fn();
      const todo = createTodo({ id: 'toggle-test-id' });
      render(<TodoItem todo={todo} onToggle={onToggle} onDelete={vi.fn()} />);

      // Act
      await user.click(screen.getByRole('checkbox'));

      // Assert
      expect(onToggle).toHaveBeenCalledTimes(1);
      expect(onToggle).toHaveBeenCalledWith('toggle-test-id');
    });
  });

  describe('タスクの削除', () => {
    it('削除ボタンをクリックするとonDeleteが呼ばれる', async () => {
      // Arrange
      const user = userEvent.setup();
      const onDelete = vi.fn();
      const todo = createTodo({ id: 'delete-test-id' });
      render(<TodoItem todo={todo} onToggle={vi.fn()} onDelete={onDelete} />);

      // Act
      await user.click(screen.getByRole('button', { name: '×' }));

      // Assert
      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(onDelete).toHaveBeenCalledWith('delete-test-id');
    });
  });
});
