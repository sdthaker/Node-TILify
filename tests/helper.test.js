import {
  readAndParseTomlConfig,
  printVersionAndProgramName,
  printHelpMenu,
  checkArgs,
} from '../src/utils/helper';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('readAndParseTomlConfig', () => {
  it('function should return an object with the parsed TOML file', () => {
    const config = readAndParseTomlConfig('src/config.toml');
    expect(config).toEqual({
      input: './examples',
      output: './build',
      stylesheet: 'https://cdn.jsdelivr.net/npm/water.css@2/out/water.css',
      lang: 'fr',
      version: false,
      help: false,
    });
  });

  it('function should exit with error message & exit code -1 with incorrect toml file path', () => {
    const mockStdErr = jest
      .spyOn(global.console, 'error')
      .mockImplementation(() => {});
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

    readAndParseTomlConfig('file/path/that/doesnt/exist.toml');

    expect(mockStdErr).toHaveBeenCalledWith(
      'Error reading or parsing TOML file'
    );
    expect(mockExit).toHaveBeenCalledWith(-1);
  });

  it('function should exit with error message & exit code -1 with incorrect toml syntax', () => {
    const mockStdErr = jest
      .spyOn(global.console, 'error')
      .mockImplementation(() => {});
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

    readAndParseTomlConfig('src/incorrect-config.toml');

    expect(mockStdErr).toHaveBeenCalledWith(
      'Error reading or parsing TOML file'
    );
    expect(mockExit).toHaveBeenCalledWith(-1);
  });

  it('function should exit with error message & exit code -1 with incorrect argument type', () => {
    const mockStdErr = jest
      .spyOn(global.console, 'error')
      .mockImplementation(() => {});
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

    readAndParseTomlConfig(true);

    expect(mockStdErr).toHaveBeenCalledWith(
      'Error reading or parsing TOML file'
    );
    expect(mockExit).toHaveBeenCalledWith(-1);
  });
});

describe(' printVersionAndProgramName', () => {
  it('function should print the name of the program & version number', () => {
    const mockStdOut = jest
      .spyOn(global.console, 'log')
      .mockImplementation(() => {});

    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

    printVersionAndProgramName();

    expect(mockStdOut).toHaveBeenCalledWith('Name: ', 'node-tilify');
    expect(mockStdOut).toHaveBeenCalledWith('Version: ', '1.0.4');
    expect(mockExit).toHaveBeenCalledWith(0);
  });
});

describe('printHelpMenu', () => {
  it('function should print the help menu', () => {
    const mockStdOut = jest
      .spyOn(global.console, 'log')
      .mockImplementation(() => {});

    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

    printHelpMenu();

    expect(mockStdOut).toHaveBeenCalledWith(
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
    expect(mockExit).toHaveBeenCalledWith(0);
  });
});

describe('checkArgs', () => {
  it('function should exit with error message & exit code -1 with array with 0 length', () => {
    const mockStdErr = jest
      .spyOn(global.console, 'error')
      .mockImplementation(() => {});
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

    checkArgs([]);

    expect(mockStdErr).toHaveBeenCalledWith(
      'Please provide a command! Run the program with --help / -h for more information.'
    );
    expect(mockExit).toHaveBeenCalledWith(-1);
  });
});
