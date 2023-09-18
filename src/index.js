import { sanitizeInputCommand } from './utils/helper.js';
import fs from 'fs';
let args = process.argv.slice(2);

//User has not provided at least 1 command.
if (args.length === 0) {
  console.log(
    'Please provide a command! Run the program with --help / -h for more information.'
  );
  process.exit(-1);
}

let command = args[0];

//User has provided a valid version command. Output the name of the program & version number.
if (command === '-v' || command === '--version') {
  //Read JSON file
  fs.readFile('./package.json', 'utf-8', (err, data) => {
    if (err) {
      console.log(
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
//User has provided a valid help command. Output the help menu.
else if (command === '-h' || command === '--help') {
  console.log(
    `This program is a Today I Learned tool where you pass a text file or directory of text files which converts them to HTML files.
    
    It has the following commands:
    -v, --version: Outputs the name of the program & version number.
    -h, --help: Outputs the help menu.
    -o, --output: The output directory (Optional).

    The files will be saved in './til' folder by default located in the current directory. 
    You can change the output folder by using -o or --output command.

    For example, to generate multiple HTML files from a directory with your preferred output directory run:
    node src/index.js ./path/to/directory -o ./path/to/output
    `
  );
  process.exit(0);
}
//User has provided a valid input command. Sanitize the input command.
else {
  sanitizeInputCommand(args);
}
