const read = require("./read");
const write = require("./write");
const validate = require("./validate");
const { assign } = require("lodash");

async function append(filename, data) {
  let current = {};

  // try to load an existing spaship.yaml.
  try {
    current = await read(filename);
  } catch (e) {
    /* if it doesn't exist, assume settings are coming from the POST */
  }
  const combined = assign({}, current, data);

  await write(filename, combined);

  return combined;
}

module.exports = append;

if (require.main === module) {
  (async () => {
    const data = read("spaship.yaml");
    const extra = { ref: "v1.0.0" };
    console.log(`starting with...`);
    console.log(data);
    console.log(`appending...`);
    console.log(extra);
    await append("spaship.yaml", extra);
    console.log(`result...`);
    console.log(await read("spaship.yaml"));
  })();
}
