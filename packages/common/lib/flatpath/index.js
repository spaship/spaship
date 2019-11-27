function toDir(urlPath) {
  return urlPath
    .replace(/^\//, "") // Trim off leading /
    .replace(/_/g, "UNDRSCR") // Escape underscores with UNDRSCR token
    .replace(/\//g, "_"); // Convert normal path to flat path by replacing / with _
}

function toUrl(flatDir) {
  return (
    "/" +
    flatDir
      .replace(/_/g, "/") // Replace _ with /
      .replace(/UNDRSCR/g, "_") // Replace UNDRSCR token with _
  );
}

module.exports = { toDir, toUrl };
