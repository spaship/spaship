const flatpath = require("./index");

describe("common/flatpath", () => {
  describe("map from URL to dir", () => {
    // test("should have a special mapping for root path", () => {
    //   expect(flatpath.toDir("/")).toEqual("");
    // });
    test("should trim leading '/'", () => {
      expect(flatpath.toDir("/foo")).toEqual("foo");
    });
    test("should encode '/' to '_'", () => {
      expect(flatpath.toDir("/foo/bar")).toEqual("foo_bar");
      expect(flatpath.toDir("/foo/bar/baz")).toEqual("foo_bar_baz");
    });
    test("should encode '_' to 'UNDRSCR'", () => {
      expect(flatpath.toDir("/_")).toEqual("UNDRSCR");
      expect(flatpath.toDir("/_foo")).toEqual("UNDRSCRfoo");
      expect(flatpath.toDir("/foo_")).toEqual("fooUNDRSCR");
      expect(flatpath.toDir("/foo_bar_")).toEqual("fooUNDRSCRbarUNDRSCR");
      expect(flatpath.toDir("/_foo_bar")).toEqual("UNDRSCRfooUNDRSCRbar");
      expect(flatpath.toDir("/foo_bar_baz")).toEqual("fooUNDRSCRbarUNDRSCRbaz");
      expect(flatpath.toDir("/_foo_bar_baz")).toEqual("UNDRSCRfooUNDRSCRbarUNDRSCRbaz");
      expect(flatpath.toDir("/foo_bar_baz_")).toEqual("fooUNDRSCRbarUNDRSCRbazUNDRSCR");

      expect(flatpath.toDir("/_foo")).toEqual("UNDRSCRfoo");
      expect(flatpath.toDir("/foo_")).toEqual("fooUNDRSCR");
      expect(flatpath.toDir("/foo_bar_")).toEqual("fooUNDRSCRbarUNDRSCR");
      expect(flatpath.toDir("/_foo_/bar")).toEqual("UNDRSCRfooUNDRSCR_bar");
      expect(flatpath.toDir("/foo_bar_baz")).toEqual("fooUNDRSCRbarUNDRSCRbaz");
      expect(flatpath.toDir("/_foo_bar/_baz")).toEqual("UNDRSCRfooUNDRSCRbar_UNDRSCRbaz");
      expect(flatpath.toDir("/foo_bar_ba/z_")).toEqual("fooUNDRSCRbarUNDRSCRba_zUNDRSCR");
    });

    test("should handle root path", () => {
      expect(flatpath.toDir("/")).toEqual("ROOTSPA");
    });
  });
  describe("map from dir to URL", () => {
    // test("should have a special mapping for root path", () => {
    //   expect(flatpath.toDir("")).toEqual("/");
    // });
    test("should restore leading '/'", () => {
      expect(flatpath.toUrl("foo")).toEqual("/foo");
    });
    test("should decode '_' to '/'", () => {
      expect(flatpath.toUrl("foo_bar")).toEqual("/foo/bar");
      expect(flatpath.toUrl("foo_bar_baz")).toEqual("/foo/bar/baz");
    });
    test("should decode 'UNDRSCR' to '_'", () => {
      expect(flatpath.toUrl("UNDRSCR")).toEqual("/_");
      expect(flatpath.toUrl("UNDRSCRfoo")).toEqual("/_foo");
      expect(flatpath.toUrl("fooUNDRSCR")).toEqual("/foo_");
      expect(flatpath.toUrl("fooUNDRSCRbarUNDRSCR")).toEqual("/foo_bar_");
      expect(flatpath.toUrl("UNDRSCRfooUNDRSCRbar")).toEqual("/_foo_bar");
      expect(flatpath.toUrl("fooUNDRSCRbarUNDRSCRbaz")).toEqual("/foo_bar_baz");
      expect(flatpath.toUrl("UNDRSCRfooUNDRSCRbarUNDRSCRbaz")).toEqual("/_foo_bar_baz");
      expect(flatpath.toUrl("fooUNDRSCRbarUNDRSCRbazUNDRSCR")).toEqual("/foo_bar_baz_");

      expect(flatpath.toUrl("UNDRSCRfoo")).toEqual("/_foo");
      expect(flatpath.toUrl("fooUNDRSCR")).toEqual("/foo_");
      expect(flatpath.toUrl("fooUNDRSCRbarUNDRSCR")).toEqual("/foo_bar_");
      expect(flatpath.toUrl("UNDRSCRfooUNDRSCR_bar")).toEqual("/_foo_/bar");
      expect(flatpath.toUrl("fooUNDRSCRbarUNDRSCRbaz")).toEqual("/foo_bar_baz");
      expect(flatpath.toUrl("UNDRSCRfooUNDRSCRbar_UNDRSCRbaz")).toEqual("/_foo_bar/_baz");
      expect(flatpath.toUrl("fooUNDRSCRbarUNDRSCRba_zUNDRSCR")).toEqual("/foo_bar_ba/z_");
    });

    test("should restore ROOTSPA dir", () => {
      expect(flatpath.toUrl("ROOTSPA")).toEqual("/");
    });
  });
});
