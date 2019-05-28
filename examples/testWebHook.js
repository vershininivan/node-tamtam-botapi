const TamTamBot = require('../core/tamtam');
const express = require('express');
const bodyParser = require('body-parser');

const TOKEN = 'wzkaE8SrN9Nmu9I-CdSfGjnwxAdKO2CYVv8PfTGvodc';
const url = '';

const bot = new TamTamBot(TOKEN);

var app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// We are receiving updates at the route below!
app.post(`/webhook`, (req, res) => {
    bot.updateHandler(req.body);
    res.sendStatus(200);
});

// Start Express Server
app.listen(port, () => {
    console.log(`Express server is listening on ${port}`);
});

let body = {};
body.text = 'test message';

bot.sendMessage(undefined, 52264184421, body);

bot.getAllChats();

bot.on('message_created', msg => {
    bot.sendMessage(undefined, msg.recipient.chat_id, body);
});
