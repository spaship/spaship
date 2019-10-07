const read = require("./read");
const write = require("./write");
const validate = require("./validate");
const { assign } = require("lodash");

async function append(filename, data) {
  console.log(`appending ${data}`);
  const current = await read(filename);
  const combined = assign({}, current, data);

  const valid = validate(combined);
  if (!valid) {
    throw new Error(`invalid config`);
  }

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
