const home = require('os').homedir();
module.exports.tarfolder = '/mnt/e/ebay';
module.exports.homefolder = `${home}/.tarload/`;
module.exports.clientSecretFile = `${home}/.tarload/client_secret.json`;
module.exports.tokenFile = `${home}/.tarload/credentials.json`;