"use strict";
var xhr = require('./xhr');
var serialport = require('serialport');   
// functions for serial communication
var exports = module.exports = {};


var myPort = null;
var setup_done = false;
let opened = false;

let writeQueue = [];
let timeoutHandle;

let timeOut;

const pumpQueue = () => {
  if (opened && writeQueue.length > 0) {
    console.log("sending to serial: " + writeQueue[0]);
    myPort.write(writeQueue[0]);
    timeoutHandle = setTimeout(timeOut, 4000);
  }
};

timeOut = () => {
  console.warning("timed out waiting for echo.");
  if (writeQueue.length > 0) {
    pumpQueue();
  }
};

// ------------------------ Serial event functions:
// this is called when the serial port is opened:
function showPortOpen() {
  opened = true;
  console.log('port open. Data rate: ' + myPort.options.baudRate);
  // Let the arduino boot.
  setTimeout(pumpQueue, 3000);
}

// this is called when new data comes into the serial port:
function receivedSerialData(data) {
  console.log("Received serial data: " + data);
  clearTimeout(timeoutHandle);

  if (data !== writeQueue[0]) {
    console.warning("potential issue, unexpected echo");
    pumpQueue();
    return;
  }

  writeQueue.shift();
  pumpQueue();
}

function showPortClose() {
   console.log('port closed.');
}
// this is called when the serial port has an error:
function showError(error) {
  console.log('Serial port error: ' + error);
}

function sendToSerial(data) {
  console.log("Queuing to serial: " + data);
  writeQueue.push(data);
  if (writeQueue.length === 1) {
    pumpQueue();
  }
}

var setup = function() {
	// from https://github.com/ITPNYU/physcomp/blob/master/labs2014/Node%20Serial%20Lab/wsServer.js
	// configure the serial port:
	var SerialPort = serialport,             // make a local instance of serialport
	    portName = '/dev/ttyUSB0',    // get serial port name look in arudino ide
	    delimiter = 'n';                			// serial parser to use, assuming newline
	var serialOptions = {                           // serial communication options
	      baudRate: 9600,                           // data rate: 9600 bits per second
	      parser: delimiter // newline generates a data event
    	};

    // if the delimiter is n, use readline as the parser:
	if (delimiter === 'n' ) {
	  serialOptions.parser = serialport.parsers.readline('\n');
	}

	if (typeof delimiter === 'undefined') {
	  serialOptions.parser = null;
	}

	// open the serial port:
	myPort = new SerialPort(portName, serialOptions);

	// set up event listeners for the serial events:
	myPort.on('open', showPortOpen);
	myPort.on('data', receivedSerialData);
	myPort.on('close', showPortClose);
	myPort.on('error', showError);

	setup_done = true;
};

exports.send = function(val) {
	if (!setup_done) {
      setup();
    }
    if (opened) {
	  sendToSerial(val);
    } else {
      writeQueue.push(val);
    }
};