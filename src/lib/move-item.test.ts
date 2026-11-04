import { describe, expect, it } from "vitest";
import moveItem from "@/lib/move-item";

const items = [{ id: 1 }, { id: 2 }, { id: 3 }];

const getIds = (list: { id: number }[]): number[] =>
  list.map((item) => item.id);

describe("moveItem", () => {
  it("swaps with the item before or after", () => {
    expect(getIds(moveItem(items, 2, "up"))).toEqual([2, 1, 3]);
    expect(getIds(moveItem(items, 2, "down"))).toEqual([1, 3, 2]);
  });

  it("leaves the list unchanged at either end or for an unknown ID", () => {
    expect(getIds(moveItem(items, 1, "up"))).toEqual([1, 2, 3]);
    expect(getIds(moveItem(items, 3, "down"))).toEqual([1, 2, 3]);
    expect(getIds(moveItem(items, 9, "up"))).toEqual([1, 2, 3]);
  });

  it("doesn't change the original list", () => {
    moveItem(items, 2, "up");
    expect(getIds(items)).toEqual([1, 2, 3]);
  });
});
