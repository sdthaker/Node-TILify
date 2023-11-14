import {
  readAndParseTomlConfig,
  printVersionAndProgramName,
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
    expect(mockStdOut).toHaveBeenCalledWith('Version: ', '0');
    expect(mockExit).toHaveBeenCalledWith(0);
  });
});
