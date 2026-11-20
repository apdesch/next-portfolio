// YouTube's privacy-enhanced player, which doesn't set tracking cookies until played.
const getYoutubeEmbedUrl = (videoId: string): string =>
  `https://www.youtube-nocookie.com/embed/${videoId}`;

export default getYoutubeEmbedUrl;
