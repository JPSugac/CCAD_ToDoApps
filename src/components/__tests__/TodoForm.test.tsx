import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoForm } from '../TodoForm';

describe('TodoForm', () => {
  describe('フォームの表示', () => {
    it('入力フィールドが表示される', () => {
      // Arrange & Act
      render(<TodoForm onAdd={vi.fn()} />);

      // Assert
      expect(screen.getByPlaceholderText('新しいタスクを入力...')).toBeInTheDocument();
    });

    it('追加ボタンが表示される', () => {
      // Arrange & Act
      render(<TodoForm onAdd={vi.fn()} />);

      // Assert
      expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument();
    });
  });

  describe('タスクの追加', () => {
    it('テキストを入力して送信するとonAddが呼ばれる', async () => {
      // Arrange
      const user = userEvent.setup();
      const onAdd = vi.fn();
      render(<TodoForm onAdd={onAdd} />);

      // Act
      await user.type(screen.getByPlaceholderText('新しいタスクを入力...'), '新しいタスク');
      await user.click(screen.getByRole('button', { name: '追加' }));

      // Assert
      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd).toHaveBeenCalledWith('新しいタスク');
    });

    it('Enterキーで送信できる', async () => {
      // Arrange
      const user = userEvent.setup();
      const onAdd = vi.fn();
      render(<TodoForm onAdd={onAdd} />);

      // Act
      const input = screen.getByPlaceholderText('新しいタスクを入力...');
      await user.type(input, 'Enterで追加{enter}');

      // Assert
      expect(onAdd).toHaveBeenCalledWith('Enterで追加');
    });

    it('送信後に入力フィールドがクリアされる', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<TodoForm onAdd={vi.fn()} />);

      // Act
      const input = screen.getByPlaceholderText('新しいタスクを入力...');
      await user.type(input, 'クリアされるタスク');
      await user.click(screen.getByRole('button', { name: '追加' }));

      // Assert
      expect(input).toHaveValue('');
    });
  });

  describe('バリデーション', () => {
    it('空文字では送信されない', async () => {
      // Arrange
      const user = userEvent.setup();
      const onAdd = vi.fn();
      render(<TodoForm onAdd={onAdd} />);

      // Act
      await user.click(screen.getByRole('button', { name: '追加' }));

      // Assert
      expect(onAdd).not.toHaveBeenCalled();
    });

    it('空白のみでは送信されない', async () => {
      // Arrange
      const user = userEvent.setup();
      const onAdd = vi.fn();
      render(<TodoForm onAdd={onAdd} />);

      // Act
      await user.type(screen.getByPlaceholderText('新しいタスクを入力...'), '   ');
      await user.click(screen.getByRole('button', { name: '追加' }));

      // Assert
      expect(onAdd).not.toHaveBeenCalled();
    });
  });
});
