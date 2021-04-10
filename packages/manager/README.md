# SPAship Manager

## Testing

`npm test` will run all of SPAship Manager's tests. It runs in watch mode by default.

| Command               | Purpose                                       |
| --------------------- | --------------------------------------------- |
| `npm test`            | Run tests.                                    |
| `npm test -- --watch` | Run tests, and re-run them when files change. |

## Configuration

Configuration can be provided by environment variables at build time.

| Option                 | Description                                                                                        | Env                                | Default                         |
| ---------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------- | ------------------------------- |
| **SPAship API(s)**     | One or more SPAship APIs that this Manager connects to.<sup>1</sup> Ex: dev, qa, stage, production | `REACT_APP_SPASHIP_URLS`           | `"local@http://localhost:2345"` |
| **Keycloak URL**       | The URL to a Keycloak instance you wish to use for authentication.<sup>2</sup>                     | `REACT_APP_KEYCLOAK_URL`           | none                            |
| **Keycloak REALM**     | The Keycloak Realm under which your SPAship Manager client is registered.                          | `REACT_APP_KEYCLOAK_REALM`         | none                            |
| **Keycloak client id** | The Keycloak client id for your SPAship Manager instance.                                          | `REACT_APP_KEYCLOAK_CLIENT_ID`     | none                            |
| **JWT user UUID prop** | The JWT property to treat as a UUID.<sup>3</sup>                                                   | `REACT_APP_KEYCLOAK_JWT_UUID_PROP` | `"sub"` <sup>4</sup>            |

<sup>1</sup> The format for this value is one or more `"name@url"`, separated by whitespace. Example: `REACT_APP_SPASHIP_URLS="dev@https://dev.foo.com prod@https://foo.com"`
<br><sup>2</sup> The Keycloak client configured for SPAship Manager must include three properties in the JWT: `name`, `email`, and `role`, where `role` is an array of strings naming each role the user has. Using those roles, you can configure SPAship to restrict access to SPAship.
<br><sup>3</sup> The property can be dot-delimited if the JWT has nested properties. Examples: `"user.userId"`, `""`. Uses the _string_ form of [Lodash.get()][lodash-get]'s property `path` syntax.
<br><sup>4</sup> More about [`"sub"`][jwt-sub].

[lodash-get]: https://lodash.com/docs/4.17.15#get
[jwt-sub]: https://tools.ietf.org/html/rfc7519#section-4.1.2
