import fs from 'fs';

//This function sanitizes the input command and
//calls the appropriate function to generate the HTML
function sanitizeInputCommand(args) {
  let pathToInputFileOrDir = args[0];
  let outputCommand = args[1];
  let pathToOutputDir = args[2];

  //Path is valid input file or directory
  if (pathToInputFileOrDir && fs.existsSync(pathToInputFileOrDir)) {
    pathToOutputDir = sanitizeOutputCommand(outputCommand, pathToOutputDir);

    //Input is a file
    if (fs.lstatSync(pathToInputFileOrDir).isFile()) {
      //Input file doesnt end in .txt
      if (!pathToInputFileOrDir.endsWith('.txt')) {
        console.log('Input file must end with .txt extension!');
        process.exit(1);
      }

      //Output dir exists, delete it
      if (pathToOutputDir === './til' && fs.existsSync(pathToOutputDir)) {
        fs.rmSync(pathToOutputDir, { recursive: true });
      }

      generateHTMLForFile(pathToInputFileOrDir, pathToOutputDir);
      console.log(
        `HTML file generated successfully stored at ${pathToOutputDir}!`
      );
    }
    //Input is a directory
    else {
      generateHTMLForDir(pathToInputFileOrDir, pathToOutputDir);
      console.log(
        `HTML files generated successfully stored at ${pathToOutputDir}!`
      );
    }
  } else {
    console.log('Please provide a valid input file or directory!');
  }
}

function sanitizeOutputCommand(outputCommand, pathToOutputDir) {
  //Sanitize the output command.
  if (outputCommand === '-o' || outputCommand === '--output') {
    //User has not provided an output directory path
    if (!pathToOutputDir) {
      console.log('Please provide a path to output directory!');
      process.exit(1);
    }
    //User has provided an output directory path but it is not a directory
    else if (
      fs.existsSync(pathToOutputDir) &&
      !fs.lstatSync(pathToOutputDir).isDirectory()
    ) {
      console.log('Please provide a valid output directory!');
      process.exit(1);
    }
    //User has provided an output directory path but it does not exist
    else if (!fs.existsSync(pathToOutputDir)) {
      fs.mkdirSync(pathToOutputDir);
    }
  } else {
    pathToOutputDir = './til';
  }
  return pathToOutputDir;
}

function generateHTMLForFile(inputFile, pathToOutputDir) {
  //Read the file
  let data = fs.readFileSync(inputFile, 'utf-8');
  //Split the file by new line
  let lines = data.split('\n');
  let title = '';
  let body = '';

  //2nd and 3rd line are empty, the first line is the title and the rest is the body
  if (lines[1] === '' && lines[2] === '') {
    title = lines[0];
    body = lines.slice(3).join('<br>');
  }
  //There is no title, everything is body content
  else {
    body = lines.join('<br>');
  }

  let html = `<!DOCTYPE html>
    <html lang="en-us">
    <head>
      <meta charset="utf-8">
      <link rel=stylesheet href=https://cdn.jsdelivr.net/npm/water.css@2/out/water.css>
      ${title && `<title>${title}</title>`}
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
    ${title && `<h1>${title}</h1>`}`;

  //Split the body by <br>
  let bodyArr = body.split('<br>');
  let currentLine = '';
  let bodyArrWithPTags = [];
  //Regex to match http links
  const httpRegex = /(https?:\/\/\S+)/g;

  // Loop through bodyArr and add <p> tags to each line
  for (let i = 0; i < bodyArr.length; i++) {
    //Line is not empty, add <p> tag to it or append line to currentLine
    if (bodyArr[i] !== '') {
      //The next line is empty or the current line is the last line in the array, add <p> tag to it
      if (i + 1 === bodyArr.length || bodyArr[i + 1] === '') {
        //Replace http links with <a> tags
        bodyArr[i] = bodyArr[i].replace(
          httpRegex,
          '<a href="$1" target="_blank">$1</a>'
        );

        //Line ends with ^, add subheader <h2> tag to it
        if (bodyArr[i].endsWith('^')) {
          bodyArrWithPTags.push(`<h2>${bodyArr[i].slice(0, -1)}</h2>`);
        } else {
          currentLine += bodyArr[i];
          bodyArrWithPTags.push(`<p>${currentLine}</p>`);
          currentLine = '';
        }
      }
      //Next line is not empty, add the current line to currentLine
      else {
        currentLine += bodyArr[i];
      }
    }
  }
  //Join the array with no delimiter
  html += bodyArrWithPTags.join('');
  html += `</body></html>`;

  let fileName = '';

  //Input file has a dir in its path, extract the file name from the path
  if (inputFile.includes('/')) {
    let inputFileArr = inputFile.split('/');
    fileName = inputFileArr[inputFileArr.length - 1].split('.')[0];
    fileName = `${fileName}.html`;
  }
  //Get the file name from the input file
  else {
    fileName = inputFile.split('.')[0];
    fileName = `${fileName}.html`;
  }

  outputHTMLToDir(pathToOutputDir, html, fileName);
}

function generateHTMLForDir(pathToInputDir, pathToOutputDir) {
  //Read the directory
  let files = fs.readdirSync(pathToInputDir);

  //Filter the files to only include .txt files
  let txtFiles = files.filter((file) => file.endsWith('.txt'));

  //No .txt files in the directory, exit execution
  if (txtFiles.length === 0) {
    console.log('No text files found in directory!');
    process.exit(1);
  }
  //Output dir exists, delete it
  if (pathToOutputDir === './til' && fs.existsSync(pathToOutputDir)) {
    fs.rmSync(pathToOutputDir, { recursive: true });
  }

  //Generate HTML for each file in the directory
  txtFiles.forEach((file) => {
    generateHTMLForFile(pathToInputDir + '/' + file, pathToOutputDir);
  });
}

function outputHTMLToDir(pathToOutputDir, htmlContent, fileName) {
  //Output dir does not exist, create it
  if (!fs.existsSync(pathToOutputDir)) {
    fs.mkdirSync(pathToOutputDir);
  }
  //Write the HTML content to the output dir
  fs.writeFileSync(`${pathToOutputDir}/${fileName}`, htmlContent);
}

export { sanitizeInputCommand };
