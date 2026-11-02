import Link from "next/link";
import type { FC } from "react";

// Sized in em, so a parent's font size scales the whole title.
const SiteTitle: FC = () => (
  <div className="animate-peek-up py-[0.4em] text-[6em] leading-[1.3] font-semibold text-shadow-chromatic">
    <Link href="/" className="block origin-right animate-tilt">
      apdesch
    </Link>
  </div>
);

export default SiteTitle;
