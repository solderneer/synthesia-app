"use strict";

const os = require('os');
const electron = require('electron');
const SerialPort = require('serialport');

const {remote, ipcRenderer} = electron;

const {listPorts} = require('./js/serialpull');

console.log('The author of this app is Sudharshan'); // Testing

document.addEventListener('DOMContentLoaded', () => {
    console.log(document.querySelector('#hello').innerHTML); // Testing

    // list available serial devices
    listPorts();

    document.querySelector('#connect').onclick = () => {
        //ipcRenderer.sendSync('exit', null);
        document.querySelector('#initial').style.display = 'none';
        document.querySelector('#settings').style.display = 'block';

        let pitchEn = document.querySelector('#pitchen');
        let instEn = document.querySelector('#insten');

        pitchEn.onclick = () => {
            if(pitchEn.checked == true) {
                instEn.checked = false;
            }
        };

        instEn.onclick = () => {
            if(instEn.checked == true) {
                pitchEn.checked = false;
            }
        };
    };

    document.querySelector('#disconnect').onclick = () => {
        document.querySelector('#initial').style.display = 'block';
        document.querySelector('#settings').style.display = 'none';
    };
});
