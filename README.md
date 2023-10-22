# Node-TILify

Welcome to Node-TILify. An open source CLI software that helps you convert a text file or a directory of text file(s) into html file(s) blazingly fast 🏃‍♂️ 💨 ⚡️. The name of the project was chosen to showcase which language/framework was used to build this tool -- _`Node`.js_, what the tool is all about -- _`TIL` - Today I Learned_, & the value that it adds to your workflow -- _Ampl`ify`ing Knowledge_.

# How to use / Installation

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

You can now run the program from the cloned repository's terminal to see how to use this tool:

```bash
node src/index.js -h
```

_Optional_ - If you'd like to spin up a node server, open a terminal inside of the cloned repository, and install the node dependencies & spin up the server by running:

```bash
npm install
npm run start
```

# Features

- Pass in a txt file and it'll generate an html file.
- Pass in a directory and it'll search through all the txt files in that directory and generate html files which are then stored in `./til` directory.
- Every paragraph is enclosed with `<p>` tag.
- Every hyperlink starting with `https://` or `http://` is enclosed with `<a>` tag.
- Every line that ends in ^ is enclosed in `<h2>` tag.
- <ins>_Optional Feature #1_</ins>: If the first line of the text has 2 spaces after it, a `<title>` tag is added to the `<head>` and a `<h1>` tag is added at the beginning of `<body>`.
- <ins>_Optional Feature #5_</ins>: Stylesheet is added to every html file to improve the looks of it.
- Passing `-h` or `--help` command prints help menu.
- Passing `-v` or `--version` command prints version and name of the tool.
- <ins>_Optional Feature #2_</ins>: Passing `-o` or `--output` command followed by an output directory path, stores all the generated HTML files to that directory. If no directory exists, it'll create one. It overwrites the content of the files that match with the input file or directory of files and creates a new file if it doesn't exist in the output directory.
- Name of the generated html file is the same as name of txt file.
- Converts Markdown horizontal lines to HTML horizontal lines.
- Converts Markdown links to HTML links.
- Converts Markdown images to HTML images.
- **TOML Configuration**: Instead of repeatedly passing in command-line arguments, you can now set your preferences in a TOML configuration file. Use the `-c` or `--config` flags followed by the path to your TOML configuration file.

# Usages / Examples

- `node src/index.js -h` / `node src/index.js --help` - To print help menu
- `node src/index.js -v` / `node src/index.js --version` - To print version and name of the tool
- `node src/index.js input.txt` - To read txt file and generate html from it to be stored in `./til` directory
- `node src/index.js ./examples` - To read txt files from a directory and generate html from it to be stored in `./til` directory
- `node src/index.js input.txt -o collection` / `node src/index.js input.txt -output collection` - To read a txt file and generate html from it to be stored in `./collection` directory
- `node src/index.js ./examples -o collection` / `node src/index.js ./examples --output collection` - To read txt files from a directory and generate html from it to be stored in `./collection` directory
- `node src/index.js --config path_to_your_config.toml` / `node src/index.js -c path_to_your_config.toml`- To utilize your configuration file settings for conversion.

# Usages / Examples (with Output)

To generate multiple HTML files from a directory with your preferred output directory:

Command Line:

```bash
sohamthaker@Sohams-MacBook-Pro Node-TILify % node src/index.js examples -o output
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

```toml
# This is a sample TOML configuration file
input = "./src"

# Output directory where generated files will be saved
output = "./build"

# Stylesheet URL
stylesheet = "https://cdn.jsdelivr.net/npm/water.css@2/out/water.css"

# Language setting
lang = "fr"
```