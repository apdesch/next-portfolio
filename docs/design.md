# Original design reference

Taken from the 2021 portfolio (`apdesch/react-portfolio`, `client/src`). This records how the public
site looks and behaves so the rebuild can match it. The old code is not copied; these values become
Tailwind v4 `@theme` tokens once approved.

## Routes

| Path      | Page                                                                 |
| --------- | -------------------------------------------------------------------- |
| `/`       | Portfolio: videos, engineering work, photo galleries                 |
| `/resume` | Engineering resume                                                   |
| `/about`  | Portrait, bio, skills                                                |
| `*`       | Not found: title plus "The page you are looking for does not exist." |

Every public page shares one layout: the header block (title, nav, social links) sits above the page
content. The intro blurb shows only on `/`.

## Color

All colors come from one hue (20) and a single amber accent.

| Token            | Original value            | Hex       | Use                                                             |
| ---------------- | ------------------------- | --------- | --------------------------------------------------------------- |
| `primary-dark`   | `hsl(20 0% 8%)`           | `#141414` | Light mode text; dark mode background                           |
| `primary-darker` | `hsl(20 0% 0%)` (clamped) | `#000000` | Button text                                                     |
| `primary-light`  | `hsl(20 40% 92%)`         | `#f3e8e2` | Light mode background (warm off-white); dark mode text; buttons |
| `highlight`      | `hsl(36.6 92.2% 30%)`     | `#935c06` | Text selection color, light mode                                |
| `highlight-dark` | `hsl(36.5 70.2% 50%)`     | `#d99326` | Text selection color, dark mode                                 |

- Light mode: warm off-white background, near-black text.
- Dark mode (follows the OS setting, no toggle):
  - Colors invert: near-black background, off-white text.
  - The whole page shows `alta-plaza.jpg` (1920×1080) as a fixed, full-cover background photo.
  - Content sits on a dark overlay, `hsla(0 0% 5% / 0.6)`.
  - Content cards on About and Resume are frosted glass: `hsla(20 0% 8% / 0.5)` with `backdrop-filter: blur(40px)`.
- Selecting text recolors it with the amber accent but keeps the background.
- Custom WebKit scrollbar: dark track; thumb `hsla(53 23% 79% / 0.4)`, 10px radius, 4px dark border.

## Typography

- **Font:** Poppins, weights 400, 600 and 800, for the whole public site. The body fallback is the system font stack.
- **Fluid base size:** `calc(0.35vw + 0.5em)` on the layout, dropping to `0.8em` below `54em`. All other sizes are `em`, so everything scales with the viewport.
- **Headings:** weight 400 by default, `text-rendering: geometricPrecision`, no margin.
- **Hierarchy (required):** typography matters. Heading sizes must step down with nesting: a heading is never as large as, or larger than, the heading of the section it sits in. Section titles (`h1`, `2.4em`) are always bigger than titles inside them (project, company and skill-group `h2`s). The original site broke this rule: project titles were `3em`, larger than their section title.

| Element               | Size    | Weight | Other                                                                                        |
| --------------------- | ------- | ------ | -------------------------------------------------------------------------------------------- |
| Site title "apdesch"  | `6em`   | 600    | Chromatic-aberration text shadow (red, yellow, blue, cyan offsets), line height 1.3          |
| Page `h1`             | `2.4em` | 400    | Uppercase, `0.5em` bottom margin                                                             |
| Global nav links      | `1.8em` | 400    | Uppercase                                                                                    |
| Project title `h2`    | `2em`   | 400    | Below the `2.4em` section title (the original `3em` broke the hierarchy)                     |
| Resume group `h2`     | `1.8em` | 400    | Uppercase ("Experience", "Education"), between the page title and company names              |
| Company / skill group | `1.5em` | 400    | Resume company `h3`, About skill-group `h2`                                                  |
| Project subtitle `h4` | `1.1em` | 400    |                                                                                              |
| Paragraphs            |         |        | Line height `calc(1ex / 0.32)`, max width `24em` in the header, justified in blurb and About |
| List items            |         |        | Line height 1.6                                                                              |

## Layout

