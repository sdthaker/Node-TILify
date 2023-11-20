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

# Usages / Examples

- `node index.js -h` / `node index.js --help` - To print help menu
- `node index.js -v` / `node index.js --version` - To print version and name of the tool
- `node index.js input.txt` - To read txt file and generate html from it to be stored in `./til` directory
- `node index.js ./examples` - To read txt files from a directory and generate html from it to be stored in `./til` directory
- `node index.js input.txt -o collection` / `node index.js input.txt -output collection` - To read a txt file and generate html from it to be stored in `./collection` directory
- `node index.js ./examples -o collection` / `node index.js ./examples --output collection` - To read txt files from a directory and generate html from it to be stored in `./collection` directory
- `node index.js --config path_to_your_config.toml` / `node index.js -c path_to_your_config.toml`- To utilize your configuration file settings for conversion.

# Usages / Examples (with Output)

To generate multiple HTML files from a directory with your preferred output directory:

Command Line:

```bash
sohamthaker@Sohams-MacBook-Pro Node-TILify % node index.js examples -o output
HTML files generated successfully stored at output!
```

partial output of `examples/Kubernetes101.txt`

```bash
Kubernetes 101


TIL about Kubernetes, Google’s open source container orchestration system.

I spent a half-day at Google’s office space today learning about Kubernetes from the folks at Apprenda. Going in to the session, I thought I had a grasp on what Kubernetes was, but quickly realized I had many misconceptions.

We worked through the following repository, provided by Apprenda, for learning some of the basics of Kubernetes: https://github.com/apprenda/hands-on-with-kubernetes-gke.

Here are some things that I learned from the session:

Kubernettes !== Docker^

I thought Kubernetes was just a different way to build container images like you can with Docker… not so!

Kubernetes is a container orchestration system: in other words, it provides the necessary components for configuring, deploying and scaling images that are built with Docker.
```

partial output of `output/Kubernetes101.html`

```bash
<!DOCTYPE html>
    <html lang="en-us">
    <head>
      <meta charset="utf-8">
      <link rel=stylesheet href=https://cdn.jsdelivr.net/npm/water.css@2/out/water.css>
      <title>Kubernetes 101</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
     <h1>Kubernetes 101</h1>

     <p>TIL about Kubernetes, Google’s open source container orchestration system.</p>

     <p>I spent a half-day at Google’s office space today learning about Kubernetes from the folks at Apprenda. Going in to the session, I thought I had a grasp on what Kubernetes was, but quickly realized I had many misconceptions.</p>

     <p>We worked through the following repository, provided by Apprenda, for learning some of the basics of Kubernetes: <a href="https://github.com/apprenda/hands-on-with-kubernetes-gke." target="_blank">https://github.com/apprenda/hands-on-with-kubernetes-gke.</a></p>

     <p>Here are some things that I learned from the session:</p>

     <h2>Kubernettes !== Docker</h2>

     <p>I thought Kubernetes was just a different way to build container images like you can with Docker… not so!</p>

     <p>Kubernetes is a container orchestration system: in other words, it provides the necessary components for configuring, deploying and scaling images that are built with Docker.</p>
```

## Configuration Using TOML

Now with TOML configuration support, streamline your repetitive tasks by setting your configurations just once!

### How to Use

1. Create a `.toml` file with your desired configuration. Here's an example format:

> ```toml
> # This is a sample TOML configuration file
> input = "./src"
>
> # Output directory where generated files will be saved
> output = "./build"
>
> # Stylesheet URL
> stylesheet = "https://cdn.jsdelivr.net/npm/water.css@2/out/water.css"
>
> # Language setting
> lang = "fr"
> ```

2. Run the following command:

> ```bash
> node index.js -c path_to_your_config.toml
> ```

3. That's it! Your files will be generated in the output directory you specified in your configuration file.
