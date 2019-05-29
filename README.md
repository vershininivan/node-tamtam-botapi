# Node.js TamTam Bot API
[![Bot API](https://img.shields.io/badge/TamTam%20Bot%20API-0.1.6-blue.svg)](https://dev.tamtam.chat)
[![Build Status](https://travis-ci.com/vershininivan/node-tamtam-botapi.svg?branch=first-version)](https://travis-ci.org/yagop/node-telegram-bot-api)

## Install

```bash
npm install --save node-tamtam-botapi
```

## Usage

```j
const TamTamBot = require('node-tamtam-botapi');

const token = 'YOUR_TAMTAM_BOT_TOKEN';

bot.on('bot_started', update => {
    bot.sendMessage(undefined, update.chat_id, body);
});
```


## License

**The MIT License (MIT)**

Copyright © 2019 vershininivan
