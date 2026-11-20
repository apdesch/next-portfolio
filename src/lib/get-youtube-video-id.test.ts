import { describe, expect, it } from "vitest";
import getYoutubeVideoId from "@/lib/get-youtube-video-id";

describe("getYoutubeVideoId", () => {
  it.each([
    "https://www.youtube.com/watch?v=4-ZZnb3-eOA",
    "https://youtube.com/watch?v=4-ZZnb3-eOA&t=42",
    "https://m.youtube.com/watch?v=4-ZZnb3-eOA",
    "https://youtu.be/4-ZZnb3-eOA",
    "https://www.youtube.com/embed/4-ZZnb3-eOA",
    "https://www.youtube-nocookie.com/embed/4-ZZnb3-eOA",
  ])("reads the ID from %s", (youtubeUrl) => {
    expect(getYoutubeVideoId(youtubeUrl)).toBe("4-ZZnb3-eOA");
  });

  it.each([
    "not a link",
    "https://vimeo.com/123456",
    "https://www.youtube.com/watch?v=too-short",
    'https://youtu.be/4-ZZnb3-eOA"><script>',
    "https://evil.example/watch?v=4-ZZnb3-eOA",
  ])("rejects %s", (youtubeUrl) => {
    expect(getYoutubeVideoId(youtubeUrl)).toBeNull();
  });
});
