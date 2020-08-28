const https = require("https");
const pkg = require("../../package.json");

const upload = (url, data, apiKey, onUploadProgress) => {
  return new Promise((resolve, reject) => {
    let contentLength = null;
    let bytes = 0;

    data.getLength((err, length) => {
      if (!err) contentLength = length;
    });

    data.on("data", (chunk) => {
      bytes += chunk.length;
      if (contentLength != null && bytes <= contentLength) {
        const progress = {
          percent: bytes / contentLength,
          transferred: bytes,
          total: contentLength,
        };
        onUploadProgress(progress);
      }
    });

    const defaultHeaders = {
      "user-agent": `@spaship/cli@${pkg.version} ${pkg.homepage}`,
      "x-api-key": apiKey,
    };

    const options = {
      method: "POST",
      rejectUnauthorized: false,
      headers: Object.assign({}, defaultHeaders, data.getHeaders()),
    };

    const req = https.request(url, options, (res) => {
      let rawData = "";

      res.on("data", (chunk) => {
        rawData += chunk;
      });

      res.on("end", () => {
        try {
          const parsedData = JSON.parse(rawData);

          if (res.statusCode >= 200 && res.statusCode <= 300) {
            resolve(parsedData);
          } else {
            reject(parsedData);
          }
        } catch (e) {
          console.log(rawData);
          reject(e);
        }
      });
    });

    req.on("error", (e) => {
      reject(e);
    });

    data.pipe(req);
  });
};
module.exports = { upload };
