"use strict"

const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow} = electron;

let MainWindow;

// Enable autoreloading
require('electron-reload')(__dirname);

// Wait for app to be ready
app.on('ready', function(){
    MainWindow = new BrowserWindow({resizable: false});
    // Load HTML file
    MainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }));
});
