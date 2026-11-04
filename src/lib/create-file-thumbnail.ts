import "server-only";
import { join } from "node:path";
import { createCanvas, GlobalFonts } from "@napi-rs/canvas";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import sharp from "sharp";

// Thumbnails are drawn at twice their final size, then scaled down for crisp edges.
const thumbnailWidth = 240;
const drawingWidth = thumbnailWidth * 2;
// A US Letter page's proportions, for text previews.
const drawingHeight = Math.round(drawingWidth * (11 / 8.5));

const fontsDirectory = join(process.cwd(), "src/assets/fonts");
const pdfjsStandardFontsDirectory = join(
  process.cwd(),
  "node_modules/pdfjs-dist/standard_fonts/",
);

// Vercel's servers have almost no fonts, so text previews use one shipped with the app.
GlobalFonts.registerFromPath(
  join(fontsDirectory, "JetBrainsMono-Regular.ttf"),
  "JetBrains Mono",
);

const saveThumbnail = async (pngBytes: Buffer): Promise<Buffer> =>
  sharp(pngBytes)
    .resize({ width: thumbnailWidth })
    .webp({ quality: 80 })
    .toBuffer();

// Renders the first page with PDF.js's core library, which draws pages but never runs a
// PDF's scripts (only the full viewer can).
const createPdfThumbnail = async (pdfBytes: Uint8Array): Promise<Buffer> => {
  const loadingTask = getDocument({
    // A copy: PDF.js may take over (and empty) the array it's given, and the caller
    // still needs the original bytes to store the PDF.
    data: pdfBytes.slice(),
    standardFontDataUrl: pdfjsStandardFontsDirectory,
  });
  try {
    const pdfDocument = await loadingTask.promise;
    const firstPage = await pdfDocument.getPage(1);
    const viewport = firstPage.getViewport({
      scale: drawingWidth / firstPage.getViewport({ scale: 1 }).width,
    });
    const canvas = createCanvas(
      Math.ceil(viewport.width),
      Math.ceil(viewport.height),
    );
    // PDF.js is typed for the browser's canvas; @napi-rs/canvas is its server stand-in.
    await firstPage.render({
      canvas: canvas as unknown as HTMLCanvasElement,
      viewport,
    }).promise;
    return await saveThumbnail(canvas.toBuffer("image/png"));
  } finally {
    await loadingTask.destroy();
  }
};

const textPaddingPixels = 24;
const textFontSizePixels = 15;
const textLineHeightPixels = 22;
const textLineCount = Math.floor(
  (drawingHeight - textPaddingPixels * 2) / textLineHeightPixels,
);

// The first lines of the file on a white page, so a preview looks like the document.
// Long lines are cut off at the margin, as in a narrow editor window, not squeezed.
const createTextThumbnail = async (text: string): Promise<Buffer> => {
  const canvas = createCanvas(drawingWidth, drawingHeight);
  const context = canvas.getContext("2d");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, drawingWidth, drawingHeight);
  context.beginPath();
  context.rect(
    textPaddingPixels,
    textPaddingPixels,
    drawingWidth - textPaddingPixels * 2,
    drawingHeight - textPaddingPixels * 2,
  );
  context.clip();
  context.fillStyle = "#141414";
  context.font = `${textFontSizePixels}px "JetBrains Mono"`;
  context.textBaseline = "top";
  text
    .replaceAll("\t", "  ")
    .split(/\r?\n/)
    .slice(0, textLineCount)
    .forEach((line, lineIndex) => {
      context.fillText(
        line,
        textPaddingPixels,
        textPaddingPixels + lineIndex * textLineHeightPixels,
      );
    });
  return saveThumbnail(canvas.toBuffer("image/png"));
};

// Throws if a PDF can't be read; the upload action reports that to the form.
const createFileThumbnail = async (
  kind: "pdf" | "text",
  bytes: Uint8Array,
): Promise<Buffer> =>
  kind === "pdf"
    ? createPdfThumbnail(bytes)
    : createTextThumbnail(new TextDecoder().decode(bytes));

export default createFileThumbnail;
