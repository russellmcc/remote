const serial = require("./serial.js");

module.exports.setMode = (mode) => {
  if (mode == 'tv') {
    serial.send('tv');
  } else if (mode == 'turntable') {
    serial.send('turntable');
  } else if (mode == 'appletv') {
    serial.send('appletv');
  }
};

module.exports.volumeDown = () => {
  serial.send('volume_down');
};

module.exports.volumeUp = () => {
  serial.send('volume_up');
}