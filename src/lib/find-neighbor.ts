export type MoveDirection = "up" | "down";

type OrderedItem = { id: number; position: number };

// The item a move swaps places with: the one before (up) or after (down) in the list,
// which must already be sorted by position. Null at either end, or for an unknown ID.
const findNeighbor = <Item extends OrderedItem>(
  orderedItems: readonly Item[],
  itemId: number,
  direction: MoveDirection,
): Item | null => {
  const itemIndex = orderedItems.findIndex((item) => item.id === itemId);
  if (itemIndex === -1) return null;
  const neighborIndex = direction === "up" ? itemIndex - 1 : itemIndex + 1;
  return orderedItems[neighborIndex] ?? null;
};

export default findNeighbor;
