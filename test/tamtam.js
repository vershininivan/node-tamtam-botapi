const TamTamBotApi = require('..');
const utils = require('./utils');
const assert = require('assert');
const is = require('is');

const TOKEN = process.env.TEST_TAMTAM_BOTAPI_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const CHAT_ID = process.env.CHAT_ID;
const DIALOG_ID = process.env.DIALOG_ID;

if (!TOKEN) {
    throw new Error('Bot token not provided')
}

describe('TamTamBotAPI', function tamtamSuite() {
    let bot;

    before(function beforeAll() {
        bot = new TamTamBotApi(TOKEN)
    });

    describe('#getMyInfo', function getMyInfoSuite() {
        it('should return object with current bot info', function test() {
            return bot.getMyInfo().then(resp => {
                resp = JSON.parse(resp);
                assert.ok(is.object(resp));
                assert.ok(is.number(resp.user_id));
                assert.ok(is.string(resp.name))
            })
        })
    });

    describe('#getAllChats', function getAllChatsSuite() {
        it('should return object with information about chat that bot participated in', function test() {
            return bot.getAllChats(1).then(resp => {
                resp = JSON.parse(resp);
                assert.ok(is.object(resp));
                assert.ok(!is.undefined(resp.marker));
            })
        })
    });

    describe('#getChat', function getChatSuite() {
        it('should returns info about chat', function test() {
            return bot.getChat(CHAT_ID).then(resp => {
                resp = JSON.parse(resp);
                assert.ok(is.object(resp));
                assert.ok(is.equal(resp.type, 'chat'));
                assert.ok(is.equal(resp.chat_id.toString(), CHAT_ID));
            })
        });
        it('should returns info about channel', function test() {
            return bot.getChat(CHANNEL_ID).then(resp => {
                resp = JSON.parse(resp);
                assert.ok(is.object(resp));
                assert.ok(is.equal(resp.type, 'channel'));
                assert.ok(is.equal(resp.chat_id.toString(), CHANNEL_ID));
            })
        });
        it('should returns info about dialog', function test() {
            return bot.getChat(DIALOG_ID).then(resp => {
                resp = JSON.parse(resp);
                assert.ok(is.object(resp));
                assert.ok(is.equal(resp.type, 'dialog'));
                assert.ok(is.equal(resp.chat_id.toString(), DIALOG_ID));
            })
        });
    });

    describe('#editChat', function editChatSuite() {
        it('should return info about chat, after change title', function test() {
            body = {};
            body.title = 'Test CI chat ' + utils.randomInteger(0, 10000);
            return bot.editChat(CHAT_ID, body).then(resp => {
                resp = JSON.parse(resp);
                assert.ok(is.object(resp));
                assert.ok(is.equal(resp.title, body.title));
            })
        });
        it('should return info about channel, after change title', function test() {
            body = {};
            body.title = 'Test CI channel ' + utils.randomInteger(0, 10000);
            return bot.editChat(CHANNEL_ID, body).then(resp => {
                resp = JSON.parse(resp);
                assert.ok(is.object(resp));
                assert.ok(is.equal(resp.title, body.title));
            })
        });
        it('should return error, after try to change title for dialog', function test() {
            let body = {};
            body.title = 'Test CI dialog ' + utils.randomInteger(0, 10000);
            return bot.editChat(DIALOG_ID, body).catch(res => {
                let response = JSON.parse(JSON.stringify(res.response));
                let body = JSON.parse(response.body);
                assert.ok(is.object(body));
                assert.ok(is.equal(body.code, 'proto.payload'));
                assert.ok(is.equal(body.message, 'Cannot modify dialog info. Method is available for chats only.'));
            })
        })
    });

    describe('#sendAction', function sendActionSuite() {
        const actions = ['typing_on', 'typing_off', 'sending_photo', 'sending_video', 'sending_audio', 'mark_seen'];
        actions.forEach(function (action) {
            let body = {};
            body.action = action;
            it('should return true if request ' + JSON.stringify(body) + ' was successful', function test() {
                return bot.sendAction(CHAT_ID, body).then(resp => {
                    resp = JSON.parse(resp);
                    assert.ok(is.object(resp));
                    assert.ok(is.equal(resp.success, true));
                })
            })
        });
        it('should return error, after try send invalid action', function test() {
            let body = {};
            let invalid_action = 'some_action';
            body.action = invalid_action;
            return bot.sendAction(DIALOG_ID, body).catch(res => {
                let response = JSON.parse(JSON.stringify(res.response));
                let body = JSON.parse(response.body);
                assert.ok(is.object(body));
                assert.ok(is.equal(body.code, 'proto.payload'));
                assert.ok(is.equal(body.message, '/action: instance value ("' + invalid_action + '") in unknown'));
            })
        })
    })
});
