import type { FC } from "react";

type ButtonLabelProps = { isBusy: boolean; label: string; busyLabel: string };

// Both labels share one grid cell and the unused one is hidden, so the button is always as
// wide as the longer label and switching to "Saving…" doesn't shift the layout.
const ButtonLabel: FC<ButtonLabelProps> = ({ isBusy, label, busyLabel }) => (
  <span className="grid">
    <span
      aria-hidden={isBusy}
      className={`col-start-1 row-start-1 ${isBusy ? "invisible" : ""}`}
    >
      {label}
    </span>
    <span
      aria-hidden={!isBusy}
      className={`col-start-1 row-start-1 ${isBusy ? "" : "invisible"}`}
    >
      {busyLabel}
    </span>
  </span>
);

export default ButtonLabel;
