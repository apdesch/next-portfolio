import { describe, expect, it } from "vitest";
import getAuthOrigins from "@/lib/getAuthOrigins";

const vercelHosts = {
  VERCEL_PROJECT_PRODUCTION_URL: "apdesch.com",
  VERCEL_BRANCH_URL: "next-portfolio-git-feature-apdesch.vercel.app",
  VERCEL_URL: "next-portfolio-abc123-apdesch.vercel.app",
};

describe("getAuthOrigins", () => {
  it("uses BETTER_AUTH_URL when it's set (local development)", () => {
    expect(
      getAuthOrigins({ BETTER_AUTH_URL: "http://localhost:3000" }),
    ).toEqual({
      baseURL: "http://localhost:3000",
      trustedOrigins: ["http://localhost:3000"],
    });
  });

  it("trusts the production address and this deployment's own in production", () => {
    expect(
      getAuthOrigins({ VERCEL_ENV: "production", ...vercelHosts }),
    ).toEqual({
      baseURL: "https://apdesch.com",
      trustedOrigins: [
        "https://apdesch.com",
        "https://next-portfolio-abc123-apdesch.vercel.app",
      ],
    });
  });

  it("trusts a preview's branch and deployment addresses, not production's", () => {
    expect(getAuthOrigins({ VERCEL_ENV: "preview", ...vercelHosts })).toEqual({
      baseURL: "https://next-portfolio-git-feature-apdesch.vercel.app",
      trustedOrigins: [
        "https://next-portfolio-git-feature-apdesch.vercel.app",
        "https://next-portfolio-abc123-apdesch.vercel.app",
      ],
    });
  });

  it("skips addresses Vercel didn't set", () => {
    expect(
      getAuthOrigins({
        VERCEL_ENV: "preview",
        VERCEL_URL: vercelHosts.VERCEL_URL,
      }),
    ).toEqual({
      baseURL: "https://next-portfolio-abc123-apdesch.vercel.app",
      trustedOrigins: ["https://next-portfolio-abc123-apdesch.vercel.app"],
    });
  });

  it("returns no base address outside Vercel without BETTER_AUTH_URL", () => {
    expect(getAuthOrigins({})).toEqual({
      baseURL: undefined,
      trustedOrigins: [],
    });
  });
});
