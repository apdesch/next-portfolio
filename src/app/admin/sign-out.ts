"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import auth from "@/lib/auth";

// Server Action: deletes the session row; Better Auth's nextCookies plugin clears the cookie.
const signOut = async (): Promise<void> => {
  await auth.api.signOut({ headers: await headers() });
  redirect("/admin/sign-in");
};

export default signOut;
