import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import auth from "@/lib/auth";

type AdminSession = typeof auth.$Infer.Session;

// Every admin page and every Server Action that changes data calls this first. A layout
// check alone isn't enough, because Server Actions can be called directly.
const requireAdminSession = async (): Promise<AdminSession> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/admin/sign-in");
  return session;
};

export default requireAdminSession;
