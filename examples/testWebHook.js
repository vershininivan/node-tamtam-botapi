const TamTamBot = require('../core/tamtam');
const express = require('express');
const bodyParser = require('body-parser');

const TOKEN = 'wzkaE8SrN9Nmu9I-CdSfGjnwxAdKO2CYVv8PfTGvodc';
const appName = 'tamtambot';
const path = 'webhook';

const bot = new TamTamBot(TOKEN);

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

bot.subscribe(`https://${appName}.herokuapp.com/${path}`);

// We are receiving updates at the route below!
app.post(`/${path}`, (req, res) => {
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

bot.on('bot_started', update => {
    bot.sendMessage(undefined, update.chat_id, body);
});
