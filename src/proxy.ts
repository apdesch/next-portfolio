import { type NextRequest, NextResponse } from "next/server";
import auth from "@/lib/auth";

// Runs before any /admin page renders (except sign-in) and sends a real 307 redirect when
// there's no valid session. A second layer only: Server Actions and admin data functions
// still check the session themselves.
const proxy = async (request: NextRequest): Promise<NextResponse> => {
  const session = await auth.api.getSession({ headers: request.headers });
  if (session) return NextResponse.next();
  return NextResponse.redirect(new URL("/admin/sign-in", request.url));
};

export const config = { matcher: ["/admin", "/admin/((?!sign-in$).*)"] };

export default proxy;
