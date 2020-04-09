// This test file uses oclif's testing tools.
// See: https://oclif.io/docs/testing

const { expect, test } = require("@oclif/test");
const fsp = require("fs").promises;

async function clean() {
  console.log(`removing any existing spaship.yaml file`);
  try {
    await fsp.unlink("spaship.yaml");
  } catch (e) {}
}
describe("init", () => {
  test
    .stdout()
    .do(clean)
    .finally(clean)
    .command(["init", "--name", "Foo", "--path", "/foo"])
    .it("runs init --name Foo --path /foo", async (ctx) => {
      expect(ctx.stdout).to.contain("Generated spaship.yaml");
      const yaml = (await fsp.readFile("spaship.yaml")).toString();
      expect(yaml).to.contain("SPAship config file");
      expect(yaml).to.contain("name: Foo");
      expect(yaml).to.contain("path: /foo");
    });
});
