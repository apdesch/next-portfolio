import type { FC } from "react";

type MoveButtonsProps = {
  itemName: string;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
};

const moveButtonClassName =
  "grid size-8 place-items-center rounded-md border border-admin-dark/15 text-sm enabled:hover:bg-admin-dark/5 disabled:opacity-40 dark:border-admin-light/15 dark:enabled:hover:bg-admin-light/10";

// Up and down buttons for ordered lists. The list shows each move at once and saves it in
// the background (see video-list.tsx).
const MoveButtons: FC<MoveButtonsProps> = ({
  itemName,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
}) => (
  <div className="flex gap-1">
    <button
      type="button"
      aria-label={`Move ${itemName} up`}
      disabled={isFirst}
      onClick={onMoveUp}
      className={moveButtonClassName}
    >
      <span aria-hidden="true">↑</span>
    </button>
    <button
      type="button"
      aria-label={`Move ${itemName} down`}
      disabled={isLast}
      onClick={onMoveDown}
      className={moveButtonClassName}
    >
      <span aria-hidden="true">↓</span>
    </button>
  </div>
);

export default MoveButtons;
