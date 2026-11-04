import { toNextJsHandler } from "better-auth/next-js";
import auth from "@/lib/auth";

// Better Auth answers every /api/auth/* request (sign in, sign out, session) here.
const authHandlers = toNextJsHandler(auth);

export const GET = authHandlers.GET;
export const POST = authHandlers.POST;
