"use strict";

const os = require('os');
const electron = require('electron');
const SerialPort = require('serialport');
const Switch = require('weatherstar-switch');

const {remote, ipcRenderer} = electron;
const {listPorts, serialInit} = require('./js/serialpull');

console.log('The author of this app is Sudharshan'); // Testing

// Create a 1 byte buffer
let uint8Transmit = new Uint8Array(1);
let uint8Filt = new Uint8Array(1);
let uint8Delta = new Uint8Array(1);

// Toggle callback functions
let voiceFunc = function() {
    uint8Transmit[0] = 0b00000000;
    console.log(uint8Transmit.toString('hex'));
}

let passFunc = function() {
    if(this.getChecked()) {
        uint8Transmit[0] = 0b01000000;
        console.log(uint8Transmit.toString('hex'));
    }
};

let delayFunc = function() {
    if(this.getChecked()) {
        uint8Transmit[0] = 0b10000000;
        console.log(uint8Transmit.toString('hex'));
    }
}

let pitchFunc = function() {
    if(this.getChecked()) {
        uint8Transmit[0] = 0b10100000;
        uint8Transmit[0] ^= (uint8Filt << 4);
        uint8Transmit[0] ^= uint8Delta;
        console.log(uint8Transmit.toString('hex'));
    }
}

let filtFunc = function() {
    if(this.getChecked()) {
        uint8Transmit[0] ^= 0b00010000;
    }
    else {
        uint8Transmit[0] &= 0b11101111;
    }
    console.log(uint8Transmit.toString('hex'));
}

document.addEventListener('DOMContentLoaded', () => {
    console.log(document.querySelector('#hello').innerHTML); // Testing

    // list available serial devices
    listPorts();

    // Inititalize switches
    let voiceSel = document.querySelector('#voicemode-switch');
    let instSel = document.querySelector('#instrumentmode-switch');
    let passSel = document.querySelector('#passthrough-switch');
    let delaySel = document.querySelector('#delay-switch');
    let pitchSel = document.querySelector('#pitch-switch');
    let filtSel = document.querySelector('#filter-switch');

    let voiceSwitch = new Switch(voiceSel, {size: 'default', onChange: voiceFunc});
    let instSwitch = new Switch(instSel, {size: 'default'});
    let passSwitch = new Switch(passSel, {size: 'small', disabled: true, onChange: passFunc});
    let delaySwitch = new Switch(delaySel, {size: 'small', disabled: true, onChange: delayFunc});
    let pitchSwitch = new Switch(pitchSel, {size: 'small', disabled: true, onChange: pitchFunc});
    let filtSwitch = new Switch(filtSel, {size: 'small', disabled: true, onChange: filtFunc});

    let switches = document.querySelectorAll('.switch');

    // Initialize buttons
    let upPitch = document.querySelector('#upPitch');
    let downPitch = document.querySelector('#downPitch');
    let upOctave = document.querySelector('#upOctave');
    let downOctave = document.querySelector('#downOctace');
    let upNote = document.querySelector('#upNote');
    let downNote = document.querySelector('#downNote');

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
            if(voiceSwitch.getChecked()) {
                passSwitch.enable();
                delaySwitch.enable();
                pitchSwitch.enable();
                instSwitch.off();
            }
            else {
                passSwitch.off();
                delaySwitch.off();
                pitchSwitch.off();
                filtSwitch.off();
                passSwitch.disable();
                delaySwitch.disable();
                pitchSwitch.disable();
                filtSwitch.disable();
            }
        };

        // When passthrough mode is selected
        switches[1].onclick = () => {
            if(passSwitch.getChecked()) {
                delaySwitch.off();
                pitchSwitch.off();
                filtSwitch.off();
                filtSwitch.disable();
            }
        }

        // When delay mode is selected
        switches[2].onclick = () => {
            if(delaySwitch.getChecked()) {
                passSwitch.off();
                pitchSwitch.off();
                filtSwitch.off();
                filtSwitch.disable();
            }
        }

        // When pitch mode is selected
        switches[3].onclick = () => {
            if(pitchSwitch.getChecked()) {
                passSwitch.off();
                delaySwitch.off();
                filtSwitch.enable();
            }
            else {
                filtSwitch.off();
                filtSwitch.disable();
            }
        }

        // When Instrument Mode is selected
        switches[5].onclick = () => {
            if(instSwitch.getChecked()) {
                passSwitch.off();
                delaySwitch.off();
                pitchSwitch.off();
                filtSwitch.off();
                passSwitch.disable();
                delaySwitch.disable();
                pitchSwitch.disable();
                filtSwitch.disable();
                voiceSwitch.off();
            }
        };
    };

    document.querySelector('#disconnect').onclick = () => {
        // Lazy reload by refresh
        location.reload();
    };
});
