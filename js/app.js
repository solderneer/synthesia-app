"use strict";

const os = require('os');
const electron = require('electron');
const SerialPort = require('serialport');
const Switch = require('weatherstar-switch');

const {remote, ipcRenderer} = electron;
const {listPorts, serialInit} = require('./js/serialpull');

console.log('The author of this app is Sudharshan'); // Testing

// Create a 1 byte buffer
let transmitBuffer = new Buffer(1);
let uint8Transmit = new Uint8Array(transmitBuffer);

document.addEventListener('DOMContentLoaded', () => {
    console.log(document.querySelector('#hello').innerHTML); // Testing

    // list available serial devices
    listPorts();

    // Inititalize switches
    let voiceSel = document.querySelector('#voicemode-switch');
    let instSel = document.querySelector('#instrumentmode-switch');
    let passSel = document.querySelector('#passthrough-switch');
    let delaySel = document.querySelector('#delay-switch');

    let voiceSwitch = new Switch(voiceSel, {size: 'default'});
    let instSwitch = new Switch(instSel, {size: 'default'});
    let passSwitch = new Switch(passSel, {size: 'small'});
    let delaySwitch = new Switch(delaySel, {size: 'small'});

    let switches = document.querySelectorAll('.switch');

    // Connect routine
    document.querySelector('#connect').onclick = () => {
        //ipcRenderer.sendSync('exit', null);
        document.querySelector('#initial').style.display = 'none';
        document.querySelector('#settings').style.display = 'block';

        // TODO: add error checking for inputs
        let BaudRate = document.querySelector('#baudrate');
        let COMport = document.querySelector('#comport');

        let selBaudRate = BaudRate.options[BaudRate.selectedIndex].text;
        let selCOMport = COMport.options[COMport.selectedIndex].text;

        selBaudRate = parseInt(selBaudRate);

        let serialport = serialInit(selBaudRate, selCOMport);
        console.log(serialport);

        // When Voice Mode is selected
        switches[0].onclick = () => {
            // Enable voice mode features
            passSwitch.enable();
            delaySwitch.enable();

            // Disable instrument mode features
            instSwitch.off();
        };

        // When Instrument Mode is selected
        switches[3].onclick = () => {
            // Disable voice mode features
            voiceSwitch.off();
            passSwitch.disable();
            delaySwitch.disable();

        };
    };

    document.querySelector('#disconnect').onclick = () => {
        document.querySelector('#initial').style.display = 'block';
        document.querySelector('#settings').style.display = 'none';
        location.reload();
    };
});
