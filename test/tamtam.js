require('dotenv').config();
const TamTamBotApi = require('..');
const utils = require('./utils');
const assert = require('assert');
const is = require('is');

const TOKEN_BOT_1 = process.env.TEST_TAMTAM_BOTAPI_TOKEN_1;
const TOKEN_BOT_2 = process.env.TEST_TAMTAM_BOTAPI_TOKEN_2;
const USER_ID_BOT_1 = process.env.USER_ID_BOT_1;
const USER_ID_BOT_2 = process.env.USER_ID_BOT_2;
const CHAT_ID_1 = process.env.CHAT_ID_1;
const CHAT_ID_2 = process.env.CHAT_ID_2;
const DIALOG_ID = process.env.DIALOG_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;
const HOST = process.env.HOST;
const VERSION = process.env.API_VERSION;

if (!TOKEN_BOT_1) {
    throw new Error('Bot token not provided');
}

describe('TamTamBotAPI', function tamtamSuite() {
    let bot_1;
    let bot_2;
    this.retries(2);

    before(function beforeAll() {
        const config_1 = {
            token: TOKEN_BOT_1,
            host: HOST,
            version: VERSION
        };
        bot_1 = new TamTamBotApi(config_1);
        const config_2 = {
            token: TOKEN_BOT_2,
            host: HOST,
            version: VERSION
        };
        bot_2 = new TamTamBotApi(config_2);
    });

    describe('#bots', function bots() {
        describe('#getMyInfo', function getMyInfoSuite() {
            it('should return object with current bot info', function test() {
                return bot_1.getMyInfo().then(resp => {
                    resp = JSON.parse(resp);
                    assert.ok(is.object(resp));
                    assert.ok(is.number(resp.user_id));
                    assert.ok(is.string(resp.name));
                })
            })
        });

        describe('#editMyInfo', function editMyInfoSuite() {
            it('should return object with current bot info, after change bot info', function test() {
                let body = {};
                let random = utils.randomInteger(0, 1000);
                body.name = 'Testing with CI #' + random;
                body.description = 'Testing nodejs botapi with CI #'  + random;
                return bot_1.editMyInfo(body).then( resp => {
                    resp = JSON.parse(resp);
                    assert.ok(is.object(resp));
                    assert.ok(is.equal(resp.name, body.name));
                    assert.ok(is.equal(resp.description, body.description));
                })
            })
        });
    });

    describe('#chats', function chats() {
        describe('#getAllChats', function getAllChatsSuite() {
            it('should return object with information about chat that bot participated in', function test() {
                return bot_1.getAllChats(1).then(resp => {
                    resp = JSON.parse(resp);
                    assert.ok(is.object(resp));
                    assert.ok(!is.undefined(resp.marker));
                })
            })
        });

        describe('#getChat', function getChatSuite() {
            it('should returns info about chat', function test() {
                return bot_1.getChat(CHAT_ID_1).then(resp => {
                    resp = JSON.parse(resp);
                    assert.ok(is.object(resp));
                    assert.ok(is.equal(resp.type, 'chat'));
                    assert.ok(is.equal(resp.chat_id.toString(), CHAT_ID_1));
                })
            });
            it('should returns info about channel', function test() {
                return bot_1.getChat(CHANNEL_ID).then(resp => {
                    resp = JSON.parse(resp);
                    assert.ok(is.object(resp));
                    assert.ok(is.equal(resp.type, 'channel'));
                    assert.ok(is.equal(resp.chat_id.toString(), CHANNEL_ID));
                })
            });
            it('should returns info about dialog', function test() {
                return bot_1.getChat(DIALOG_ID).then(resp => {
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
                body.title = 'Test CI chat #1: ' + utils.randomInteger(0, 10000);
                return bot_1.editChat(CHAT_ID_1, body).then(resp => {
                    resp = JSON.parse(resp);
                    assert.ok(is.object(resp));
                    assert.ok(is.equal(resp.title, body.title));
                })
            });
            it('should return info about channel, after change title', function test() {
                body = {};
                body.title = 'Test CI channel ' + utils.randomInteger(0, 10000);
                return bot_1.editChat(CHANNEL_ID, body).then(resp => {
                    resp = JSON.parse(resp);
                    assert.ok(is.object(resp));
                    assert.ok(is.equal(resp.title, body.title));
                })
            });
            it('should return error, after try to change title for dialog', function test() {
                let body = {};
                body.title = 'Test CI dialog ' + utils.randomInteger(0, 10000);
                return bot_1.editChat(DIALOG_ID, body).catch(res => {
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
                    return bot_1.sendAction(CHAT_ID_1, body).then(resp => {
                        resp = JSON.parse(resp);
                        assert.ok(is.object(resp));
                        assert.ok(is.equal(resp.success, true));
                    });
                });
            });
            it('should return error, after try send invalid action', function test() {
                let body = {};
                let invalid_action = 'some_action';
                body.action = invalid_action;
                return bot_1.sendAction(DIALOG_ID, body).catch(res => {
                    let response = JSON.parse(JSON.stringify(res.response));
                    let body = JSON.parse(response.body);
                    assert.ok(is.object(body));
                    assert.ok(is.equal(body.code, 'proto.payload'));
                    //assert.ok(is.equal(body.message, '/action: instance value ("' + invalid_action + '") in unknown'));
                    assert.ok(is.equal(body.message, '/action: instance value ("' + invalid_action + '") not found in enum (possible values: ["typing_on","typing_off","sending_photo","sending_video","sending_audio","mark_seen"])'));
                    //console.log(body.message);
                })
            })
        });

        describe('#getMembership', function getMembershipSuite() {
            it('should returns chat membership info for current bot', function test() {
                return bot_1.getMembership(CHAT_ID_1).then( resp => {
                    resp = JSON.parse(resp);
                    assert.ok(is.object(resp));
                    assert.ok(is.array(resp.permissions));
                    assert.ok(is.equal(resp.is_admin, true));
                })
            });
            it('should returns error, because send chat_id from dialog', function test() {
                return bot_1.getMembership(DIALOG_ID).catch( resp => {
                    let response = JSON.parse(JSON.stringify(resp.response));
                    let body = JSON.parse(response.body);
                    assert.ok(is.object(body));
                    assert.ok(is.equal(body.code, 'proto.payload'));
                    assert.ok(is.equal(body.message, 'Method is available for chats only.'));
                })
            })
        });

        describe('#getAdmins', function getAdminsSuite() {
            it('should be one of admins', function test() {
                return bot_1.getAdmins(CHAT_ID_1).then(resp => {
                    assert.ok(is.object(resp));
                    assert.ok(is.array(resp.members));
                    assert.ok(is.true(resp.members.some(member => member.user_id == USER_ID_BOT_1)));
                })
            });
        });

        describe.skip('#leaveChat', function leaveChatSuite() {
            before(function () {
                bot_1.addMembers(CHAT_ID_1, {user_ids: USER_ID_BOT_2})
            })
        })
    });

    describe('#subscriptions', function subscriptions() {
        const url = 'http://test.botapi.ok';
        before(function () {
            bot_1.subscribe({url: url});
        });
        describe('#getSubscriptions', function getSubscriptionsSuite() {
            it('should returns list of all subscriptions', function test() {
                return bot_1.getSubscriptions().then( resp => {
                    resp = JSON.parse(resp);
                    assert.ok(is.object(resp));
                    assert.ok(is.equal(resp.subscriptions[0].url, url))
                })
            })
        });
        describe('#unsubscribe', function unsubscribeSuite() {
            it('should returns boolean', function test() {
                return bot_1.unsubscribe(url).then( resp => {
                    resp = JSON.parse(resp);
                    assert.ok(is.object(resp));
                    assert.ok(is.equal(resp.success, true));
                })
            })
        })

    });

    describe('#upload', function upload() {
        describe('#getUploadUrl', function getUploadUrlSuite() {
            const types = ['photo', 'video', 'audio', 'file'];
            types.forEach(function (type) {
                it('should return url', function test() {
                    return bot_1.getUploadUrl(type).then(resp => {
                        resp = JSON.parse(resp);
                        assert.ok(is.object(resp));
                        assert.ok(!is.undefined(resp.url));
                    })
                })
            })
        })
    })
});
