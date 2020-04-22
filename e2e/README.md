# SPAship End to End Test

## API test

1. Put the test host and api_key and token in `cypress/api/environment.json`
2. run the command:

```shell
npm run api-test
```

## UI test

```shell
$ npm test -- -e {hostname} -u {login_username} -p {login_passw}
```

Check the test result in following path

- `./cypress/reports` ( HTML reports )
- `./cypress/screenshots` ( Screenshots )
- `./cypress/videos` ( Videos )
