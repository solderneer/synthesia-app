"use strict";

const SerialPort = require('serialport');

/*
let serialInit = function (baudrate, COMport){
    let port = new SerialPort(COMport, { baudRate: baudrate }, function (err) {
        if (err) {
            return console.log('Error:', err.message);
        }
    });

    return port;
};*/

let listPorts = function  (){
    SerialPort.list((err, ports) => {
        ports.forEach((port) => {
            var comport = document.querySelector('#comport');
            comport.innerHTML = comport.innerHTML + "<option>" + port.comName + "</option>";
            console.log(port.comName);
            console.log(port.pnpID);
            console.log(port.manufacturer);
        });
    });
};

module.exports = {
    listPorts: listPorts
};



