// Vercel caps a request at 4.5 MB, so uploads stop at 4 MB to leave room for form fields.
// next.config.ts raises the Server Action body limit to match.
const maximumUploadBytes = 4 * 1024 * 1024;

export default maximumUploadBytes;
