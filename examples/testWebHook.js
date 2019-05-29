const TamTamBot = require('../core/tamtam');
const express = require('express');
const bodyParser = require('body-parser');

const TOKEN = 'wzkaE8SrN9Nmu9I-CdSfGjnwxAdKO2CYVv8PfTGvodc';
const HEROKU_APP_NAME = 'tamtambot';
const WEBHOOK_PATH = 'webhook';
const PORT = process.env.PORT || 3000;

const bot = new TamTamBot(TOKEN);
const app = express();

app.use(bodyParser.json());

bot.subscribe(`https://${HEROKU_APP_NAME}.herokuapp.com/${WEBHOOK_PATH}`);

// We are receiving updates at the route below!
app.post(`/${WEBHOOK_PATH}`, (req, res) => {
    console.log('Request body:', req.body);
    bot.updateHandler(req.body);
    res.sendStatus(200);
});

// Start Express Server
app.listen(PORT, () => {
    console.log(`Express server is listening on ${PORT}`);
});

let body = {};
body.text = 'test message';

bot.sendMessage(undefined, 52264184421, body);

bot.getAllChats(1);
bot.getMyInfo();

bot.on('bot_started', update => {
    bot.sendMessage(undefined, update.chat_id, body);
});
