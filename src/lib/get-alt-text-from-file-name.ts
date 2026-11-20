// A starting description for photos uploaded in a batch, where one alt text box can't
// describe each photo: "golden-gate_at-dusk.jpg" becomes "Golden gate at dusk".
// The admin shows each photo's description so it can be improved on its edit page.
const getAltTextFromFileName = (fileName: string): string => {
  const words = fileName
    .replace(/\.[^./\\]*$/, "")
    .replace(/[-_.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (words === "") return "Photo";
  return words.charAt(0).toUpperCase() + words.slice(1);
};

export default getAltTextFromFileName;
