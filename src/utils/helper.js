import { generateHTMLForFile, generateHTMLForDir } from './htmlGenerator.js';
import fs from 'fs';
import path from 'path';
import toml from 'toml';

function readAndParseTomlConfig(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return toml.parse(content);
    } catch (err) {
        console.error('Error reading or parsing TOML file');
        process.exit(-1);
    }
}


function sanitizeInputCommand(args) {
  let pathToInputFileOrDir = args[0];
  let outputCommand = args[1];
  let pathToOutputDir = args[2];


  // Path is valid input file or directory
  if (pathToInputFileOrDir && fs.existsSync(pathToInputFileOrDir)) {
    pathToOutputDir = sanitizeOutputCommand(outputCommand, pathToOutputDir);

    // Input is a file
    if (fs.lstatSync(pathToInputFileOrDir).isFile()) {
      // Input file doesnt end in .txt or .md
      if (
        !pathToInputFileOrDir.endsWith('.txt') &&
        !pathToInputFileOrDir.endsWith('.md')
      ) {
        console.error('Input file must end with .txt or .md extension!');
        process.exit(-1);
      }

      // Output dir exists, delete it
      if (pathToOutputDir === './til' && fs.existsSync(pathToOutputDir)) {
        fs.rmSync(pathToOutputDir, { recursive: true });
      }

      generateHTMLForFile(pathToInputFileOrDir, pathToOutputDir);
      console.log(
        `HTML file generated successfully stored at ${pathToOutputDir}!`
      );
      process.exit(0);
    }
    // Input is a directory
    else {
      generateHTMLForDir(pathToInputFileOrDir, pathToOutputDir);
      console.log(
        `HTML files generated successfully stored at ${pathToOutputDir}!`
      );
      process.exit(0);
    }
  } else {
    console.error('Please provide a valid input file or directory!');
    process.exit(-1);
  }
}

function sanitizeOutputCommand(outputCommand, pathToOutputDir) {
  if (outputCommand === '-o' || outputCommand === '--output') {
    // User has not provided an output directory path
    if (!pathToOutputDir) {
      console.error('Please provide a path to output directory!');
      process.exit(-1);
    }
    // User has provided an output directory path but it is not a directory
    else if (
      fs.existsSync(pathToOutputDir) &&
      !fs.lstatSync(pathToOutputDir).isDirectory()
    ) {
      console.error('Please provide a valid output directory!');
      process.exit(-1);
    }
    // User has provided an output directory path but it does not exist
    else if (!fs.existsSync(pathToOutputDir)) {
      fs.mkdirSync(pathToOutputDir);
    }
  } else {
    pathToOutputDir = './til';
  }
  return pathToOutputDir;
}

function extractFileNameFromPath(pathToFile, fileType) {
  let fileName = '';

  // Extract the file name from the path
  fileName = path.basename(pathToFile, `.${fileType}`);
  fileName = `${fileName}.html`;

  return fileName;
}

function outputHTMLToDir(pathToOutputDir, htmlContent, fileName) {
  // Output dir does not exist, create it
  if (!fs.existsSync(pathToOutputDir)) {
    fs.mkdirSync(pathToOutputDir, { recursive: true });
  }

  // Write the HTML content to the output dir
  fs.writeFileSync(`${pathToOutputDir}/${fileName}`, htmlContent);
}

export {
  sanitizeInputCommand,
  extractFileNameFromPath,
  outputHTMLToDir,
  readAndParseTomlConfig,
};
