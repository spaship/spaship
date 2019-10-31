const read = require("./read");
const write = require("./write");
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
