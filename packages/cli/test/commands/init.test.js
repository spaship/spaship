const { expect, test } = require("@oclif/test");
const fsp = require("fs").promises;

async function clean() {
  console.log(`removing any existing spaship.yaml file`);
  await fsp.unlink("spaship.yaml");
}
describe("init", () => {
  // test
  //   .stdout()
  //   .command(["init"])
  //   .it("runs hello", ctx => {
  //     expect(ctx.stdout).to.contain("hello world");
  //   });

  test
    .stdout()
    .do(clean)
    .finally(clean)
    .command(["init", "--name", "Foo", "--path", "/foo"])
    .it("runs init --name Foo --path /foo", async ctx => {
      expect(ctx.stdout).to.contain("Generated spaship.yaml");
      const yaml = (await fsp.readFile("spaship.yaml")).toString();
      expect(yaml).to.contain("SPAship config file");
      expect(yaml).to.contain("name: Foo");
      expect(yaml).to.contain("path: /foo");
      expect(yaml).to.contain("deploykey: ");
    });
});
