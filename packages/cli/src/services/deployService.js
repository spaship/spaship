const got = require("got");
const https = require("https");
const pkg = require("../../package.json");

const upload = async (url, data, apiKey, onUploadProgress) => {
  const options = {
    agent: {
      https: new https.Agent({
        rejectUnauthorized: false,
      }),
    },
    headers: {
      "user-agent": `@spaship/cli@${pkg.version} (https://github.com/spaship/spaship)`,
      "x-api-key": apiKey,
      ...data.getHeaders(),
    },
    body: data,
    responseType: "json",
  };

  try {
    const response = await got.post(url, options).on("uploadProgress", onUploadProgress);
    return response.body;
  } catch (error) {
    throw error;
  }
};

module.exports = { upload };
