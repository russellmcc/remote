const tv = require('./tv');
const receiver = require('./receiver');
const apple = require('./apple');
const hue = require('./hue');

const modes = {
  off: () => {
    tv.setMode('off');
  },
  ps4: () => {
    tv.setMode('ps4');
    receiver.setMode('tv');
    hue.turnOffArtichoke();
  },
  apple: () => {
    tv.setMode('apple');
    receiver.setMode('tv');
    apple.on();
    hue.turnOffArtichoke();
  },
  antenna: () => {
    tv.setMode('antenna');
    receiver.setMode('tv');
    hue.turnOffArtichoke();
  },
  vudu: () => {
    tv.setMode('vudu');
    receiver.setMode('tv');
    hue.turnOffArtichoke();
  },
  amazon: () => {
    tv.setMode('amazon');
    receiver.setMode('tv');
    hue.turnOffArtichoke();
  },
  netflix: () => {
    tv.setMode('netflix');
    receiver.setMode('tv');
    hue.turnOffArtichoke();
  },
  turntable: () => {
    receiver.setMode('turntable');
  },
  apple_music: () => {
    receiver.setMode('apple');
    apple.on();
  }
};

const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.options('*', cors());

app.put('/state', (req, res) => {
  if (!(req.body.mode && modes[req.body.mode])) {
    res.send(400, "request body contained invalid 'mode' field");
  }
  modes[req.body.mode]();
  res.sendStatus(200);
});

const channels = {
  'up': () => {
    tv.channelUp();
  },
  'down': () => {
    tv.channelDown();
  }
};

app.put('/channel', (req, res) => {
  if (!(req.body.direction && channels[req.body.direction])) {
    res.send(400, "request body contained invalid 'direction' field");
  }
  channels[req.body.direction]();
  res.sendStatus(200);
});

const volumes = {
  'up': () => {
    receiver.volumeUp();
  },
  'down': () => {
    receiver.volumeDown();
  }
};

app.put('/volume', (req, res) => {
  if (!(req.body.direction && volumes[req.body.direction])) {
    res.send(400, "request body contained invalid 'direction' field");
  }
  volumes[req.body.direction]();
  res.sendStatus(200);
});

app.listen(8888);