- The layout is a single centred column with flex children spaced evenly (`space-around`).
- Page content is at most `58em` wide, with `4em` vertical padding.
- Articles have a `3em` bottom margin, and so do their sections.
- **One breakpoint, `54em`:** below it, the base font drops to `0.8em`, side padding becomes `1em`, paragraphs go full width, and project grids stack.
- **Header block:** title, then nav (`padding: 3em 0 2em`, links spread evenly), then the blurb (home page only), then social links.
- **Social links:** GitHub, Wellfound and Instagram icons at `2.2em`, spread evenly in a row at most `10em` wide.
- **Project entry:**
  - A two-column grid with the image and text side by side, bottom-aligned with a `1em` gap.
  - `direction: rtl` puts the image on the right; the text sections reset to left-to-right.
  - Skills are inline uppercase "chips" at `0.9em`: inverted colors (text color as background), 2px radius.
- **Videos:** responsive 16:9 YouTube embeds (`youtube-nocookie.com`), each with a caption below, right-aligned at `1.1em`.
- **Photo galleries:** grouped by category, a justified row layout (target row height 150px), and a click-to-open lightbox with fullscreen, slideshow and zoom.
- **About** (redesigned November 2026):
  - Large screens: the portrait in a left column about a third wide, with the bio and highlights beside it.
  - Phones: stacked, with the photo capped at `20em`.
  - Skills: two columns (engineering, video production) of chips in the same style as the project skill chips.
  - Skill chips (here and on projects) don't animate. A scroll-triggered pop-in was tried and removed, because it looked bad when chips loaded just past the fold.
  - The original layout was a full-width portrait, then a bio aligned right, then plain skill lists.
- **Resume:** a section per company with an `h2` and a bullet list. An "Acquired" badge sits next to some company names:
  - `11px`, uppercase, `0.4em` radius, `0 10px` padding
  - light background with dark text

## Motion

Everything animates in once on page load. There's no hover animation; links have no underline.

| Element      | Animation                                                                                                                                               |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Whole layout | Fade in, 1s ease-out                                                                                                                                    |
| Site title   | "Peek up": clip-path reveal plus slide up from below, 500ms ease-out; then the link tilts to −5° (250ms ease-in, 500ms delay, origin at the right edge) |
| Nav links    | "Peek down": clip-path reveal plus slide down, 500ms, staggered 200ms per link                                                                          |
| Home blurb   | "Wipe left": clip-path reveal left to right, 1.2s, 200ms delay                                                                                          |
| Social icons | "Pop in": scale 0.1→1 with overshoot (`cubic-bezier(0.175, 0.885, 0.32, 1.275)`), 500ms, staggered 300ms                                                |

There are also `wipeRight` and `slightZoomOut` keyframes, but nothing uses them.

## Assets the design needs

- `alta-plaza.jpg`: the dark mode background photo.
- `portrait.jpg`: the About page portrait.
- `favicon.ico`: the original favicon. It replaces the Next.js default.
- Icons: GitHub, AngelList/Wellfound and Instagram (Font Awesome set).
- Project images and gallery photos: these lived in MongoDB and the uploads folder on the Droplet, not in the repo.

## Decisions

1. **Search engines:** allow indexing and keep blocking AI crawlers. The old block was only meant to last until launch.
2. **Reduced motion:** keep every animation, but show the final state at once when the OS "reduce motion" setting is on.
3. **Dark mode background:** use a fixed full-screen layer behind the content, so it also works on iOS Safari.
4. **Icons:** inline the GitHub, Wellfound and Instagram SVGs as small components. No icon dependency.
5. **Page transitions:** deferred to the final polish stage, after the design is complete and all features work.
6. **Project and gallery images:** placeholder images (not AI-generated) until the Droplet export.
7. **Home blurb:**
   > Software engineer in San Francisco. A decade-plus of building React apps for startups, from video editing to healthcare.
   >
   > Open to new engineering roles. Get in touch.
8. **About bio:** video production and engineering are kept separate, so the bio doesn't link them.
   > I'm a software engineer from San Francisco with over a decade of experience building web applications across social media, photography, content creation, e-commerce, healthcare and gaming. I have a degree in Web Design and Interactive Media from The Art Institute of California – San Francisco.
   >
   > I also work in video production: editing, cinematography, color grading and sound design.
   >
   > I'm now looking for my next engineering role.
