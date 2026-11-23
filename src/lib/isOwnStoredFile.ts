// Environment variables, such as process.env: the Blob key (BLOB_READ_WRITE_TOKEN) or, with
// Vercel's automatic sign-in (OIDC), BLOB_STORE_ID.
type BlobEnvironment = Readonly<Record<string, string | undefined>>;

// The Blob library reads the store's ID from the key ("vercel_blob_rw_<storeId>_<secret>")
// or from BLOB_STORE_ID; a public store's files live at "<storeId>.public.blob…".
const getOwnStoreHost = (environment: BlobEnvironment): string | null => {
  const storeId =
    environment.BLOB_STORE_ID ??
    environment.BLOB_READ_WRITE_TOKEN?.split("_")[3];
  if (!storeId) return null;
  const bareStoreId = storeId.replace(/^store_/, "").toLowerCase();
  return `${bareStoreId}.public.blob.vercel-storage.com`;
};

// Whether a file is in the store this deployment's key can change. Previews and local
// development use their own store, so their copies of production's rows point at files
// they must leave alone (their key couldn't delete them anyway). Placeholder images on
// placehold.co are never stored files.
const isOwnStoredFile = (
  url: string,
  environment: BlobEnvironment,
): boolean => {
  const ownStoreHost = getOwnStoreHost(environment);
  return (
    ownStoreHost !== null &&
    URL.canParse(url) &&
    new URL(url).hostname === ownStoreHost
  );
};

export default isOwnStoredFile;
