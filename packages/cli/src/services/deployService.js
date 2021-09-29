const https = require("https");
const http = require("http");
const pkg = require("../../package.json");

const upload = (url, data, apiKey, onUploadProgress) => {
  let protocol = url.startsWith("https://") ? https : http;
  return new Promise((resolve, reject) => {
    let contentLength = null;
    let bytes = 0;

    data.getLength((err, length) => {
      if (!err) contentLength = length;
    });

    data.on("data", (chunk) => {
      bytes += chunk.length;
      if (contentLength !== null && bytes <= contentLength) {
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
      authorization: `APIKey ${apiKey}`,
    };

    const options = {
      method: "POST",
      rejectUnauthorized: false,
      agentOptions: {
        ciphers: "ALL",
        secureProtocol: "TLSv1_1_method",
      },
      agent: new https.Agent({ keepAlive: true, keepAliveMsecs: 1000 }),
      headers: Object.assign({}, defaultHeaders, data.getHeaders()),
    };

    const req = protocol.request(url, options, (res) => {
      let rawData = "";

      res.on("data", (chunk) => {
        rawData += chunk;
      });

      res.on("end", () => {
        try {
          const parsedData = JSON.parse(rawData);

          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsedData);
          } else if (res.statusCode >= 300 && res.statusCode < 400) {
            reject(`The server attempted an unsupported redirect. [${res.statusCode}]`);
          } else if (res.statusCode >= 400 && res.statusCode < 500) {
            switch (res.statusCode) {
              case 400:
                reject("Error: Failed to deploy. [400]");
                break;
              case 401:
                reject(`Error: The API key was not accepted by ${url} [401]`);
              default:
                reject(`Error: Failed to deploy with an unknown error. [${res.statusCode}]`);
            }
          } else if (res.statusCode >= 500 && res.statusCode < 600) {
            switch (res.statusCode) {
              case 500:
                reject(
                  `Error: The SPAship server has encountered a mysterious problem; someone call Richard Feynman! [500]`
                );
                break;
              case 501:
                reject(
                  `Error: The spaship CLI attempted an action not supported by the server, possible version mismatch. [501]`
                );
                break;
              default:
                reject(`Error: Unknown. [${res.statusCode}]`);
            }
          } else {
          }
        } catch (e) {
          reject(
            "Error: the server returned an invalid message.  The server may be down, or your .spashiprc.yml may be pointing at the wrong server."
          );
        }
      });
    });

    req.on("error", (e) => {
      reject(e.message);
    });

    data.pipe(req);
  });
};
module.exports = { upload };
