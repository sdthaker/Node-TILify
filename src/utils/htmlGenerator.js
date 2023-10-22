import { extractFileNameFromPath, outputHTMLToDir } from './helper.js';
import fs from 'fs';

function generateHTMLForFile(inputFile, pathToOutputDir) {
  // Read the file
  let data = fs.readFileSync(inputFile, 'utf-8');
  // Split the file by new line
  let lines = data.split(/\r?\n/);

  if (inputFile.endsWith('.md')) {
    generateHTMLForMdFile(inputFile, pathToOutputDir, lines);
  } else {
    generateHTMLForTxtFile(inputFile, pathToOutputDir, lines);
  }
}

function generateHTMLForTxtFile(inputFile, pathToOutputDir, lines) {
  let title = '';
  let body = '';

  // 2nd and 3rd line are empty, the first line is the title and the rest is the body
  if (lines[1] === '' && lines[2] === '') {
    title = lines[0];
    body = lines.slice(3);
  }
  // There is no title, everything is body content
  else {
    body = lines;
  }

  let html = `<!DOCTYPE html>
    <html lang="en-us"> ${generateHTMLHeadForFile('txt', title)}
    <body>
    ${title && `\t<h1>${title}</h1>\n\n`}`;

  // Split the body by <br> tag
  let bodyArr = body;
  let currentLine = '';
  let bodyArrWithHTMLTags = [];
  // Regex to match http links
  const httpRegex = /(https?:\/\/\S+)/g;

  // Loop through bodyArr and add <p> tags to each line
  for (let i = 0; i < bodyArr.length; i++) {
    // Line is not empty, add <p> tag to it or append line to currentLine
    if (bodyArr[i] !== '') {
      // The next line is empty or the current line is the last line in the array, add <p> tag to it
      if (i + 1 === bodyArr.length || bodyArr[i + 1] === '') {
        // Replace http links with <a> tags
        bodyArr[i] = bodyArr[i].replace(
          httpRegex,
          '<a href="$1" target="_blank">$1</a>'
        );

        // Line ends with ^, add subheader <h2> tag to it
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
      // Next line is not empty, add the current line to currentLine
      else {
        currentLine += bodyArr[i];
      }
    }
  }
  // Join the array with no delimiter
  html += bodyArrWithHTMLTags.join('');
  html += `</body></html>`;

  let fileName = extractFileNameFromPath(inputFile, 'txt');

  outputHTMLToDir(pathToOutputDir, html, fileName);
}

function generateHTMLForMdFile(inputFile, pathToOutputDir, lines) {
  let html = `<!DOCTYPE html>
    <html lang="en-us"> ${generateHTMLHeadForFile('md')}
    <body>
    `;

  // Split the body by <br>
  let bodyArr = lines;
  let currentLine = '';
  let bodyArrWithHTMLTags = [];
  // Regex to match http links
  const mdBlobRegex = /(\!?)\[([^\]]+)\]\(([^\)]+)\)/;

  // Loop through bodyArr and add <p> tags to each line
  for (let i = 0; i < bodyArr.length; i++) {
    // Line is not empty, add <p> tag to it or append line to currentLine
    if (bodyArr[i] !== '') {
      // The next line is empty or
      // current line is the last line in the array or
      // current line is horizontal line, create <p> tag
      if (
        i + 1 === bodyArr.length ||
        bodyArr[i + 1] === '' ||
        bodyArr[i] === '---'
      ) {
        const mdBlobs = bodyArr[i].match(new RegExp(mdBlobRegex, 'g'));

        if (mdBlobs && mdBlobs.length > 0) {
          mdBlobs.forEach((blob) => {
            const blobGroup = blob.match(mdBlobRegex);

            if (blobGroup) {
              const [mdPhrase, mdDelimiter, mdAltText, mdURL] = blobGroup;

              if (mdDelimiter === '!') {
                // Replace md image with <img> tags
                bodyArr[i] = bodyArr[i].replace(
                  mdPhrase,
                  `<img src="${mdURL}" alt="${mdAltText}" width=150 height=150 >`
                );
              } else {
                // Replace md links with <a> tags
                bodyArr[i] = bodyArr[i].replace(
                  mdPhrase,
                  `<a href="${mdURL}" target="_blank">${mdAltText}</a>`
                );
              }
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
      // Next line is not empty, add the current line to currentLine
      else {
        if (bodyArr[i] === '---') {
          bodyArrWithHTMLTags.push(`\t\t<hr>\n\n`);
        } else {
          currentLine += bodyArr[i];
        }
      }
    }
  }
  // Join the array with no delimiter
  html += bodyArrWithHTMLTags.join('');
  html += `\t</body>\n\t</html>`;

  let fileName = extractFileNameFromPath(inputFile, 'md');

  outputHTMLToDir(pathToOutputDir, html, fileName);
}

function generateHTMLHeadForFile(fileType, title) {
  let titleTag = title ? `<title>${title}</title>` : '';
  switch (fileType) {
    case 'txt':
      return `
        <head>
          <meta charset="utf-8">
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css">
          ${titleTag}
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>`;
    case 'md':
      return `
        <head>
          <meta charset="utf-8">
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>`;
    default:
      return '';
  }
}

function generateHTMLForDir(pathToInputDir, pathToOutputDir) {
  // Read the directory
  let files = fs.readdirSync(pathToInputDir);

  // Filter the files to only include .txt or .md files
  let txtFiles = files.filter(
    (file) => file.endsWith('.txt') || file.endsWith('.md')
  );

  // No .txt files in the directory, exit execution
  if (txtFiles.length === 0) {
    console.error('No text files found in directory!');
    process.exit(-1);
  }

  // Output dir exists, delete it
  if (pathToOutputDir === './til' && fs.existsSync(pathToOutputDir)) {
    fs.rmSync(pathToOutputDir, { recursive: true });
  }

  // Generate HTML for each file in the directory
  txtFiles.forEach((file) => {
    generateHTMLForFile(pathToInputDir + '/' + file, pathToOutputDir);
  });
}

export { generateHTMLForFile, generateHTMLForDir };
