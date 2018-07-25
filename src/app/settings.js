const home = require('os').homedir();
const fs = require('fs');

const homefolder = `${home}/.tarload`;
const configFile = `${home}/.tarload/config.json`;


const content = fs.readFileSync(configFile);
const config = JSON.parse(content);

module.exports.tarfolder = config.folder;
module.exports.tarname = config.tarname;
module.exports.homefolder = homefolder;
module.exports.configFile = configFile;
module.exports.clientSecretFile = `${homefolder}/client_secret.json`;
module.exports.tokenFile = `${homefolder}/credentials.json`;