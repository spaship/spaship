# path-proxy

Proxies paths to the right SPA location or pass to different origin

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

| Option          | Description                                                         | CLI             | Env                   | config.json    | Default                     |
| --------------- | ------------------------------------------------------------------- | --------------- | --------------------- | -------------- | --------------------------- |
| **config file** | Where to find the config file.                                      | `--config-file` | `SPASHIP_CONFIG_FILE` | N/A            | none                        |
| **webroot**     | Directory to extract/deploy SPAs.                                   | `--webroot`     | `SPASHIP_WEBROOT`     | `"webroot"`    | `/var/www`                  |
| **target**      | Proxy target, httpd location                                        | `--target`      | `SPASHIP_TARGET`      | `"target"`     | `http://localhost:8080`     |
| **port**        | Port to run on.                                                     | `--port`        | `SPASHIP_PORT`        | `"port"`       | `8080`                      |
| **fallback**    | Fallback location if not match any spa.                             | `--fallback`    | `SPASHIP_FALLBACK`    | `"fallback"`   | `https://access.redhat.com` |
| **log-level**   | Granularity of log messages to print.                               | `--log-level`   | `SPASHIP_LOG_LEVEL`   | `"log_level"`  | `info`                      |
| **log-format**  | `pretty` for human-friendly logs, `json` for machine-friendly logs. | `--log-format`  | `SPASHIP_LOG_FORMAT`  | `"log_format"` | `pretty`                    |

**Note** about the filepath configurations, `config file` and `webroot`: they must be absolute paths when defined in an environment variable or config file. When defined in CLI options like, they can be written relative to CWD. Example: `--config-file=./config.json`
