const serial = require("./serial.js");

module.exports.setMode = (mode) => {
  if (mode == 'tv') {
    serial.send('xbox_audio');
  } else if (mode == 'turntable') {
    serial.send('turntable_audio');
  } else if (mode == 'apple') {
    serial.send('appletv_audio');
  }
};

module.exports.volumeDown = () => {
  serial.send('volume_down');
};

module.exports.volumeUp = () => {
  serial.send('volume_up');
}