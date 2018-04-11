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

/*
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
*/

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

    let voiceSwitch = new Switch(voiceSel, {size: 'default'});
    let instSwitch = new Switch(instSel, {size: 'default'});
    let passSwitch = new Switch(passSel, {size: 'small', disabled: true});
    let delaySwitch = new Switch(delaySel, {size: 'small', disabled: true});
    let pitchSwitch = new Switch(pitchSel, {size: 'small', disabled: true});
    let filtSwitch = new Switch(filtSel, {size: 'small', disabled: true});

    let switches = document.querySelectorAll('.switch');

    // Initialize buttons
    let upPitch = document.querySelector('#upPitch');
    let downPitch = document.querySelector('#downPitch');
    let upOctave = document.querySelector('#upOctave');
    let downOctave = document.querySelector('#downOctave');
    let upNote = document.querySelector('#upNote');
    let downNote = document.querySelector('#downNote');

    // Text handles
    let pitchVal = document.querySelector('#pitch-val');
    let octaveVal = document.querySelector('#octave-val');
    let noteVal = document.querySelector('#note-val');

    // Event Handlers for buttons
    upPitch.addEventListener("click", () => {
        let currentVal = parseInt(pitchVal.innerText);
        if(currentVal < 3) {
            currentVal = currentVal + 1;
            pitchVal.innerText = currentVal;
            upPitch.disabled = (currentVal == 3) ? true : false;
        }

        if(currentVal > -3) {
            downPitch.disabled = false;
        }
    });

    downPitch.addEventListener("click", () => {
        let currentVal = parseInt(pitchVal.innerText);
        if(currentVal > -3) {
            currentVal = currentVal - 1;
            pitchVal.innerText = currentVal;
            downPitch.disabled = (currentVal == -3) ? true : false;
        }

        if(currentVal < 3) {
            upPitch.disabled = false;
        }
    });

    upOctave.addEventListener("click", () => {
        let currentVal = parseInt(octaveVal.innerText);
        if(currentVal < 3) {
            currentVal = currentVal + 1;
            octaveVal.innerText = currentVal;
            upOctave.disabled = (currentVal == 3) ? true : false;
        }

        if(currentVal > -3) {
            downOctave.disabled = false;
        }
    });

    downOctave.addEventListener("click", () => {
        let currentVal = parseInt(octaveVal.innerText);
        if(currentVal > -3) {
            currentVal = currentVal - 1;
            octaveVal.innerText = currentVal;
            downOctave.disabled = (currentVal == -3) ? true : false;
        }

        if(currentVal < 3) {
            upOctave.disabled = false;
        }
    });

    upNote.addEventListener("click", () => {
        let currentVal = parseInt(noteVal.innerText);
        if(currentVal < 7) {
            currentVal = currentVal + 1;
            noteVal.innerText = currentVal;
            upNote.disabled = (currentVal == 7) ? true : false;
        }

        if(currentVal > 0) {
            downNote.disabled = false;
        }
    });

    downNote.addEventListener("click", () => {
        let currentVal = parseInt(noteVal.innerText);
        if(currentVal > 0) {
            currentVal = currentVal - 1;
            noteVal.innerText = currentVal;
            downNote.disabled = (currentVal == 0) ? true : false;
        }

        if(currentVal < 7) {
            upNote.disabled = false;
        }
    });


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

                upOctave.disabled = true;
                downOctave.disabled = true;
                upNote.disabled = true;
                downNote.disabled = true;

                octaveVal.innerText = 0;
                noteVal.innerText = 0;
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
                upPitch.disabled = true;
                downPitch.disabled = true;
                pitchVal.innerText = 0;
            }
        };

        // When passthrough mode is selected
        switches[1].onclick = () => {
            if(passSwitch.getChecked()) {
                delaySwitch.off();
                pitchSwitch.off();
                filtSwitch.off();
                filtSwitch.disable();
                upPitch.disabled = true;
                downPitch.disabled = true;
                pitchVal.innerText = 0;
            }
        }

        // When delay mode is selected
        switches[2].onclick = () => {
            if(delaySwitch.getChecked()) {
                passSwitch.off();
                pitchSwitch.off();
                filtSwitch.off();
                filtSwitch.disable();
                upPitch.disabled = true;
                downPitch.disabled = true;
                pitchVal.innerText = 0;
            }
        }

        // When pitch mode is selected
        switches[3].onclick = () => {
            if(pitchSwitch.getChecked()) {
                passSwitch.off();
                delaySwitch.off();
                filtSwitch.enable();
                upPitch.disabled = false;
                downPitch.disabled = false;
            }
            else {
                filtSwitch.off();
                filtSwitch.disable();
                upPitch.disabled = true;
                downPitch.disabled = true;
                pitchVal.innerText = 0;
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
                upPitch.disabled = true;
                downPitch.disabled = true;
                pitchVal.innerText = 0;
                voiceSwitch.off();

                upOctave.disabled = false;
                downOctave.disabled = false;
                upNote.disabled = false;
                downNote.disabled = false;
            }
            else {
                upOctave.disabled = true;
                downOctave.disabled = true;
                upNote.disabled = true;
                downNote.disabled = true;

                octaveVal.innerText = 0;
                noteVal.innerText = 0;
            }
        };

        // Function constructing the serial packet
        let constructSerial = () => {
            if(voiceSwitch.getChecked()) {
                if(passSwitch.getChecked()) {
                    uint8Transmit[0] = 0b01000000;
                }
                else if(delaySwitch.getChecked()) {
                    uint8Transmit[0] = 0b10000000;
                }
                else if(pitchSwitch.getChecked()) {
                    uint8Transmit[0] = 0b10100000;
                    uint8Transmit[0] |= (filtSwitch.getChecked()) << 4;

                    let currentVal = parseInt(pitchVal.innerText);

                    if(currentVal > 0) {
                        uint8Transmit[0] |= (Math.abs(currentVal)) << 2;
                    }
                    else if(currentVal < 0) {
                        uint8Transmit[0] |= (4-Math.abs(currentVal));
                    }
                    else {
                        // Do nothing
                    }
                }
                else {
                    uint8Transmit[0] = 0b00000000;
                }
            }
            else if(instSwitch.getChecked()) {
                let octVal = parseInt(octaveVal.innerText);
                let notVal = parseInt(noteVal.innerText);

                uint8Transmit[0] = 0b11000000;
                uint8Transmit[0] |= ((octVal >= 0) << 5);
                uint8Transmit[0] |= (Math.abs(octVal) << 3);
                uint8Transmit[0] |= notVal;
            }
            else {
                uint8Transmit[0] = 0b00000000;
            }

            // console.log(uint8Transmit.toString('hex'));
            serialport.write(uint8Transmit, 'binary');
        };

        // Intervaled output
        let delayTransmit = setInterval(constructSerial, 500);
    };

    document.querySelector('#disconnect').onclick = () => {
        // Lazy reload by refresh
        location.reload();
    };
});
