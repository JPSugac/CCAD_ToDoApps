'use client';

interface FooterProps {
  remainingCount: number;
  onClearCompleted: () => void;
}

export function Footer({ remainingCount, onClearCompleted }: FooterProps) {
  return (
    <div className="footer">
      <span id="todo-count">{remainingCount} 件の未完了タスク</span>
      <button id="clear-completed" onClick={onClearCompleted}>
        完了済みを削除
      </button>
    </div>
  );
}
