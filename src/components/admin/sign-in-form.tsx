"use client";

import { useRouter } from "next/navigation";
import { type FC, useActionState } from "react";
import ButtonLabel from "@/components/admin/button-label";
import adminInputClassName from "@/lib/admin-input-class-name";
import authClient from "@/lib/auth-client";

type SignInState = { email: string; errorMessage: string | null };

const initialSignInState: SignInState = { email: "", errorMessage: null };

const tooManyRequestsStatus = 429;

const getSignInErrorMessage = (status: number): string =>
  status === tooManyRequestsStatus
    ? "Too many attempts. Wait a few minutes and try again."
    : "Wrong email or password.";

const SignInForm: FC = () => {
  const router = useRouter();

  // React resets the form after each submission, so the state carries the email back
  // into the field after a failed attempt.
  const [state, submitSignIn, isPending] = useActionState(
    async (_previousState: SignInState, formData: FormData) => {
      const email = String(formData.get("email"));
      const { error } = await authClient.signIn.email({
        email,
        password: String(formData.get("password")),
      });
      if (error) {
        return { email, errorMessage: getSignInErrorMessage(error.status) };
      }
      router.replace("/admin/projects");
      return initialSignInState;
    },
    initialSignInState,
  );

  return (
    <form action={submitSignIn} className="flex w-full max-w-xs flex-col gap-4">
      <h1 className="mt-0 mb-2 text-xl font-semibold">Sign in</h1>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          defaultValue={state.email}
          className={adminInputClassName}
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={adminInputClassName}
        />
      </div>
      {/* Always rendered and one line tall, so an error doesn't push the button down, and
          screen readers reliably announce a live region that already exists. */}
      <p
        role="alert"
        className="m-0 min-h-5 text-sm text-red-700 dark:text-red-400"
      >
        {state.errorMessage}
      </p>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-admin-accent px-4 py-2 text-sm font-medium text-white enabled:hover:bg-admin-accent/90 disabled:opacity-60 dark:bg-admin-accent-dark dark:text-admin-dark dark:enabled:hover:bg-admin-accent-dark/90"
      >
        <ButtonLabel
          isBusy={isPending}
          label="Sign in"
          busyLabel="Signing in…"
        />
      </button>
    </form>
  );
};

export default SignInForm;
