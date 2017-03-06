const serial = require("./serial.js");

module.exports.setMode = (mode) => {
  if (mode == 'tv') {
    serial.send('xbox_audio\n');
  } else if (mode == 'turntable') {
    serial.send('turntable_audio\n');
  } else if (mode == 'apple') {
    serial.send('appletv_audio\n');
  }
};

module.exports.volumeDown = () => {
  serial.send('volume_down\n');
};

module.exports.volumeUp = () => {
  serial.send('volume_up\n');
}