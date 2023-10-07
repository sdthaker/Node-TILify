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

function printVersionAndProgramName() {
  // Read JSON file
  fs.readFile('../../package.json', 'utf-8', (err, data) => {
    if (err) {
      console.error(
        'An error occured while obtaining name and version of the tool: ',
        err
      );
      process.exit(-1);
    }

    const packageJson = JSON.parse(data);
    console.log('Name: ', packageJson.name);
    console.log('Version: ', packageJson.version);
  });
  process.exit(0);
}

function printHelpMenu() {
  console.log(
    `This program is a Today I Learned tool where you pass a text file or directory of text files which converts them to HTML files.
      
      It has the following commands:
      -v, --version: Outputs the name of the program & version number.
      -h, --help: Outputs the help menu.
      -o, --output: The output directory (Optional).
      -c, --config: Specify path to a TOML-based config file.
  
      The files will be saved in './til' folder by default located in the current directory. 
      You can change the output folder by using -o or --output command.
  
      For example, to generate multiple HTML files from a directory with your preferred output directory run:
      node src/index.js ./path/to/directory -o ./path/to/output
  
      To utilize a configuration file for conversions, use:
       node src/index.js -c path_to_your_config.toml or node src/index.js --config path_to_your_config.toml
      `
  );
  process.exit(0);
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
  printVersionAndProgramName,
  printHelpMenu,
};
