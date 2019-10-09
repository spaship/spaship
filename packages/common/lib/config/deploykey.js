const shortid = require("shortid");

const generate = () => shortid.generate();

module.exports = { generate };

if (require.main === module) {
  console.log(`deploykey: ${generate()}`);
}
