import type { MoveDirection } from "@/lib/find-neighbor";

// A new list with the item swapped with the one before (up) or after (down). Used to show
// a move instantly while the server saves it. Unchanged at either end or for an unknown ID.
const moveItem = <Item extends { id: number }>(
  items: readonly Item[],
  itemId: number,
  direction: MoveDirection,
): Item[] => {
  const itemIndex = items.findIndex((item) => item.id === itemId);
  const neighborIndex = direction === "up" ? itemIndex - 1 : itemIndex + 1;
  const isMovable =
    itemIndex !== -1 && neighborIndex >= 0 && neighborIndex < items.length;
  if (!isMovable) return [...items];
  return items.map((item, index) => {
    if (index === itemIndex) return items[neighborIndex];
    if (index === neighborIndex) return items[itemIndex];
    return item;
  });
};

export default moveItem;
