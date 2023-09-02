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

You can now run the program from the cloned repository's terminal to see how to use this tool by running:
```bash
node src/index.js -h
```

I'd you'd like to spin up a server open a terminal inside of the cloned repository, and install the node dependencies by running (_Optional_):
```bash
npm install
npm server.js
``` 

# Features

- Pass in a txt file and it'll generate an html file.
- Pass in a directory and it'll search through all the txt files in that directory and generate html files which are stored in `./til` directory.
- Every paragraph is enclosed with `<p>` tag.
- Every hyperlink starting with `https://` or `http://` is enclosed with `<a>` tag.
- Every line that ends in ^ is enclosed in `<h2>` tag.
- <ins>_Optional Feature #1_</ins>: If the first line of the text has 2 spaces after it, a `<title>` tag is added to the `<head>` and a `<h1>` tag is add at the beginning of `<body>`.
- <ins>_Optional Feature #5_</ins>: Stylesheet is added to every html file to improve the looks of it.
- Passing `-h` or `--help` command prints help menu.
- Passing `-v` or `--version` command prints version and name of the tool.
- <ins>_Optional Feature #2_</ins>: Passing `-o` or `--output` command followed by an output directory path, stores all the generated HTML files to that directory. If no directory exists, it'll create one. It overwrites the content of the files that matched with the input file or directory of files and creats a new file if it didn't exist in the output directory.
- Name of the generated html file is the same as name of txt file.

# Usages / Examples

- `node -h` / `node --help` - To print help menu
- `node -v` / `node --version` - To print version and name of the tool
- `node src/index.js input.txt` - To read txt file and generate html from it to be stored in `./til` directory
- `node src/index.js ./examples` - To read txt files from a directory and generate html from it to be stored in `./til` directory
- `node src/index.js input.txt -o collection` / `node src/index.js input.txt -output collection` - To read a txt files and generate html from it to be stored in `./collection` directory
- `node src/index.js ./examples -o collection` / `node src/index.js ./examples --output collection` - To read txt files from a directory and generate html from it to be stored in `./collection` directory
