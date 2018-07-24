const SETTINGS = require('./settings.js');

const fs = require('fs');
const path = require('path');

const readline = require('readline');
const {
    google
} = require('googleapis');

// If modifying these scopes, delete credentials.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = SETTINGS.tokenFile;

/**
 * Call when there is no SETTINGS.tokenFile (i.e. credentials.json)
 */
setupCredentials = () => {
    authorize(success);
}


/**
 * Triggers the upload
 */
uploadFile = async (fileName) => {
    await authorize(async (auth) => {
        const fileSize = fs.statSync(fileName).size;
        const drive = google.drive({
            version: 'v3',
            auth: auth
        });
        const googleName = fileName.substring(fileName.lastIndexOf(path.sep)  + 1)
        const res = await drive.files.create({
            resource: {
                name: googleName
            },
            requestBody: {
                // a requestBody element is required if you want to use multipart
                mimeType: 'application/gzip',
                name: googleName
            },
            media: {
                mimeType: 'application/gzip',
                body: fs.createReadStream(fileName)
            }
        });
        return res;
    });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {function} callback The callback to call with the authorized client.
 */
async function authorize(callback) {
    // Load client secrets from a local file.
    fs.readFile(SETTINGS.clientSecretFile, (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        const credentials = JSON.parse(content);
        const {
            client_secret,
            client_id,
            redirect_uris
        } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getAccessToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client);
        });
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return callback(err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}


/**
 * Siple callback that is triggered when the initial authentication has happened
 */
function success() {
    console.log('Thank you for setting up the credentials. Now you can run the tool.')
}

module.exports.uploadFile = uploadFile;
module.exports.setupCredentials = setupCredentials;