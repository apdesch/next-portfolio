import type { Metadata } from "next";

const siteName = "Adam Deschamp";

type PageMetadataInput = {
  pageName: string | null;
  description: string;
  path: string;
};

// Next merges metadata shallowly: a page's openGraph object replaces the layout's
// entirely (including the generated share image), so every page builds the full set here.
const getPageMetadata = ({
  pageName,
  description,
  path,
}: PageMetadataInput): Metadata => {
  const fullTitle = pageName === null ? siteName : `${pageName} | ${siteName}`;

  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName,
      title: fullTitle,
      description,
      url: path,
      images: ["/opengraph-image"],
    },
  };
};

export default getPageMetadata;