9. **Resume:** take the work history from the November 2026 resumes, newest first:
   - **Portfolio rebuild:** this project (Next.js 16, TypeScript, Postgres/Drizzle, auth, CI/CD on Vercel).
   - **Video Production:** January 2021 – present. Editing, cinematography, color grading, sound design.
   - **RIMOWA, Client Care Specialist:** December 2023 – November 2026, with all three bullets from the resume.
   - **Engineering roles:** as on the resume, keeping the "Acquired" badge on Total Brain (SonderMind) and Mya Systems (StepStone). Use these details:
     - Barn & Willow: "10x increase in monthly revenue"
     - Hot Shot Media: "Front End UI Engineer"
   - **Education:** The Art Institute of California – San Francisco, AS, Web Design and Interactive Media (2006–2009).
   - **Highlights** from the LinkedIn summary, for the About or Resume page: built the foundation of a video editor with 100,000 daily active users, and helped grow two companies to acquisition.
10. **Placeholder images:** placehold.co, requested as PNG (not its default SVG). `next.config.ts` allows only `https://placehold.co`. Removed when real images arrive.
11. **Engineering skills:** the existing list, then Next.js, Tailwind CSS, Playwright and "AI-assisted development (Claude Code)" added at the end.

12. **Gallery and lightbox:** custom, with no dependencies. Justified rows in CSS (`--gallery-row-height`), and a lightbox built on the native `<dialog>` element (previous/next, arrow keys, Esc, fullscreen; no zoom or slideshow).

## SEO

- **Robots (`src/app/robots.ts`):** all crawlers allowed, except AI training crawlers (GPTBot, ClaudeBot, anthropic-ai, Google-Extended, Applebot-Extended, CCBot, Bytespider, meta-externalagent). AI search crawlers (OAI-SearchBot, PerplexityBot) stay allowed, so the site can appear in AI search answers. robots.txt is honored by reputable crawlers but not enforced; Vercel Firewall bot rules can enforce it later.
- **Old `noai` / `noimageai` meta tags:** dropped. They're non-standard, and robots.txt replaces them.
- **Sitemap (`src/app/sitemap.ts`):** `/`, `/resume`, `/about`.
- **Page metadata:** every page builds its title, description, canonical URL and Open Graph tags with `getPageMetadata` (`src/lib/page-metadata.ts`). Next merges metadata shallowly, so pages can't inherit Open Graph fields.
- **Share image (`src/app/opengraph-image.tsx`):** 1200×630. It shows the dark mode photo under the overlay, with "apdesch" in Poppins (tilted, chromatic shadow) and "Adam Deschamp · Software Engineer".
  - It uses a 1200×675 copy of the photo (`src/assets/share-background.jpg`) to stay under `ImageResponse`'s 500KB limit.
  - The image renderer (Satori) can't use Tailwind classes or CSS variables, so its colors are inline copies of the `globals.css` tokens.
- **Structured data:** a JSON-LD `Person` (name, job title, San Francisco, social profiles) on the home page.

## Planned: project detail pages (not scheduled)

A possible future feature: a detailed post for each project. Nothing is built yet; this records how it fits the SEO setup.

- **Route:** `src/app/(site)/projects/[slug]/page.tsx`, prerendered with `generateStaticParams` from project content (published projects only).
- **Content:** projects gain a `slug` and a post body when the feature is built.
- **Metadata:** `generateMetadata` reuses `getPageMetadata` with the project's title, description and `/projects/{slug}` path. It passes the project's own share image instead of the site image.
- **Share image:** `src/app/(site)/projects/[slug]/opengraph-image.tsx` renders the project thumbnail and title in the same style as the site share image, so links shared on LinkedIn, Slack or iMessage show that project.
- **Sitemap:** project URLs generated from published projects.
- **Edge case:** social platforms cache previews. After changing a project's image or title, refresh the preview with LinkedIn's Post Inspector or the platform's equivalent.
