#!/usr/bin/env node

const fs = require('fs');
const tmpdir = require('os').tmpdir();
const execa = require('execa');
const Listr = require('listr');


const drive = require('./src/app/driveupload.js');
const settings = require('./src/app/settings.js');

if (fs.existsSync(settings.tokenFile)) {
    const tarball = `${tmpdir}/backup-test.tar.gz`;
    const packfolder = `${settings.tarfolder}`;
    new Listr([{
            title: `tarballing ${packfolder} to ${tarball}`,
            task: () => {
                execa('tar', ['czf', tarball, packfolder]);
            }
        },
        {
            title: `hatschipüh`,
            task: () => execa('sleep', ['3'])
        },
        {
            title: `uploading ${tarball} to Google Drive`,
            task: async () => {
                await drive.uploadFile(tarball);
            }
        }
    ]).run();
} else {
    console.warn('No Google Drive authorization happened yet. Please login and give your consent...');
    drive.setupCredentials();
}