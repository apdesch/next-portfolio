import type { FC } from "react";
import socialProfiles from "@/content/social-profiles";
import siteUrl from "@/lib/site-url";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Adam Deschamp",
  jobTitle: "Software Engineer",
  url: siteUrl,
  address: {
    "@type": "PostalAddress",
    addressLocality: "San Francisco",
    addressRegion: "CA",
  },
  sameAs: socialProfiles.map((socialProfile) => socialProfile.url),
};

// Escaping "<" stops any value from closing the script tag early (Next.js docs recommendation).
const serializedPersonSchema = JSON.stringify(personSchema).replace(
  /</g,
  "\\u003c",
);

// Invisible to visitors; tells search engines who the site is about.
const PersonStructuredData: FC = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: serializedPersonSchema }}
  />
);

export default PersonStructuredData;
