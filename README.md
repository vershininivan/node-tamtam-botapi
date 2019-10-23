# Node.js TamTam Bot API

[![Bot API](https://img.shields.io/badge/TamTam%20Bot%20API-0.1.8-blue.svg)](https://dev.tamtam.chat)
[![Build Status](https://travis-ci.com/vershininivan/node-tamtam-botapi.svg?branch=master)](https://travis-ci.org/vershininivan/node-tamtam-botapi)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fvershininivan%2Fnode-tamtam-botapi.svg?type=shield)]()
[![codecov](https://codecov.io/gh/vershininivan/node-tamtam-botapi/branch/master/graph/badge.svg)](https://codecov.io/gh/vershininivan/node-tamtam-botapi)
[![NPM version](https://img.shields.io/npm/v/node-tamtam-botapi.svg?color=blue)](https://www.npmjs.com/package/node-tamtam-botapi)

Module to interact with official [TamTam Bot API](https://dev.tamtam.chat).

## Install

```bash
npm install --save node-tamtam-botapi
```

## Usage

```js
const TamTamBot = require('node-tamtam-botapi');
const express = require('express');
const bodyParser = require('body-parser');

const appName = process.env.HEROKU_APP_NAME || 'HEROKU_APP_NAME';
const path = process.env.HEROKU_APP_PATH || 'HEROKU_APP_PATH';

const config = {
    token: process.env.TOKEN,
    host: process.env.HOST,
    version: process.env.API_VERSION
};

const bot = new TamTamBot(config);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const subscribeBody = {
    url: `https://${appName}.herokuapp.com/${path}`
};

//Subscribes bot to receive updates via WebHook
bot.subscribe(subscribeBody);

// We are receiving updates at the route below!
app.post(`/${path}`, (req, res) => {
    console.log('Request body: ', req.body);
    bot.webhookUpdateTypeHandler(req.body);
    res.send({
        success: true
    });
});

// Start Express Server
app.listen(PORT, () => {
    console.log(`Express server is listening on ${PORT}`);
});

const message = {
    text: 'Hello! this is a test message'
};
bot.on('message_created', update => {
    bot.sendMessage(undefined, update.message.recipient.chat_id, message);
});
```

## License

**The MIT License (MIT)**

Copyright © 2019 vershininivan