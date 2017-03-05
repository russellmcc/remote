const TV_KEY = "d9e419e59e62a9131baef06c70b4d3fb";
const tvMAC = '14:C9:13:B0:8A:CF';

const lg = require('./lg');
const Scanner = require('./scanner');
const arp = require('node-arp');
let wol = require('wake_on_lan');

let lastKnownAddress = null;

const ensureOn = () => {
  return new Promise((resolve, reject)  => {
    wol.wake(tvMAC, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const wait = (time) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

const scan = () => {
  // ensure TV is on
  return ensureOn().then(() => wait(6000)).then(() => {
    const scanner = new Scanner();
    let timerHandle = null;
    const closeScanner = () => {
      if (timerHandle) {
        clearTimeout(timerHandle);
      }
      scanner.stopScanning();
    }
    return new Promise((resolve, reject) => {
      let timedOut = false;
      timerHandle = setTimeout(() => {
        timerHandle = null;
        timedOut = true;
        console.error("timed out finding address");
        reject("Timed out.");
      }, 20000);
      scanner.on('device', (device) => {
        if (timedOut) { return; }
        console.log("found device, getting mac: ", device.address);
        arp.getMAC(device.address, (err, deviceMac) => {
          console.log("found mac for device: ", device.address, deviceMac);
          if (timedOut) { return; }
          if (err) { reject(err); }
          if (tvMAC.toLowerCase() === deviceMac.toLowerCase()) {
            lastKnownAddress = device.address;
            resolve(device.address);
          }
        });
      });
      scanner.startScanning();
    }).then((addr) => {
      closeScanner();
      return addr;
    }, (err) => {
      closeScanner();
      throw err;
    });
  });
};

const whileConnected = (f) => {
  // We retry once after rescanning.
  let attemptedRescan = false;
  const tryIt = () => {
    return lg.openSocket(lastKnownAddress).then((sock) => {
      return lg.handshake(sock, TV_KEY).then((sock) => {
        return f(sock).then((retVal) => {
          sock.close();
          return retVal;
        }, (err) => {
          sock.close();
          throw err;
        });
      });
    }).catch(
      (err) => {
        if (attemptedRescan) {
          throw err;
        }
        attemptedRescan = true;
        return scan().then(() => { return tryIt(); });
      });
  };
  return ensureOn()
    .then(wait(1000))
    .then(tryIt);
};


const createRemoteCommand = (uri, payload) => {
  return () => {
    return whileConnected((sock) => {
      return lg.command(sock, uri, payload);
    });
  };
};

const createSwitchInputCommand = (inputId) => {
  return createRemoteCommand(
    'ssap://tv/switchInput',
    {inputId: inputId});
};

const createAppCommand = (appId) => {
  return createRemoteCommand(
    'ssap://system.launcher/launch',
    {id: appId});
};

const commands = {};

commands.apple = createSwitchInputCommand('HDMI_2');
commands.ps4 = createSwitchInputCommand('HDMI_1');
commands.off = createRemoteCommand(
  'ssap://system/turnOff'
);

commands.amazon = createAppCommand('amazon.html');
commands.vudu = createAppCommand('vudu');
commands.netflix = createAppCommand('netflix');

commands.antenna = () => {
  return whileConnected((sock) => {
    return lg.command(sock, 'ssap://tv/getChannelList') .then((channels) => {
      return lg.command(
        sock,
        'ssap://tv/openChannel',
        {channelId: channels.channelList[0].channelId});
    });
  });
};

const queue = [];

const run = (command) => {
  queue.push(() => {
    commands[command]().then(() => {
      queue.shift();
      if (queue.length > 0) {
        return queue[0]();
      }
    });
  });
  if (queue.length == 1) {
    queue[0]();
  }
};

module.exports.run = run;
