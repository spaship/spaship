// Write a spaship.yaml file
//
// TODO copy code over from @spaship/cli

const fsp = require("fs").promises;
const yaml = require("js-yaml");
const shortid = require("shortid");

async function write(filename, data, addkey = true) {
  if (!data.deploykey) {
    data.deploykey = "dk-" + shortid.generate();
  }
  await fsp.writeFile(filename, yaml.safeDump(data));
  return data;
}

module.exports = write;

if (require.main === module) {
  write("spaship.yaml", { name: "Foo", path: "/foo/bar", single: true }).then(
    data => {
      console.log("wrote the following data", data);
    }
  );
}
