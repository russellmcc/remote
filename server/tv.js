const TV_KEY = "d9e419e59e62a9131baef06c70b4d3fb";
const tvMAC = '14:C9:13:B0:8A:CF';

const lg = require('./lg');
const Scanner = require('./scanner');
const arp = require('node-arp');
let wol = require('wake_on_lan');

let lastKnownAddress = null;

const ensureOn = () => {
  console.log("ensuring TV is on")
  return new Promise((resolve, reject)  => {
    console.log("running wol wake");
    wol.wake(tvMAC, (err) => {
      if (err) {
        console.log("wol wake failed", err);
        reject(err);
      } else {
        console.log("wol wake succeeded");
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
  // Two fundamental things can go wrong here... - we can be off and
  // waiting for the TV to turn on, or we can have the wrong IP address.
  // For maximum speed when the TV is on, we try immediately, and then
  // start retrying while the TV boots. If we fail 3 times, we do a scan
  // and finally give up.
  let fails = 0;

  // We retry once after rescanning.
  let attemptedRescan = false;
  const tryIt = () => {
    console.log("attempting to open TV socket");
    return lg.openSocket(lastKnownAddress).then((sock) => {
      console.log("opened TV socket");
      return lg.handshake(sock, TV_KEY).then((sock) => {
        console.log("handshake accepted; running command");
        return f(sock).then((retVal) => {
          console.log("command succeeded; closing socket.");
          sock.close();
          return retVal;
        }, (err) => {
          sock.close();
          throw err;
        });
      });
    }).catch(
      (err) => {
        console.log("Failed to open socket - attempt " + fails);
        if (fails < 3 && lastKnownAddress) {
          ++fails;
          return wait(fails * 1000).then(() => {
            return ensureOn().then(tryIt);
          });
        }
        if (attemptedRescan) {
          throw err;
        }
        attemptedRescan = true;
        return ensureOn().then(scan).then(() => { return tryIt(); });
      });
  };

  return ensureOn()
    .then(tryIt);
};


const createRemoteCommand = (uri, payload) => {
  return () => {
    console.log("Sending TV command: " + uri);
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
commands.computer = createSwitchInputCommand('HDMI_4');
commands.chromecast = createSwitchInputCommand('HDMI_3');
commands.off = createRemoteCommand(
  'ssap://system/turnOff'
);

commands.amazon = createAppCommand('amazon.html');
commands.vudu = createAppCommand('vudu');
commands.netflix = createAppCommand('netflix');

commands.channelUp = createRemoteCommand('ssap://tv/channelUp');
commands.channelDown = createRemoteCommand('ssap://tv/channelDown');

commands.antenna = () => {
  console.log("starting antenna");
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
  console.log("adding " + command + " to TV command queue.")
  queue.push(() => {
    console.log("running TV command " + command);
    commands[command]().then(() => {
      console.log("finished TV command " + command);
      queue.shift();
      if (queue.length > 0) {
        return queue[0]();
      }
    }).catch((err) => {
      console.warn("TV command ", command, " failed:");
      console.warn(err);
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

module.exports.setMode = run;

module.exports.channelUp = () => {
  run('channelUp');
};

module.exports.channelDown = () => {
  run('channelDown');
};