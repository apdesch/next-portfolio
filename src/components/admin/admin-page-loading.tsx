import type { FC } from "react";

// Shown the moment an admin page is opened, while its data streams in.
const AdminPageLoading: FC = () => (
  <p className="m-0 p-6 text-sm opacity-70">Loading…</p>
);

export default AdminPageLoading;
