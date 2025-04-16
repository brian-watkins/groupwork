# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Commands

- Build: `npm run build`
- Start: `npm run start`
- Development: `npm run local` (starts both DB and Next.js)
- Lint: `npm run lint`
- Format check: `npm run format:check`

## Code Style

- Use Prettier formatting with semi: false
- PascalCase for components, classes, interfaces, types
- camelCase for variables, functions, files, methods
- Follow import order: external libraries → domain imports → relative imports
- Use Result pattern with Ok/Err types for domain error handling
- Explicit error enums and validation messages
- Use TypeScript interfaces for domain objects and generics for reusable types
- Behavior-driven testing with "suppose", "perform", "observe" sections

Pre-commit hook checks formatting and linting.

## Code Conventions

We are building a next.js application with typescript. It uses tailwind for
styling. We are using react-aria as for basic components.

We are using best-behavior as our test framework and great-expectations as the
matcher library.

You can find documentation on how best-behavior works
[here](./.context/best-behavior.md).

You can find documentation on how great-expectations works
[here](./.context/great-expectations.md).

The tests are located in the 'behaviors' directory. Use the npm scripts that are
prefixed with 'test' to run the tests.

We are following test-driven development. So, if there is a failing test you
should do only the simplest thing to make that test pass. Only change code if it
is to make a failing test pass or if you are refactoring code when the tests are
green.

There are several test suites:

- App tests -- these are end-to-end tests of the entire system. Run them with
  "npm run test:app"
- Component tests -- these test individual react components in isolation. Run
  them with "npm run test:component"
- Domain tests -- these test the domain model. Run them with "npm run
  test:domain"
- Infra tests -- these test implementations of the domain interfaces, especially
  implementations that need to talk with the database via prisma. Run these with
  "npm run test:infra"

Our application is loosely structured according to the idea of hexagonal
architecture. There is a "src/domain" directory where the domain model is
located. Look in the "src/domain" directory to understand domain concepts like
"course", "student", "group", etc.

Whenever you make a change to a file, I want you to think hard about how best to
follow the existing patterns. For example, if you are creating new test file,
look at other test files in that directory first to understand the pattern.
