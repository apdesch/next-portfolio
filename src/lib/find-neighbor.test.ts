import { describe, expect, it } from "vitest";
import findNeighbor from "@/lib/find-neighbor";

const items = [
  { id: 7, position: 1 },
  { id: 3, position: 2 },
  { id: 9, position: 5 },
];

describe("findNeighbor", () => {
  it("finds the item before and after", () => {
    expect(findNeighbor(items, 3, "up")).toEqual({ id: 7, position: 1 });
    expect(findNeighbor(items, 3, "down")).toEqual({ id: 9, position: 5 });
  });

  it("returns null at either end", () => {
    expect(findNeighbor(items, 7, "up")).toBeNull();
    expect(findNeighbor(items, 9, "down")).toBeNull();
  });

  it("returns null for an unknown ID", () => {
    expect(findNeighbor(items, 42, "up")).toBeNull();
  });
});
