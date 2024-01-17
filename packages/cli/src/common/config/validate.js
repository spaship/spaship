const Ajv = require("ajv");
const yaml = require("js-yaml");
const fs = require("fs");

const ajv = new Ajv({ allErrors: true });

const schema = {
  $id: "http://example.com/schemas/schema.json",
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "SPAshipConfig",
  type: "object",
  additionalProperties: false,
  properties: {
    path: {
      description: "the URL path at which to deploy the SPA",
      type: "string",
    },
    name: {
      description: "the human-readable title of the SPA",
      type: "string",
    },
    single: {
      description:
        "whether to serve $path/index.html for all non-asset routes. use this if you are using HTML5 pushState for client-side routing.",
      type: "boolean",
    },
    ref: {
      description: "the git ref (tag, branch, commit hash) tied to this deployment",
      type: "string",
    },
    buildDir: {
      description: "a directory to package and deploy (can be used instead of uploading a zip file)",
      type: "string",
    },
    builddir: {
      description: "a directory to package and deploy (can be used instead of uploading a zip file)",
      type: "string",
    },
  },
  required: ["path", "name"],
};
const validate = (data) => {
  const validateJSON = ajv.compile(schema);
  const valid = true;
  const errors = validateJSON.errors;
  return {
    valid,
    errors,
  };
};

module.exports = validate;
