# Project Setup

Make sure [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) is installed on your system. Also, make sure you have latest [node](https://nodejs.org/en/download) installed on your computer.

To install this program, first clone the repository by running:

```bash
git clone https://github.com/sdthaker/Node-TILify.git
```

To make sure node & npm are installed on your system, run:

```bash
node -v
npm -v
```

Then run the following command from root directory to install the dependencies:

```bash
npm install
```

You can now run the program from the cloned repository's terminal to see how to use this tool:

```bash
node src/index.js -h
```

_Optional_ - If you'd like to spin up a node server, open a terminal inside of the cloned repository, and install the node dependencies & spin up the server by running:

```bash
npm install
npm run start
```

# Pretty Print

To pretty print the entire project, run the following command:

```bash
npm run prettier
```

# Lint

To lint the entire project and check for errors/warnings, run the following command:

```bash
npm run lint
```

# Pre-Commit Hook

The project is setup to run prettier & eslint before every commit using Husky and Lint-Staged.

# Testing

## Running all the tests

To run all the tests, run the following command:

```bash
npm run test
```

## Testing a test suite/single test

To test a test suite/single test, run the following command:

```bash
npm run test:single "test name"
```

Here, `test name` is the name of the test suite _(first argument to `describe` block written in string)_ or a single test _(first argument to `it` block written in string)_.

## Testing with watch mode

To run the tests in watch mode _(watch for changes and run tests automatically when the test or source code is updated.)_, run the following command:

```bash
npm run test:watch
```

## Testing a test suite/single test with watch mode

To test a test suite/single test with watch mode, run the following command:

```bash
npm run test:single-watch "test name"
```

## Writing your tests

To write your tests, create a new file in `test` directory with the name of the file ending with `.test.js`. For example, if you want to write tests for `src/index.js`, create a new file `test/index.test.js`. Try to cover as many edge cases as possible. For example, if you are writing tests for a function that has different code paths for different inputs, make sure to write tests for all the code paths.

## Code Coverage

To check the code coverage of the tests, run the following command:

```bash
npm run test:coverage
```
