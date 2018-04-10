"use strict";

const SerialPort = require('serialport');


let serialInit = function (baudrate, COMport){
    let port = new SerialPort(COMport, { baudRate: baudrate }, function (err) {
        if (err) {
            return console.log('Error:', err.message);
        }
    });

    return port;
};

let listPorts = function  (){
    SerialPort.list((err, ports) => {
        ports.forEach((port) => {
            let COMport = document.querySelector('#comport');
            COMport.innerHTML = COMport.innerHTML + "<option>" + port.comName + "</option>";
            console.log(port.comName);
        });
    });
};

module.exports = {
    listPorts: listPorts,
    serialInit: serialInit
};



