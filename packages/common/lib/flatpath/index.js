function toDir(urlPath) {
  let flatPath;

  // handle root path
  if (urlPath === "/") {
    flatPath = "root";
  } else {
    flatPath = urlPath
      .replace(/^\//, "") // Trim off leading /
      .replace(/_/g, "__") // Escape underscores with double underscore
      .replace(/\//g, "_"); // Convert normal path to flat path by replacing / with _
  }

  return flatPath;
}

module.exports = { toDir };

if (require.main === module) {
  ["/foo", "/foo/bar", "/foo/bar/baz", "/foo/bar_baz_bif/bof"]
    .map(p => ({ url: p, dir: toDir(p) }))
    .forEach(f => console.log(`urlPath: ${f.url}\ndirPath: ${f.dir}`));
}
