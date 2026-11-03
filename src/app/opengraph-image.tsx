import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// ImageResponse renders with Satori, which can't use Tailwind classes or CSS variables,
// so values are inline. Colours mirror --color-* in globals.css.
const primaryLight = "#f3e8e2";
const darkOverlay = "rgba(13, 13, 13, 0.6)";
const chromaticTextShadow =
  "3px 0 4px rgba(255, 0, 0, 0.8), 4px 0 4px rgba(255, 255, 0, 0.8), -4px 0 4px rgba(39, 125, 255, 0.6), -3px 0 4px rgba(0, 255, 255, 0.8)";

// A 1200×675 copy of the dark mode photo keeps the image under ImageResponse's 500KB limit.
const poppinsSemiBold = await readFile(
  join(process.cwd(), "src/assets/fonts/Poppins-SemiBold.ttf"),
);
const backgroundPhoto = await readFile(
  join(process.cwd(), "src/assets/share-background.jpg"),
);
const backgroundPhotoUrl = `data:image/jpeg;base64,${backgroundPhoto.toString("base64")}`;

const OpenGraphImage = (): ImageResponse =>
  new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: primaryLight,
        fontFamily: "Poppins",
        backgroundImage: `linear-gradient(${darkOverlay}, ${darkOverlay}), url(${backgroundPhotoUrl})`,
        backgroundSize: "1200px 675px",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          fontSize: 180,
          lineHeight: 1.3,
          textShadow: chromaticTextShadow,
          transform: "rotate(-5deg)",
        }}
      >
        apdesch
      </div>
      <div style={{ fontSize: 44, marginTop: 24 }}>
        Adam Deschamp · Software Engineer
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: "Poppins", data: poppinsSemiBold, weight: 600 }],
    },
  );

export const alt = "apdesch: Adam Deschamp, Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default OpenGraphImage;
