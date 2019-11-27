// This is a very simplified reimplementation of the console object.  It's meant to be used inside test cases, when
// mock-fs is enabled.  For some reason (https://github.com/tschaub/mock-fs/issues/234) while mock-fs is used inside a
// jest test case, console is non-functional.
//
// This package uses process.stdout.write instead, and does some naive formatting to make it act basically the same as
// console.log.  Using this is meant to be easier than training developers where it is unsafe to use console.log.
//
// Usage:
//
//    global.console = require("../__mocks__/console");
//
// Just adjust the require path to point to this package.

function format(entry) {
  if (typeof entry === "object") {
    try {
      return JSON.stringify(entry);
    } catch (e) {}
  }

  return entry;
}

function log(...msgs) {
  process.stdout.write(msgs.map(format).join(" ") + "\n");
}

module.exports = {
  log,
  warn: log,
  error: log
};
