# SPAship Sync

The sync service of SPAship

## Global install

```sh
npm install -g @spaship/sync
spaship-sync
```

## Hacking

```sh
git@github.com:spaship/sync.git
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

| Option          | Description                                                                                                        | CLI             | Env                        | config.json    | Default                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------ | --------------- | -------------------------- | -------------- | ----------------------------- |
| **config file** | Where to find the config file.                                                                                     | `--config-file` | `SPASHIP_SYNC_CONFIG_FILE` | N/A            | none                          |
| **autosync**    | Sync details                                                                                                       | `--autosync`    | `SPASHIP_AUTOSYNC`         | `"autosync"`   | [view](./config.json.example) |
| **port**        | Port to run on.                                                                                                    | `--port`        | `SPASHIP_SYNC_PORT`        | `"port"`       | `8009`                        |
| **log-level**   | Granularity of log messages to print. Options are: `fatal`, `error`, `warn`, `info`, `debug`, `trace` or `silent`. | `--log-level`   | `SPASHIP_LOG_LEVEL`        | `"log_level"`  | `info`                        |
| **log-format**  | `pretty` for human-friendly logs, `json` for machine-friendly logs.                                                | `--log-format`  | `SPASHIP_LOG_FORMAT`       | `"log_format"` | `pretty`                      |

**Note:** the filepath configurations (`config file`) must be absolute paths when defined in an environment variable or config file. When defined in CLI options like, they can be written relative to CWD. Example: `--config-file=../config.json`.

## API

### /force

force sync all files
