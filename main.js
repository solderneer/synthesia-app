"use strict"

const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, ipcMain} = electron;

let MainWindow;

// Enable autoreloading
// require('electron-reload')(__dirname);

// Wait for app to be ready
app.on('ready', () => {
    MainWindow = new BrowserWindow({
        resizable: false,
        show: false
    });
    // Load HTML file
    MainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }));

    MainWindow.once('ready-to-show', () => {
        MainWindow.show();
    });

    ipcMain.on('exit', (event, arg) => {
        app.quit();
    });
});



