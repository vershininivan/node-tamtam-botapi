// const TamTamBot = require('../core/tamtam');
// const express = require('express');
// const bodyParser = require('body-parser');
//
// const TOKEN = 'wzkaE8SrN9Nmu9I-CdSfGjnwxAdKO2CYVv8PfTGvodc';
//
// const bot = new TamTamBot(TOKEN);
//
// const app = express();
//
// const PORT = process.env.PORT || 3000;
//
// app.use(bodyParser.json());
//
// // We are receiving updates at the route below!
// app.post(`/webhook2`, (req, res) => {
//     bot.updateHandler(req.body);
//     res.sendStatus(200);
// });
//
// // Start Express Server
// app.listen(PORT, () => {
//     console.log(`Express server is listening on ${PORT}`);
// });
//
// let body = {};
// body.text = 'test message';
//
// bot.sendMessage(undefined, 52264184421, body);
//
// bot.getAllChats();
//
// bot.on('message_created', msg => {
//     bot.sendMessage(undefined, msg.recipient.chat_id, body);
// });
