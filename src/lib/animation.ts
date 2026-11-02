import type { CSSProperties } from "react";

export function getStaggerDelayStyle(position: number): CSSProperties {
  return { animationDelay: `calc(${position} * var(--stagger-step))` };
}
