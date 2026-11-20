// YouTube video IDs are exactly 11 characters of letters, digits, "-" and "_". Checking
// the shape keeps anything unexpected in a stored link out of the embed URL.
const youtubeVideoIdPattern = /^[\w-]{11}$/;

const getVideoIdCandidate = (url: URL): string | null => {
  const hostname = url.hostname.replace(/^(www|m)\./, "");
  const isYoutubeHost =
    hostname === "youtube.com" || hostname === "youtube-nocookie.com";
  if (hostname === "youtu.be") return url.pathname.slice(1);
  if (!isYoutubeHost) return null;
  if (url.pathname.startsWith("/embed/")) return url.pathname.split("/")[2];
  return url.searchParams.get("v");
};

// Used by the home page's embeds and by the admin's video form, so a link the admin
// accepts is always one the home page can play.
const getYoutubeVideoId = (youtubeUrl: string): string | null => {
  if (!URL.canParse(youtubeUrl)) return null;
  const candidate = getVideoIdCandidate(new URL(youtubeUrl));
  if (candidate === null || !youtubeVideoIdPattern.test(candidate)) return null;
  return candidate;
};

export default getYoutubeVideoId;
