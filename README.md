# tarload

## What does it do

It tars a folder (e.g. /home/myhome) and uploads the tar to Google Drive.

## Google Drive integration

Go to https://console.developers.google.com/ select (or create) a project and enable the Drive API.
When done, dowload the client secret and store it to `~/.tarload/client_secret.json`.

Since we will `tar` a folder and upload the generated file, the requested scope for the Drive API is `https://www.googleapis.com/auth/drive.

When running for the first time, you need to call a link from terminal, logging in, giving your consent and opy a token back to the terminal.

## Configuration

To configure which folder to be tarballed and how the tarball should be named, create a configile under following location `~/.tarload/config.json`.

Example content:

```json
{
    "folder": "/home/chris",
    "tarname": "backup.tar.gz"
}
```