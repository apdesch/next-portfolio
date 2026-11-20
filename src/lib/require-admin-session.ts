import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import auth from "@/lib/auth";

type AdminSession = typeof auth.$Infer.Session;

// React's cache() shares one lookup across a single render, so a page whose layout and
// data functions all check the session costs one database round trip, not three or four.
// Each new request still checks again.
const getCurrentSession = cache(async (): Promise<AdminSession | null> =>
  auth.api.getSession({ headers: await headers() }),
);

// Every admin page and every Server Action that changes data calls this first. A layout
// check alone isn't enough, because Server Actions can be called directly.
const requireAdminSession = async (): Promise<AdminSession> => {
  const session = await getCurrentSession();
  if (!session) redirect("/admin/sign-in");
  return session;
};

export default requireAdminSession;
