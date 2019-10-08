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
      type: "string"
    },
    name: {
      description: "the human-readable title of the SPA",
      type: "string"
    },
    single: {
      description:
        "whether to serve $path/index.html for all non-asset routes. use this if you are using HTML5 pushState for client-side routing.",
      type: "boolean"
    },
    ref: {
      description:
        "the git ref (tag, branch, commit hash) tied to this deployment",
      type: "string"
    },
    deploykey: {
      description:
        "a unique key which allows re-deploying over existing bundles.",
      type: "string"
    }
  },
  required: ["path", "name"]
};
const validateJSON = ajv.compile(schema);
const validate = data => validateJSON(data);

module.exports = validate;

if (require.main === module) {
  const read = require("./read");
  read(process.argv[2] || "spaship.yaml").then(data => {
    console.log("Validating the following config object...");
    console.log(data);
    const valid = validate(data);
    if (!valid) console.log(validateJSON.errors);
    if (valid) console.log("YAML is valid!");
  });
}
