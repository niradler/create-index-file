const util = require('util');
const fs = require('fs');
const readdirPromise = util.promisify(fs.readdir);
const writeFilePromise = util.promisify(fs.writeFile);

const getFolderFilesList = (path) => readdirPromise(path);
const getName = (rawName) =>rawName.substring(0,rawName.indexOf('.'));
const getImportName = (rawName) =>rawName.substring(0,rawName.lastIndexOf('.'));

const template5 = (files) => `
${files.map(fileName=>`const ${getName(fileName)} = require('./${getImportName(fileName)}');`).join('\n')}

module.exports = {
${files.map(fileName=>`     ${getName(fileName)},`).join('\n')}
}

`;

const main = async () => {
try {
    const args = process.argv.slice(2);
    const path = args[0];
    const files = await getFolderFilesList(path);
    const index = template5(files);
    await writeFilePromise(path + '/index.js',index)
    console.log('index created at ' + path);
} catch (error) {
    console.error(error)
}
}

main();

