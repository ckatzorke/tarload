#!/usr/bin/env node

const fs = require('fs');
const tmpdir = require('os').tmpdir();
const execa = require('execa');
const Listr = require('listr');


const drive = require('./src/app/driveupload.js');
const settings = require('./src/app/settings.js');

let exit = false;
if (!fs.existsSync(settings.clientSecretFile)) {
    console.log('\x1b[31m%s\x1b[0m', 'No Google Drive client secret found.');
    console.log(`Go to https://console.developers.google.com/ select (or create) a project and enable the Drive API.
    When done, dowload the client secret and store it to ~/.tarload/client_secret.json.`);
    exit = true;
}
if (!fs.existsSync(settings.tokenFile)) {
    console.log('\x1b[31m%s\x1b[0m', 'No Google Drive authorization happened yet. Please login and give your consent...');
    drive.setupCredentials();
}
if (!fs.existsSync(settings.configFile)) {
    console.log('\x1b[31m%s\x1b[0m', `No config file yet. Please create the file ${settings.configFile}.`);
    console.log(`Sample config:
    {
        "folder": "/home/chris",
        "tarname": "backup.tar.gz"
    }`);
    exit = true;
}
if (exit) {
    process.exit(0);
}
const tarball = `${tmpdir}/${settings.tarname}`;
const packfolder = `${settings.tarfolder}`;
new Listr([{
        title: `tarballing ${packfolder} to ${tarball}`,
        task: async (ctx, task) => {
            try {
                await execa('tar', ['czf', tarball, packfolder]);
            }catch(error){

                task.skip('Error creating tarball!');
            }
        }
    },
    {
        title: `uploading ${tarball} to Google Drive`,
        task: async (ctx, task) => {
            try {
                await drive.uploadFile(tarball);
            } catch (error) {
                task.skip('Uploading failed...');
            }
        }
    }
    /*,
        {
            title: `Cleaning up (removing ${tarball}`,
            task: () => {
                execa('rm', [tarball]).then(() => console.log('rm finished'));
            }
        }*/
]).run().catch(error => console.log('An error occured', error));
