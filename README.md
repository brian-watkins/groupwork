# GroupWork

Choose groups for fun!

## Getting Started

```
$ npm install
```

You also need Docker to run locally and run the tests.

## Running the tests

There are several test suites.

- `npm run test:app` - End to end test suite
- `npm run test:component` - UI component tests
- `npm run test:domain` - Domain tests
- `npm run test:infra` - Infra tests (persistence)

## Running locally

Run the local database and the app via:

```
$ npm run local
```

To migrate the local database, make sure the database is running
and then:

```
$ npm run local:db:migrate
```
