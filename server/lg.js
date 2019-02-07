const WebSocket = require('ws');
const HANDSHAKE_TEMPLATE = require('./assets/hello.json');

module.exports['openSocket'] = (address) => {
  const socket = new WebSocket('ws://' + address + ':3000',
                               {"handshakeTimeout": 5000});
  return new Promise((resolve, reject) => {
    let onOpen;
    let onError;
    let onClose;
    const clearHandlers = () => {
      socket.removeListener('error', onError);
      socket.removeListener('close', onClose);
      socket.removeListener('open', onOpen);
    };

    onError = (err) => {
      clearHandlers();
      socket.close();
      reject(err);
    };
    onClose = () => {
      clearHandlers();
      onError("Unexpected close.");
    };
    onOpen = () => {
      clearHandlers();
      socket.removeListener('error', onError);
      resolve(socket);
    };
    socket.on('open', onOpen);
    socket.on('error', onError);
  });
};

module.exports['handshake'] = (socket, authKey) => {
  return new Promise((resolve, reject) => {
    let onError;
    let onMessage;
    let onClose;
    let timeoutHandle;
    const clearHandlers = () => {
      socket.removeListener('error', onError);
      socket.removeListener('close', onClose);
      socket.removeListener('message', onMessage);
      clearTimeout(timeoutHandle);
    };
    onError = (err) => {
      clearHandlers();
      socket.close();
      reject(err);
    };
    onClose = () => {
      onError("Unexpected close");
    };
    timeoutHandle = setTimeout(() => {
      onError("Timed out");
    }, 10000);
    onMessage = (message) => {
      const parsed = JSON.parse(message);
      if (parsed.id == 'register_0') {
        if (parsed.type == 'registered') {
          clearHandlers();
          resolve(socket);
        } else if (parsed.type == 'error') {
          onError(parsed.error);
        }
      }
    };
    socket.on('error', onError);
    socket.on('close', onClose);
    socket.on('message', onMessage);
    const handshakePacket = JSON.parse(JSON.stringify(HANDSHAKE_TEMPLATE));
	handshakePacket.payload['client-key'] = authKey;
    socket.send(JSON.stringify(handshakePacket));
  });
};

var command_count = 0;

module.exports['command'] = (socket, uri, payload) => {
  return new Promise((resolve, reject) => {
    const command_id = ++command_count;
    const commandPacket = {
      id: command_count,
      type: 'request',
      uri: uri,
      payload: payload
    };

    let onError;
    let onMessage;
    let onClose;
    let timeoutHandle;
    const clearHandlers = () => {
      socket.removeListener('error', onError);
      socket.removeListener('close', onClose);
      socket.removeListener('message', onMessage);
      clearTimeout(timeoutHandle);
    };
    onError = (err) => {
      clearHandlers();
      socket.close();
      reject(err);
    };
    onClose = () => {
      onError("Unexpected close");
    };
    timeoutHandle = setTimeout(() => {
      onError("Timed out");
    }, 10000);
    onMessage = (message) => {
      const parsed = JSON.parse(message);
      if (parsed.id.toString() === command_id.toString()) {
        if (parsed.type == 'error') {
          onError(parsed.error);
          return;
        }
        clearHandlers();
        resolve(parsed.payload);
      }
    };
    socket.on('error', onError);
    socket.on('close', onClose);
    socket.on('message', onMessage);
    socket.send(JSON.stringify(commandPacket));
  });
};

module.exports['close'] = (socket) => {
  socket.close();
};