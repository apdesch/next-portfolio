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

## Colour

All colours come from one hue (20) and a single amber accent.

| Token            | Original value            | Hex       | Use                                                             |
| ---------------- | ------------------------- | --------- | --------------------------------------------------------------- |
| `primary-dark`   | `hsl(20 0% 8%)`           | `#141414` | Light mode text; dark mode background                           |
| `primary-darker` | `hsl(20 0% 0%)` (clamped) | `#000000` | Button text                                                     |
| `primary-light`  | `hsl(20 40% 92%)`         | `#f3e8e2` | Light mode background (warm off-white); dark mode text; buttons |
| `highlight`      | `hsl(36.6 92.2% 30%)`     | `#935c06` | Text selection colour, light mode                               |
| `highlight-dark` | `hsl(36.5 70.2% 50%)`     | `#d99326` | Text selection colour, dark mode                                |

- Light mode: warm off-white background, near-black text.
- Dark mode (follows the OS setting, no toggle):
  - Colours invert: near-black background, off-white text.
  - The whole page shows `alta-plaza.jpg` (1920×1080) as a fixed, full-cover background photo.
  - Content sits on a dark overlay, `hsla(0 0% 5% / 0.6)`.
  - Content cards on About and Resume are frosted glass: `hsla(20 0% 8% / 0.5)` with `backdrop-filter: blur(40px)`.
- Selecting text recolours it with the amber accent but keeps the background.
- Custom WebKit scrollbar: dark track; thumb `hsla(53 23% 79% / 0.4)`, 10px radius, 4px dark border.

## Typography

- **Font:** Poppins, weights 400, 600 and 800, for the whole public site. The body fallback is the system font stack.
- **Fluid base size:** `calc(0.35vw + 0.5em)` on the layout, dropping to `0.8em` below `54em`. All other sizes are `em`, so everything scales with the viewport.
- **Headings:** weight 400 by default, `text-rendering: geometricPrecision`, no margin.

| Element               | Size    | Weight | Other                                                                                        |
| --------------------- | ------- | ------ | -------------------------------------------------------------------------------------------- |
| Site title "apdesch"  | `6em`   | 600    | Chromatic-aberration text shadow (red, yellow, blue, cyan offsets), line height 1.3          |
| Page `h1`             | `2.4em` | 400    | Uppercase, `0.5em` bottom margin                                                             |
| Global nav links      | `1.8em` | 400    | Uppercase                                                                                    |
| Project title `h2`    | `3em`   | 400    |                                                                                              |
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
  - Skills are inline uppercase "chips" at `0.9em`: inverted colours (text colour as background), 2px radius.
- **Videos:** responsive 16:9 YouTube embeds (`youtube-nocookie.com`), each with a caption below, right-aligned at `1.1em`.
- **Photo galleries:** grouped by category, a justified row layout (target row height 150px), and a click-to-open lightbox with fullscreen, slideshow and zoom.
- **About:** square portrait (`portrait.jpg`, 960×960), then a bio aligned right, then skills in two columns (engineering, video production).
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
   > I also work in video production: editing, cinematography, colour grading and sound design.
   >
   > I'm now looking for my next engineering role.
9. **Resume:** take the work history from the November 2026 resumes, newest first:
   - **Portfolio rebuild:** this project (Next.js 16, TypeScript, Postgres/Drizzle, auth, CI/CD on Vercel).
   - **Video Production:** January 2021 – present. Editing, cinematography, colour grading, sound design.
   - **RIMOWA, Client Care Specialist:** December 2023 – November 2026, with all three bullets from the resume.
   - **Engineering roles:** as on the resume, keeping the "Acquired" badge on Total Brain (SonderMind) and Mya Systems (StepStone). Use these details:
     - Barn & Willow: "10x increase in monthly revenue"
     - Hot Shot Media: "Front End UI Engineer"
   - **Education:** The Art Institute of California – San Francisco, AS, Web Design and Interactive Media (2006–2009).
   - **Highlights** from the LinkedIn summary, for the About or Resume page: built the foundation of a video editor with 100,000 daily active users, and helped grow two companies to acquisition.
10. **Placeholder images:** placehold.co, requested as PNG (not its default SVG). `next.config.ts` allows only `https://placehold.co`. Removed when real images arrive.
11. **Engineering skills:** the existing list, then Next.js, Tailwind CSS, Playwright and "AI-assisted development (Claude Code)" added at the end.

## Open questions (need your decision)

1. **Gallery and lightbox.** These need either two dependencies (a photo-album layout and a lightbox) or custom code. I'll propose options when we reach the Portfolio page.
