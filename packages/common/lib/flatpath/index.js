function toDir(urlPath) {
  return urlPath
    .replace(/^\//, "") // Trim off leading /
    .replace(/_/g, "UNDRSCR") // Escape underscores with UNDRSCR token
    .replace(/\//g, "_"); // Convert normal path to flat path by replacing / with _
}

function toUrl(flatDir) {
  return flatDir
    .replace(/_/g, "/") // Replace _ with /
    .replace(/UNDRSCR/g, "_"); // Replace UNDRSCR token with _
}

module.exports = { toDir, toUrl };

if (require.main === module) {
  ["/foo", "/foo/bar", "/foo/bar/baz", "/foo/bar_baz_bif/bof"]
    .map(p => ({ url: p, dir: toDir(p) }))
    .forEach(f => console.log(`urlPath: ${f.url}\ndirPath: ${f.dir}`));
}
