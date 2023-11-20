import {
  sanitizeInputCommand,
  readAndParseTomlConfig,
  printVersionAndProgramName,
  printHelpMenu,
  checkArgs,
} from './src/utils/helper.js';
import fs from 'fs';
let args = process.argv.slice(2);

// Check for config flag
const configFlagIndex = args.findIndex(
  (arg) => arg === '-c' || arg === '--config'
);

//Check if user has passed `-c` or `--config` flag followed by a file path.
if (configFlagIndex !== -1 && args[configFlagIndex + 1]) {
  const configFilePath = args[configFlagIndex + 1];

  if (!fs.existsSync(configFilePath)) {
    console.error('Configuration file not found:', configFilePath);
    process.exit(-1);
  }

  const config = readAndParseTomlConfig(configFilePath);

  // Check for version flag within the TOML config file
  if (config.version === true) {
    printVersionAndProgramName();
  }

  // Check for help flag within the TOML config file
  if (config.help === true) {
    printHelpMenu();
  }

  const inputPath = config.input || '';
  const outputPath = config.output || './til';
  sanitizeInputCommand([inputPath, '-o', outputPath]);
  process.exit(0);
}

checkArgs(args);

let command = args[0];

// User has provided a valid version command. Output the name of the program & version number.
if (command === '-v' || command === '--version') {
  printVersionAndProgramName();
}
// User has provided a valid help command. Output the help menu.
else if (command === '-h' || command === '--help') {
  printHelpMenu();
}
// User has provided a valid input command. Sanitize the input command.
else {
  sanitizeInputCommand(args);
}
