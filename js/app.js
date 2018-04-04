"use strict"

const os = require('os');
const electron = require('electron')

const {remote, ipcRenderer} = electron;

console.log('The author of this app is Sudharshan');

document.addEventListener('DOMContentLoaded', () => {
    console.log(document.querySelector('#hello').innerHTML); // Testing

    document.querySelector('#connect').onclick = () => {
        ipcRenderer.sendSync('exit', null);
    };
});
