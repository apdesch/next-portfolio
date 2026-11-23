import type { CSSProperties } from "react";

const getStaggerDelayStyle = (position: number): CSSProperties => ({
  animationDelay: `calc(${position} * var(--stagger-step))`,
});

export default getStaggerDelayStyle;
