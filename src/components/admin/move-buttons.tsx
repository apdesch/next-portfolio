import type { FC } from "react";

// Vertical lists use ↑ ↓; grids, which read left to right, use ← →.
type MoveOrientation = "vertical" | "horizontal";

const moveLabels: Record<
  MoveOrientation,
  { earlierArrow: string; laterArrow: string; earlier: string; later: string }
> = {
  vertical: {
    earlierArrow: "↑",
    laterArrow: "↓",
    earlier: "up",
    later: "down",
  },
  horizontal: {
    earlierArrow: "←",
    laterArrow: "→",
    earlier: "earlier",
    later: "later",
  },
};

type MoveButtonsProps = {
  orientation: MoveOrientation;
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
  orientation,
  itemName,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
}) => (
  <div className="flex gap-1">
    <button
      type="button"
      aria-label={`Move ${itemName} ${moveLabels[orientation].earlier}`}
      disabled={isFirst}
      onClick={onMoveUp}
      className={moveButtonClassName}
    >
      <span aria-hidden="true">{moveLabels[orientation].earlierArrow}</span>
    </button>
    <button
      type="button"
      aria-label={`Move ${itemName} ${moveLabels[orientation].later}`}
      disabled={isLast}
      onClick={onMoveDown}
      className={moveButtonClassName}
    >
      <span aria-hidden="true">{moveLabels[orientation].laterArrow}</span>
    </button>
  </div>
);

export default MoveButtons;
