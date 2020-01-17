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

| Option          | Description                             | CLI             | Env                   | config.json  | Default                     |
| --------------- | --------------------------------------- | --------------- | --------------------- | ------------ | --------------------------- |
| **config file** | Where to find the config file.          | `--config-file` | `SPASHIP_CONFIG_FILE` | N/A          | none                        |
| **webroot**     | Directory to extract/deploy SPAs.       | `--webroot`     | `SPASHIP_WEBROOT`     | `"webroot"`  | `/var/www`                  |
| **target**      | Proxy target, httpd location            | `--target`      | `SPASHIP_TARGET`      | `"target"`   | `http://localhost:8080`     |
| **port**        | Port to run on.                         | `--port`        | `SPASHIP_PORT`        | `"port"`     | `8080`                      |
| **fallback**    | Fallback location if not match any spa. | `--fallback`    | `SPASHIP_FALLBACK`    | `"fallback"` | `https://access.redhat.com` |

**Note** about the filepath configurations, `config file` and `webroot`: they must be absolute paths when defined in an environment variable or config file. When defined in CLI options like, they can be written relative to CWD. Example: `--config-file=./config.json`

## Logging

A quick note about logging. Logs appear in JSON format by default and, while this is great for analysis of production logs, it isn't easy to read during development. Here's an example.

    {"level":30,"time":1579296841039,"pid":4570,"hostname":"localhost.localdomain","msg":"[HPM] Proxy created: /  -> http://localhost:8080","v":1}
    {"level":30,"time":1579296841041,"pid":4570,"hostname":"localhost.localdomain","dirCache":{"added":["cgi-bin","html"],"removed":[]},"msg":"detected changes in SPAship directory list","v":1}

### Pretty printed logs

For prettier logs, pipe the command into `pino-pretty`.

```
$ node index.js --port 1234 | npx pino-pretty
[1579296883669] INFO  (4735 on localhost.localdomain): [HPM] Proxy created: /  -> http://localhost:8080
[1579296883671] INFO  (4735 on localhost.localdomain): detected changes in SPAship directory list
    dirCache: {
      "added": [
        "cgi-bin",
        "html"
      ],
      "removed": []
    }
```

Much nicer.
