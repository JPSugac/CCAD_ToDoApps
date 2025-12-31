import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Footer } from '../Footer';

describe('Footer', () => {
  describe('残りタスク数の表示', () => {
    it('残りタスクが0件の場合、「0 件の未完了タスク」と表示される', () => {
      // Arrange
      const onClearCompleted = vi.fn();

      // Act
      render(<Footer remainingCount={0} onClearCompleted={onClearCompleted} />);

      // Assert
      expect(screen.getByText('0 件の未完了タスク')).toBeInTheDocument();
    });

    it('残りタスクが1件の場合、「1 件の未完了タスク」と表示される', () => {
      // Arrange
      const onClearCompleted = vi.fn();

      // Act
      render(<Footer remainingCount={1} onClearCompleted={onClearCompleted} />);

      // Assert
      expect(screen.getByText('1 件の未完了タスク')).toBeInTheDocument();
    });

    it('残りタスクが複数件の場合、正しい数が表示される', () => {
      // Arrange
      const onClearCompleted = vi.fn();

      // Act
      render(<Footer remainingCount={5} onClearCompleted={onClearCompleted} />);

      // Assert
      expect(screen.getByText('5 件の未完了タスク')).toBeInTheDocument();
    });
  });

  describe('完了済み削除ボタン', () => {
    it('「完了済みを削除」ボタンが表示される', () => {
      // Arrange
      const onClearCompleted = vi.fn();

      // Act
      render(<Footer remainingCount={0} onClearCompleted={onClearCompleted} />);

      // Assert
      expect(screen.getByRole('button', { name: '完了済みを削除' })).toBeInTheDocument();
    });

    it('ボタンクリック時にonClearCompletedが呼ばれる', async () => {
      // Arrange
      const user = userEvent.setup();
      const onClearCompleted = vi.fn();
      render(<Footer remainingCount={0} onClearCompleted={onClearCompleted} />);

      // Act
      await user.click(screen.getByRole('button', { name: '完了済みを削除' }));

      // Assert
      expect(onClearCompleted).toHaveBeenCalledTimes(1);
    });
  });
});
