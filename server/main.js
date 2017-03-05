const ourtv = require('./ourtv');
const ourreceiver = require('./ourreceiver');
const ourapple = require('./ourapple');

const modes = {
  off: () => {
    ourtv.run('off');
  },
  ps4: () => {
    ourtv.run('ps4');
    ourreceiver.run('tv');
  },
  apple: () => {
    ourtv.run('apple');
    ourreceiver.run('tv');
    ourapple.run('on');
  },
  antenna: () => {
    ourtv.run('antenna');
    ourreceiver.run('tv');
  },
  vudu: () => {
    ourtv.run('vudu');
    ourreceiver.run('tv');
  },
  amazon: () => {
    ourtv.run('amazon');
    ourreceiver.run('tv');
  },
  netflix: () => {
    ourtv.run('netflix');
    ourreceiver.run('tv');
  },
  turntable: () => {
    ourreceiver.run('turntable');
  },
  apple_music: () => {
    ourreceiver.run('apple');
    ourapple.run('on');
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
    ourtv.run('channelUp');
  },
  'down': () => {
    ourtv.run('channelDown');
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
    ourreceiver.run('volumeUp');
  },
  'down': () => {
    ourreceiver.run('volumeDown');
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