# spandx deployment service

REST API for deploying SPAs to the SPANDX platform.

## Setup

```
npm install
npm start
```

## Configuration

Configuration can be provided by CLI flags, environment variables, or a configuration file.  Arguments are processed in that order, so CLI flags take precedence over environment variables, which take precedence over the configuration file.

| Option | Description | CLI | Env | config.json | Default |
| --- | --- | --- |--- | ---  | --- |
| **config file** | Where to find the config file. | `--config-file` | `SPANDX_CONFIG_FILE` | N/A | `stuff` |
| **upload dir** | Directory to upload SPA archives. | `--upload-dir` | `SPANDX_UPLOAD_DIR` | `"upload-dir"`  | `/tmp/spandx_uploads` |
| **webroot** | Directory to extract/deploy SPAs. | `--webroot` | `SPANDX_WEBROOT` | `"webroot"`  | `/var/www` |
| **metadata-dir** | Directory to save SPA metadata. | `--metadata-dir` | `SPANDX_METADATA_DIR` | `"metadata-dir"`  | The `webroot` value. |
| **host** | Hostname to run on. | `--host` | `SPANDX_HOST` | `"host"`  | `localhost` |
| **port** | Port to run on. | `--port` | `SPANDX_PORT` | `"port"`  | `8008` |

**Note** about the filepath configurations, `config file`, `upload dir`, and `webroot`: they must be absolute paths when defined in an environment variable or config file.  When defined in CLI options like, they can be written relative to CWD.  Example: `--config-file=./config.json`

### SPA metadata

SPA metadata is saved into a directory defined by `metadata-dir`.  Each deployed SPA gets a hidden directory inside `metadata-dir` which houses several files that contain the metadata.

For example, a SPA deployed under the path `/my-app` at version `v1.0.0` would result in a 

SPA metadata includes:

 - `name`
 - `path`
 - `ref`

## Test with web UI

When you run the deployment service, it will print something like:

`Listening on http://localhost:8008`

Open that URL in a browser and you'll see a form for uploading apps.

## Test with cURL

```
NAME="My Awesome Application"
SPA_PATH="/my-app"
REF="v1.0.0"
curl -v -F upload=@test.zip -F name="$NAME" -F path="$SPA_PATH" -F ref="$REF" localhost:8008/deploy
```

Change `localhost:8008` to the host and port the service is running on.  Change `APP_NAME` to your preferred app name, and `test.zip` to the archive you want to upload.
