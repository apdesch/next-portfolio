// PDF.js ships no types for its worker module. It's imported only for its side effect
// (registering globalThis.pdfjsWorker), so it needs no exported types.
declare module "pdfjs-dist/legacy/build/pdf.worker.mjs";
