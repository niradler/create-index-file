#!/usr/bin/env node
"use strict";

const util = require("util");
const fs = require("fs");
const readdirPromise = util.promisify(fs.readdir);
const writeFilePromise = util.promisify(fs.writeFile);

const getFolderFilesList = path => readdirPromise(path);
const getName = rawName => rawName.substring(0, rawName.indexOf("."));
const getImportName = rawName => rawName.substring(0, rawName.lastIndexOf("."));

const template5 = files => `
${files
  .map(
    fileName =>
      `const ${getName(fileName)} = require('./${getImportName(fileName)}');`
  )
  .join("\n")}

module.exports = {
${files.map(fileName => `     ${getName(fileName)},`).join("\n")}
}

`;

const main = async path => {
  try {
    if (!path) throw new Error("Folder path is missing.");
    let files = await getFolderFilesList(path);
    files = files.filter(
      fileName => fileName.includes(".js") && fileName !== "index.js"
    );
    const index = template5(files);
    await writeFilePromise(path + "/index.js", index);
    console.log("index created at " + path);
  } catch (error) {
    console.log("error: ", error.message);
  }
};

const getArgs = () => {
  const currentFolder = process.cwd();
  const args = process.argv.slice(2);
  let path = args[0];
  if (path) {
    if (path.includes("./")) {
      path = path.replace(".", currentFolder);
    }
  } else {
    path = currentFolder;
  }
  main(path);
};

getArgs();
