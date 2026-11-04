// IDs arrive from the URL or from a Server Action's bound argument, so check them before
// they reach a query.
const isValidProjectId = (projectId: number): boolean =>
  Number.isSafeInteger(projectId) && projectId > 0;

export default isValidProjectId;
