#!/usr/bin/env node

let fs = require('fs');

let drive = require('./src/app/driveupload.js');
let settings = require('./src/app/settings.js');

if (fs.existsSync(settings.tokenFile)) {
    drive.uploadFile('test');
} else {
    console.warn('No Google Drive authorization happened yet. Please login and give your consent...');
    drive.setupCredentials();
}