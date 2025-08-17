const generateLink = (podcastTitle: string, offset?: number): string => {
  return `${podcastTitle?.replace(/\s+/g, "-").toLowerCase()}${offset ?? ""}`;
};
export { generateLink };
