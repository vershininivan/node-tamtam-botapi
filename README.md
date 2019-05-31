# Node.js TamTam Bot API
[![Bot API](https://img.shields.io/badge/TamTam%20Bot%20API-0.1.6-blue.svg)](https://dev.tamtam.chat)
[![Build Status](https://travis-ci.com/vershininivan/node-tamtam-botapi.svg?branch=first-version)](https://travis-ci.org/yagop/node-telegram-bot-api)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fvershininivan%2Fnode-tamtam-botapi.svg?type=shield)]()
[![codecov](https://codecov.io/gh/vershininivan/node-tamtam-botapi/branch/master/graph/badge.svg)](https://codecov.io/gh/vershininivan/node-tamtam-botapi)
[![NPM version](https://img.shields.io/npm/v/node-tamtam-botapi.svg?color=blue)](https://www.npmjs.com/package/node-tamtam-botapi)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)

## Install

```bash
npm install --save node-tamtam-botapi
```

## Usage

```j
const TamTamBot = require('node-tamtam-botapi');

const token = process.env.TEST_TAMTAM_BOTAPI_TOKEN || 'YOUR_TAMTAM_BOT_TOKEN';

// Subscribe on webhook (example for Heroku)
bot.subscribe(`https://${appName}.herokuapp.com/${path}`);

// We are receiving updates at the route below!
app.post(`/${path}`, (req, res) => {
    console.log('Request body:', req.body);
    // Method for listen event
    bot.updateHandler(req.body);
    res.sendStatus(200);
});

// Start Express Server
app.listen(PORT, () => {
    console.log(`Express server is listening on ${PORT}`);
});

bot.on('bot_started', update => {
    bot.sendMessage(undefined, update.chat_id, body);
});
```


## License

**The MIT License (MIT)**

Copyright © 2019 vershininivan
