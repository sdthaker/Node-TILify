## Project Setup

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

## Pretty Print

To pretty print the entire project, run the following command:

```bash
npm run prettier
```

## Lint

To lint the entire project and check for errors/warnings, run the following command:

```bash
npm run lint
```
