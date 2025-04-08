# GroupWork

Choose groups for fun!

## Getting Started

```
$ npm install
```

## Running the tests

There are several test suites.

Currently, to run the app tests, you need to start the
application and test database via:

```
$ npm run local:test
```

Then you can run the app tests with:

```
$ npm run test:app
```

All the other test suites are self-contained.

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