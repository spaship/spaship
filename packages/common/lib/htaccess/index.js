const path = require("path");
const fsp = require("fs").promises;
const hbs = require("handlebars");
const validate = require("../config/validate");

const templatePath = path.join(__dirname, "htaccess.hbs");

async function generate(data) {
  const validation = validate(data);
  if (!validation.valid) {
    throw new Error(`config not valid: ${JSON.stringify(validation.errors)}`);
  }
  const templateFile = await fsp.readFile(templatePath);
  const template = hbs.compile(templateFile.toString());
  // console.log(`template:\n${templateFile}`);
  return template(data);
}

async function write(destDir, data) {
  const htaccess = await generate(data);
  await fsp.writeFile(path.join(destDir, ".htaccess"), htaccess);
}

module.exports = { generate, write };

if (require.main === module) {
  (async () => {
    console.log(
      await generate({
        name: "Test Name",
        path: "/test/path",
        single: true
      })
    );

    console.log(
      await generate({
        name: "Test Name 2",
        path: "/test/path/two"
      })
    );

    // this should error
    console.log(
      await generate({
        name: "Test Name 2",
        path: "/test/path/two",
        x: 42
      })
    );
  })();
}
