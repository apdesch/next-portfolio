import type { Metadata } from "next";
import type { FC } from "react";
import AdminWordmark from "@/components/admin/admin-wordmark";
import SignInForm from "@/components/admin/sign-in-form";

const SignInPage: FC = () => (
  <div className="grid min-h-dvh grid-rows-[auto_1fr]">
    <header className="flex h-14 items-center border-b border-admin-dark/10 bg-white/40 px-4 dark:border-admin-light/10 dark:bg-admin-light/5">
      <AdminWordmark />
    </header>
    {/* Extra bottom padding lifts the form above the true middle, where it looks centered. */}
    <main className="grid place-items-center p-6 pb-32">
      <SignInForm />
    </main>
  </div>
);

export const metadata: Metadata = { title: "Sign in" };

export default SignInPage;
