import fs from 'fs';
import path from 'path';

function sanitizeInputCommand(args) {
  let pathToInputFileOrDir = args[0];
  let outputCommand = args[1];
  let pathToOutputDir = args[2];

  //Path is valid input file or directory
  if (pathToInputFileOrDir && fs.existsSync(pathToInputFileOrDir)) {
    pathToOutputDir = sanitizeOutputCommand(outputCommand, pathToOutputDir);

    //Input is a file
    if (fs.lstatSync(pathToInputFileOrDir).isFile()) {
      //Input file doesnt end in .txt or .md

      if (
        !pathToInputFileOrDir.endsWith('.txt') &&
        !pathToInputFileOrDir.endsWith('.md')
      ) {
        console.log('Input file must end with .txt or .md extension!');
        process.exit(-1);
      }

      //Output dir exists, delete it
      if (pathToOutputDir === './til' && fs.existsSync(pathToOutputDir)) {
        fs.rmSync(pathToOutputDir, { recursive: true });
      }

      generateHTMLForFile(pathToInputFileOrDir, pathToOutputDir);
      console.log(
        `HTML file generated successfully stored at ${pathToOutputDir}!`
      );
      process.exit(0);
    }
    //Input is a directory
    else {
      generateHTMLForDir(pathToInputFileOrDir, pathToOutputDir);
      console.log(
        `HTML files generated successfully stored at ${pathToOutputDir}!`
      );
      process.exit(0);
    }
  } else {
    console.log('Please provide a valid input file or directory!');
    process.exit(-1);
  }
}

function sanitizeOutputCommand(outputCommand, pathToOutputDir) {
  if (outputCommand === '-o' || outputCommand === '--output') {
    //User has not provided an output directory path
    if (!pathToOutputDir) {
      console.log('Please provide a path to output directory!');
      process.exit(-1);
    }

    //User has provided an output directory path but it is not a directory
    else if (
      fs.existsSync(pathToOutputDir) &&
      !fs.lstatSync(pathToOutputDir).isDirectory()
    ) {
      console.log('Please provide a valid output directory!');
      process.exit(-1);
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

  if (inputFile.endsWith('.md')) {
    generateHTMLForMdFile(inputFile, pathToOutputDir, lines);
  } else {
    generateHTMLForTxtFile(inputFile, pathToOutputDir, lines);
  }
}

function generateHTMLForTxtFile(inputFile, pathToOutputDir, lines) {
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
    ${title && `\t<h1>${title}</h1>\n\n`}`;

  //Split the body by <br>
  let bodyArr = body.split('<br>');
  let currentLine = '';
  let bodyArrWithHTMLTags = [];
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
          bodyArrWithHTMLTags.push(
            `\t\t<h2>${bodyArr[i].slice(0, -1)}</h2>\n\n`
          );
        } else {
          currentLine += bodyArr[i];
          bodyArrWithHTMLTags.push(`\t\t<p>${currentLine}</p>\n\n`);
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
  html += bodyArrWithHTMLTags.join('');
  html += `</body></html>`;

  let fileName = '';

  //Extract the file name from the path
  fileName = path.basename(inputFile, '.txt');
  fileName = `${fileName}.html`;

  outputHTMLToDir(pathToOutputDir, html, fileName);
}

function generateHTMLForMdFile(inputFile, pathToOutputDir, lines) {
  let body = lines.join('<br>');

  let html = `<!DOCTYPE html>
    <html lang="en-us">
    <head>
      <meta charset="utf-8">
      <link rel=stylesheet href=https://cdn.jsdelivr.net/npm/water.css@2/out/water.css>
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
    `;

  //Split the body by <br>
  let bodyArr = body.split('<br>');
  let currentLine = '';
  let bodyArrWithHTMLTags = [];
  //Regex to match http links
  const mdLinkGroupRegex = /\[([^\]]+)\]\(([^\)]+)\)/;

  // Loop through bodyArr and add <p> tags to each line
  for (let i = 0; i < bodyArr.length; i++) {
    //Line is not empty, add <p> tag to it or append line to currentLine
    if (bodyArr[i] !== '') {
      //The next line is empty or
      //current line is the last line in the array or
      //current line is horizontal line, create <p> tag
      if (
        i + 1 === bodyArr.length ||
        bodyArr[i + 1] === '' ||
        bodyArr[i] === '---'
      ) {
        const mdLinks = bodyArr[i].match(new RegExp(mdLinkGroupRegex, 'g'));

        if (mdLinks && mdLinks.length > 0) {
          mdLinks.forEach((link) => {
            const linkGroup = link.match(mdLinkGroupRegex);

            if (linkGroup) {
              const [mdLink, mdText, mdURL] = linkGroup;
              //Replace http links with <a> tags
              bodyArr[i] = bodyArr[i].replace(
                mdLink,
                `<a href="${mdURL}" target="_blank">${mdText}</a>`
              );
            }
          });
        }

        // Line contains ---, convert it to <hr> tag
        if (bodyArr[i] !== '---') {
          currentLine += bodyArr[i];
          bodyArrWithHTMLTags.push(`\t\t<p>${currentLine}</p>\n\n`);
        } else {
          currentLine &&
            bodyArrWithHTMLTags.push(`\t\t<p>${currentLine}</p>\n\n`);
          bodyArrWithHTMLTags.push(`\t\t<hr>\n\n`);
        }
        currentLine = '';
      }
      //Next line is not empty, add the current line to currentLine
      else {
        if (bodyArr[i] === '---') {
          bodyArrWithHTMLTags.push(`\t\t<hr>\n\n`);
        } else {
          currentLine += bodyArr[i];
        }
      }
    }
  }
  //Join the array with no delimiter
  html += bodyArrWithHTMLTags.join('');
  html += `\t</body>\n\t</html>`;

  let fileName = '';

  //Extract the file name from the path
  fileName = path.basename(inputFile, '.md');
  fileName = `${fileName}.html`;

  outputHTMLToDir(pathToOutputDir, html, fileName);
}

function generateHTMLForDir(pathToInputDir, pathToOutputDir) {
  //Read the directory
  let files = fs.readdirSync(pathToInputDir);

  //Filter the files to only include .txt or .md files
  let txtFiles = files.filter(
    (file) => file.endsWith('.txt') || file.endsWith('.md')
  );

  //No .txt files in the directory, exit execution
  if (txtFiles.length === 0) {
    console.log('No text files found in directory!');
    process.exit(-1);
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
