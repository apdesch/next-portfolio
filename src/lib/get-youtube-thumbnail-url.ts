// YouTube's 320×180 thumbnail ("mqdefault"), which is 16:9 with no letterbox bars.
const getYoutubeThumbnailUrl = (videoId: string): string =>
  `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;

export default getYoutubeThumbnailUrl;
