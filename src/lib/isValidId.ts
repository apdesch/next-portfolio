// Row IDs (projects, files) arrive from the URL or from a Server Action's bound argument,
// so check them before they reach a query.
const isValidId = (rowId: number): boolean =>
  Number.isSafeInteger(rowId) && rowId > 0;

export default isValidId;
