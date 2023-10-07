import { sanitizeInputCommand , readAndParseTomlConfig} from './utils/helper.js';
import fs from 'fs';
let args = process.argv.slice(2);

// Check for config flag
const configFlagIndex = args.findIndex(arg => arg === '-c' || arg === '--config');

//These lines check if the user has given the `-c` or `--config` flag followed by a file path.
if (configFlagIndex !== -1 && args[configFlagIndex + 1]) {
  //If yes, they save that path in `configFile`.
    const configFile = args[configFlagIndex + 1];
    
    if (!fs.existsSync(configFile)) {
        console.error('Configuration file not found:', configFile);
        process.exit(-1);
    }
    
    const config = readAndParseTomlConfig(configFile);


    if (config.version === true) {
      
      //I tried to reuse the logic for the version command from the original code, but it didn't work.
      // fs.readFile('./package.json', 'utf-8', (err, data) => {
      //   if (err) {
      //     console.error(
      //       'An error occured while obtaining name and version of the tool: ',
      //       err
      //     );
      //     process.exit(-1);
      //   }
    
      //   const packageJson = JSON.parse(data);
  
        // Check for version or help flag within the TOML config file
     
        console.log('Name: node-tilify');
        console.log('Version: 0.1');
        process.exit(0);
      //});
      
      }
     

  if (config.help === true) {
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
    
    const inputPath = config.input || '';
    const outputPath = config.output || './til';
    const version = config.version || true;
    sanitizeInputCommand([inputPath, '-o', outputPath]);
    process.exit(0);
}


// User has not provided at least 1 command.
if (args.length === 0) {
  console.error(
    'Please provide a command! Run the program with --help / -h for more information.'
  );
  process.exit(-1);
}

let command = args[0];

// User has provided a valid version command. Output the name of the program & version number.
if (command === '-v' || command === '--version') {
  // Read JSON file
  fs.readFile('./package.json', 'utf-8', (err, data) => {
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
// User has provided a valid help command. Output the help menu.
else if (command === '-h' || command === '--help') {
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
// User has provided a valid input command. Sanitize the input command.
else {
  sanitizeInputCommand(args);
}
