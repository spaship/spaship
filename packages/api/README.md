# SPAship API

REST API for deploying SPAs to the SPAship platform.

## Global install

```
npm install -g @spaship/api
spaship-api
```

## Hacking

```
git@github.com:spaship/api.git
npm install
```

From here, you can `npm start` to launch the service, or `npm run dev` to launch the service with auto-restart when source files are changed.

## Testing

| Command               | Purpose                                       |
| --------------------- | --------------------------------------------- |
| `npm test`            | Run tests.                                    |
| `npm test -- --watch` | Run tests, and re-run them when files change. |

### Pull requests and commit messages

This repo follows Conventional Commits, a standard format for writing commit messages. Each commit message becomes an entry in [CHANGELOG.md](./CHANGELOG.md), and the commit messages are also used to determine what version bump to apply.

Read more about [Conventional Commits](https://www.conventionalcommits.org) for a description and examples!

If you are working on a pull request, don't worry about commit message format. Commit early and often.

When your pull request is merged, "squash and merge" should be used, and a Conventional Commit message written at that point. In this way, your pull request will become a single commit in the master branch and one entry in the CHANGELOG will be created.

## Configuration

Configuration can be provided by CLI flags, environment variables, or a configuration file. Arguments are processed in that order, so CLI flags take precedence over environment variables, which take precedence over the configuration file.

| Option             | Description                                                         | CLI                   | Env                           | config.json           | Default                                        |
| ------------------ | ------------------------------------------------------------------- | --------------------- | ----------------------------- | --------------------- | ---------------------------------------------- |
| **config file**    | Where to find the config file.                                      | `--config-file`       | `SPASHIP_API_CONFIG_FILE`     | N/A                   | none                                           |
| **upload dir**     | Directory to upload SPA archives.                                   | `--upload-dir`        | `SPASHIP_UPLOAD_DIR`          | `"upload_dir"`        | `/tmp/spaship_uploads`                         |
| **webroot**        | Directory to extract/deploy SPAs.                                   | `--webroot`           | `SPASHIP_WEBROOT`             | `"webroot"`           | `/var/www`                                     |
| **host**           | Hostname to run on.                                                 | `--host`              | `SPASHIP_HOST`                | `"host"`              | `localhost`                                    |
| **port**           | Port to run on.                                                     | `--port`              | `SPASHIP_API_PORT`            | `"port"`              | `8008`                                         |
| **log-level**      | Granularity of log messages to print.                               | `--log-level`         | `SPASHIP_LOG_LEVEL`           | `"log_level"`         | `info`                                         |
| **log-format**     | `pretty` for human-friendly logs, `json` for machine-friendly logs. | `--log-format`        | `SPASHIP_LOG_FORMAT`          | `"log_format"`        | `pretty`                                       |
| **mongo_url**      | The hosts of your mongodb instance.                                 | `--db:mongo:url`      | `SPASHIP_DB__MONGO__URL`      | `"db.mongo.url"`      | `"localhost:27017"`                            |
| **mongo_user**     | (Optional) The username of your mongodb instance.                   | `--db:mongo:user`     | `SPASHIP_DB__MONGO__USER`     | `"db.mongo.user"`     | `null`                                         |
| **mongo_password** | (Optional) The password of your mongodb instance.                   | `--db:mongo:password` | `SPASHIP_DB__MONGO__PASSWORD` | `"db.mongo.password"` | `null`                                         |
| **mongo_db**       | The mongodb database name.                                          | `--db:mongo:db`       | `SPASHIP_DB__MONGO__DB`       | `"db.mongo.db"`       | `"spaship"`                                    |
| **mock_db**        | Whether to use a mock database ([mongo-mock][mongo-mock]).          | `--db:mongo:mock`     | `SPASHIP_DB__MONGO__MOCK`     | `"db.mongo.mock"`     | `true`, except when `NODE_ENV == "production"` |

**Note:** the filepath configurations (`config file`, `upload dir`, and `webroot`) must be absolute paths when defined in an environment variable or config file. When defined in CLI options like, they can be written relative to CWD. Example: `--config-file=../config.json`.

**Note:** When `mock_db` is on, the mocked database will be persisted as a flat file named `mock-db.js` right here in the same directory as this README.

## SPA metadata

Each deployed SPA gets a hidden directory inside `webroot` which houses two files that contain some SPA metadata, `ref` and `name`.

For example, a SPA deployed with name "My App", path `/my-app`, and ref `v1.0.0` would result in a webroot that looks like this:

```
www
├── .my-app
│   ├── name
│   └── ref
└── my-app
    └── index.html
```

## API

### /deploy

Deploy a SPA to SPAship. A very simple Web UI is provided, or the deployment can be automated with an HTTP request.

#### With cURL

```
NAME="My Awesome Application"
SPA_PATH="/my-app"
REF="v1.0.0"
curl -v -F upload=@test.zip -F name="$NAME" -F path="$SPA_PATH" -F ref="$REF" localhost:8008/deploy
```

Change `localhost:8008` to the host and port the service is running on. Change `APP_NAME` to your preferred app name, and `test.zip` to the archive you want to upload.

#### With the web UI

When you run the deployment service, it will print something like:

`Listening on http://localhost:8008`

Open that URL in a browser and you'll see a form for uploading apps.

### /list

Returns a list of all deployed SPAs. If they have a metadata directory, that metadata will be included.

Here's an example response from `/list`. Two apps are listed in the example, "SPAnom" has metadata and "SPAnonymous" does not.

```json
[
  {
    "name": "SPAnominal",
    "path": "/spanominal",
    "ref": "v1.0.0"
  },
  {
    "name": null,
    "path": "/spanonymous",
    "ref": null
  }
]
```

A few notes about the response.

- `path` is not stored in the metadata directory; it's inferred from the SPA's directory in the webroot.
- The "SPAnonymous" app has `null` values for name and ref because it was not deployed with `/deploy`, but it's included so that `/list` provides a complete report of what paths are being made available.

[mongo-mock]: https://github.com/williamkapke/mongo-mock

### /apikeys

| HTTP Method | Endpoint                     | Description                                                                  |
| ----------- | ---------------------------- | ---------------------------------------------------------------------------- |
| `POST`      | `/apikey`                    | Creates and returns an API key object such as `{ key: "ABCD" }` <sup>1</sup> |
| `DELETE`    | `/apikey?hashedKey=e12e115a` | Deletes key ABCD (hashed to "e12e115a") <sup>2</sup>                         |

**Notes:**

<sup>1</sup> This should return a JSON object describing whether the key creation was successful or not.

<sup>2</sup> The `deleteKey(apikey)` function wants you to pass in the HASHED key, not the original key (since SPA manager does not have access to the original key when you click "Delete key"). That's why the querystring param is `hashedKey` and not `key`.
