const rootSPAPath = "ROOTSPA";

function toDir(urlPath) {
  // Specific for root path
  // #329 #350
  if (urlPath === "/") {
    return rootSPAPath;
  }
  return urlPath
    .replace(/^\//, "") // Trim off leading /
    .replace(/_/g, "UNDRSCR") // Escape underscores with UNDRSCR token
    .replace(/\//g, "_"); // Convert normal path to flat path by replacing / with _
}

function toUrl(flatDir) {
  // Specific for root path
  // #329 #350
  if (flatDir === rootSPAPath) {
    return "/";
  }
  return (
    "/" +
    flatDir
      .replace(/_/g, "/") // Replace _ with /
      .replace(/UNDRSCR/g, "_") // Replace UNDRSCR token with _
  );
}

module.exports = { toDir, toUrl };
