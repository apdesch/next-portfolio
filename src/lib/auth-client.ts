import { createAuthClient } from "better-auth/react";

// Browser side of Better Auth. Sign-in goes through it (not a Server Action) because
// Better Auth only rate-limits requests that reach its /api/auth handler.
const authClient = createAuthClient();

export default authClient;
