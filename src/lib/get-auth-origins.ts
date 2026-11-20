// Environment variables, such as process.env. This reads BETTER_AUTH_URL and Vercel's
// VERCEL_ENV, VERCEL_PROJECT_PRODUCTION_URL, VERCEL_BRANCH_URL and VERCEL_URL, which Vercel
// sets automatically on every deployment as host names without "https://".
type AuthEnvironment = Readonly<Record<string, string | undefined>>;

type AuthOrigins = { baseURL?: string; trustedOrigins: string[] };

const toHttpsOrigin = (host: string): string => `https://${host}`;

// Where the admin can sign in. Locally, BETTER_AUTH_URL from .env.local. On Vercel, the
// production address (apdesch.com once the domain is added), or for a preview, its own
// address and its branch address. Sign-in requests from any other site are refused.
const getAuthOrigins = (environment: AuthEnvironment): AuthOrigins => {
  if (environment.BETTER_AUTH_URL) {
    return {
      baseURL: environment.BETTER_AUTH_URL,
      trustedOrigins: [environment.BETTER_AUTH_URL],
    };
  }
  const deploymentHosts =
    environment.VERCEL_ENV === "production"
      ? [environment.VERCEL_PROJECT_PRODUCTION_URL, environment.VERCEL_URL]
      : [environment.VERCEL_BRANCH_URL, environment.VERCEL_URL];
  const trustedOrigins = deploymentHosts
    .filter((host): host is string => Boolean(host))
    .map(toHttpsOrigin);
  return { baseURL: trustedOrigins[0], trustedOrigins };
};

export default getAuthOrigins;
