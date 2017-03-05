const serial = require('./serial');

module.exports.on = () => {
  serial.send('appletv_menu');
};
