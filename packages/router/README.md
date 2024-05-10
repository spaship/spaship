# SPAship Router

Proxies paths to the right SPA location or pass to different origin.

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

| Option             | Description                                                                                                        | CLI                | Env                          | config.json        | Default                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ | ------------------ | ---------------------------- | ------------------ | ----------------------- |
| **config file**    | Where to find the config file.                                                                                     | `--config-file`    | `SPASHIP_ROUTER_CONFIG_FILE` | N/A                | none                    |
| **webroot**        | Directory to extract/deploy SPAs.                                                                                  | `--webroot`        | `SPASHIP_WEBROOT`            | `"webroot"`        | `/var/www/html`         |
| **target**         | Proxy target, httpd location                                                                                       | `--target`         | `SPASHIP_TARGET`             | `"target"`         | `http://localhost:8080` |
| **port**           | Port to run on.                                                                                                    | `--port`           | `SPASHIP_ROUTER_PORT`        | `"port"`           | `8080`                  |
| **fallback**       | Optional fallback target if no spa route found                                                                     | `--fallback`       | `SPASHIP_FALLBACK`           | `"fallback"`       | none                    |
| **forwarded_host** | Optional forwarded host if the router is behind a proxy                                                              | `--forwarded_host` | `SPASHIP_FORWARDED_HOST`     | `"forwarded_host"` | none                    |
| **log-level**      | Granularity of log messages to print. Options are: `fatal`, `error`, `warn`, `info`, `debug`, `trace` or `silent`. | `--log-level`      | `SPASHIP_LOG_LEVEL`          | `"log_level"`      | `info`                  |
| **log-format**     | `pretty` for human-friendly logs, `json` for machine-friendly logs.                                                | `--log-format`     | `SPASHIP_LOG_FORMAT`         | `"log_format"`     | `pretty`                |

**Note** about the filepath configurations, `config file` and `webroot`: they must be absolute paths when defined in an environment variable or config file. When defined in CLI options like, they can be written relative to CWD. Example: `--config-file=./config.json`

### Working behind a Proxy

If your setup any proxy before SPAship router, Router have to know the incoming host to send the correct host name to the SPA. There are 2 ways to do it

1. If your proxy support set `x-forwarded-host`, You should set up the user facing host on it.

   Ex: www.example.com

   ```
   x-forwarded-host: www.example.com
   ```

2. If your proxy not be able to custom, you can use the `forwarded_host` config parameter.

   Ex: www.example.com

   ```
   --forwarded_host=www.example.com
   ```

   or

   ```
   export SPASHIP_FORWARDED_HOST=www.example.com
   ```
## Virtual Path Configuration

### Introduction

A new feature has been added to the router that allows users to configure virtual paths. These are paths that do not exist in the Apache server but can be mapped to existing paths. The operations related to this configuration are accessible from the path `/spaship-proxy/api/v1`, and the API specification is available at `/spaship-proxy/api/v1/docs`.

There are two levels of operation for this feature:

1. **In-memory**: These are temporary changes. You can add a new path, modify an existing path, or delete an existing path using the `POST` and `DELETE` APIs. However, these changes will be discarded once the application restarts.

2. **Configuration**: These are permanent changes. All permanent configurations are written inside the `.routemapping` file. To make your in-memory changes permanent, you will need to call the `PUT` method. This will overwrite the values in the `.routemapping` file with the current values of the in-memory variable.

Please refer to the `openapi.yaml` file for more details on how to use these APIs.

### Configuring Flatpath Directories with Virtual Path Configuration

Directories with underscores are accessible differently. For example, a directory named `hello_world` on the server would be accessible at the `hello/world` path.

To create a virtual path for these special directories, you need to map the incoming path to the actual path. For example, if you want to configure a new virtual path called "welcome" for a flat directory "hello_world" (which is accessed via the "hello/world" path), you would need to add the following mapping:

```json
{
  "incoming_path": "welcome",
  "mapped_with": "hello/world"
}
```
### Security Configuration

For security purposes, it's important to configure the `allowed_hosts` environment variable. This variable should contain a list of comma-separated hostnames that are allowed to access the `/spaship-proxy/api/v1` path.

The application checks all incoming requests to `/spaship-proxy/api/v1` by comparing the `req.headers.host` value with the values in `allowed_hosts`. If a match is found, the request is allowed to proceed. If no match is found, the application responds with a 403 error, indicating that the request is forbidden.

To set the `allowed_hosts` environment variable, you can use the following command:

```bash
export SPASHIP_ALLOWED_HOSTS="hostname1,hostname2"
