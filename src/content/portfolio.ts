export type Video = {
  youtubeId: string;
  title: string;
  caption: string;
};

export type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type Gallery = {
  category: string;
  photos: readonly Photo[];
};

// Projects live in Postgres (src/db); videos and galleries move there in a later step.
type Portfolio = {
  videos: readonly Video[];
  galleries: readonly Gallery[];
};

// PNG, not placehold.co's default SVG, so next/image never has to allow remote SVGs.
// No ?text= label: next.config.ts only allows placehold.co URLs without a query string.
const getPlaceholderImageUrl = (width: number, height: number): string =>
  `https://placehold.co/${width}x${height}/png`;

const createPlaceholderPhoto = (
  width: number,
  height: number,
  label: string,
): Photo => ({
  src: getPlaceholderImageUrl(width, height),
  alt: label,
  width,
  height,
});

const createPlaceholderGallery = (
  category: string,
  photoSizes: readonly (readonly [number, number])[],
): Gallery => ({
  category,
  photos: photoSizes.map(([width, height], index) =>
    createPlaceholderPhoto(width, height, `${category} photo ${index + 1}`),
  ),
});

const portfolio: Portfolio = {
  videos: [
    {
      youtubeId: "4-ZZnb3-eOA",
      title: "Coffee roaster spec ad b-roll",
      caption: "B-roll footage for coffee roaster spec ad.",
    },
    {
      youtubeId: "_ksmHf2Zd7Y",
      title: "The Palace of Fine Arts, San Francisco",
      caption: "The Palace of Fine Arts in San Francisco shot on an iPhone.",
    },
  ],
  galleries: [
    createPlaceholderGallery("Placeholder Gallery 1", [
      [1200, 800],
      [800, 1200],
      [1000, 1000],
      [1200, 675],
      [900, 1200],
      [1200, 800],
      [1080, 1350],
      [1200, 900],
    ]),
    createPlaceholderGallery("Placeholder Gallery 2", [
      [1200, 900],
      [1200, 675],
      [800, 1200],
      [1200, 800],
      [1000, 1000],
      [1200, 800],
    ]),
  ],
};

export default portfolio;
