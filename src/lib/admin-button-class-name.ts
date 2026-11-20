// The admin's primary (amber) button, for buttons and button-styled links. not-disabled:
// keeps the hover color off disabled buttons and, unlike enabled:, also applies to links.
const adminButtonClassName =
  "rounded-md bg-admin-accent px-4 py-2 text-sm font-medium text-white not-disabled:hover:bg-admin-accent/90 disabled:opacity-60 dark:bg-admin-accent-dark dark:text-admin-dark dark:not-disabled:hover:bg-admin-accent-dark/90";

export default adminButtonClassName;
