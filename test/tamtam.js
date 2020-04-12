require('dotenv').config();
const TamTamBotApi = require('..');
const utils = require('./utils');
const assert = require('assert');
const is = require('is');

const TOKEN_BOT_1 = process.env.TEST_TAMTAM_BOTAPI_TOKEN_1;
const TOKEN_BOT_2 = process.env.TEST_TAMTAM_BOTAPI_TOKEN_2;
const USER_ID_BOT_1 = process.env.USER_ID_BOT_1;
const USER_ID_BOT_2 = process.env.USER_ID_BOT_2;
const USER_ID_BOT_3 = process.env.USER_ID_BOT_3;
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
    this.retries(3);

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
                    assert.ok(is.object(resp));
                    assert.ok(is.number(resp.user_id));
                    assert.ok(is.string(resp.name));
                });
            });
        });

        describe('#editMyInfo', function editMyInfoSuite() {
            it('should return object with current bot info, after change bot info', function test() {
                let body = {};
                let random = utils.randomInteger(0, 1000);
                body.name = 'Testing with CI #' + random;
                body.description = 'Testing nodejs botapi with CI #'  + random;
                return bot_1.editMyInfo(body).then( resp => {
                    assert.ok(is.object(resp));
                    assert.ok(is.equal(resp.name, body.name));
                    assert.ok(is.equal(resp.description, body.description));
                });
            });
        });
    });

    describe('#chats', function chats() {
        describe('#getAllChats', function getAllChatsSuite() {
            it('should return object with information about chat that bot participated in', function test() {
                return bot_1.getAllChats(1).then(resp => {
                    assert.ok(is.object(resp));
                    assert.ok(!is.undefined(resp.marker));
                });
            });
        });

        describe('#getChatByLink', function getChatByLinkSuite() {
            it('should return object with information about chat by link that bot participated in', function test() {
                return bot_2.getChatByLink('@UsefulLinks').then(resp => {
                    assert.ok(is.object(resp));
                    assert.ok(is.equal(resp.type, 'channel'));
                    assert.ok(is.equal(resp.link, 'https://tt.me/UsefulLinks'));
                });
            });
        });

        describe('#getChat', function getChatSuite() {
            it('should returns info about chat', function test() {
                return bot_1.getChat(CHAT_ID_1).then(resp => {
                    assert.ok(is.object(resp));
                    assert.ok(is.equal(resp.type, 'chat'));
                    assert.ok(is.equal(resp.chat_id.toString(), CHAT_ID_1));
                });
            });
            it('should returns info about channel', function test() {
                return bot_1.getChat(CHANNEL_ID).then(resp => {
                    assert.ok(is.object(resp));
                    assert.ok(is.equal(resp.type, 'channel'));
                    assert.ok(is.equal(resp.chat_id.toString(), CHANNEL_ID));
                });
            });
            it('should returns info about dialog', function test() {
                return bot_1.getChat(DIALOG_ID).then(resp => {
                    assert.ok(is.object(resp));
                    assert.ok(is.equal(resp.type, 'dialog'));
                    assert.ok(is.equal(resp.chat_id.toString(), DIALOG_ID));
                });
            });
        });

        describe('#editChat', function editChatSuite() {
            it('should return info about chat, after change title', function test() {
                let body = {};
                body.title = 'Test CI chat #1: ' + utils.randomInteger(0, 10000);
                return bot_1.editChat(CHAT_ID_1, body).then(resp => {
                    assert.ok(is.object(resp));
                    assert.ok(is.equal(resp.title, body.title));
                });
            });
            it('should return info about channel, after change title', function test() {
                let body = {};
                body.title = 'Test CI channel ' + utils.randomInteger(0, 10000);
                return bot_1.editChat(CHANNEL_ID, body).then(resp => {
                    assert.ok(is.object(resp));
                    assert.ok(is.equal(resp.title, body.title));
                });
            });
            it('should return error, after try to change title for dialog', function test() {
                let body = {};
                body.title = 'Test CI dialog ' + utils.randomInteger(0, 10000);
                return bot_1.editChat(DIALOG_ID, body).catch(res => {
                    assert.ok(is.object(res));
                    assert.ok(is.equal(res.code, 'proto.payload'));
                    assert.ok(is.equal(res.message, 'Method is not available for dialogs'));
                });
            });
        });

        describe('#sendAction', function sendActionSuite() {
            const actions = ['typing_on', 'sending_file', 'sending_photo', 'sending_video', 'sending_audio', 'mark_seen'];
            actions.forEach(function (action) {
                let body = {};
                body.action = action;
                it('should return true if request ' + JSON.stringify(body) + ' was successful', function test() {
                    return bot_1.sendAction(CHAT_ID_1, body).then(resp => {
                        assert.ok(is.object(resp));
                        assert.ok(is.equal(resp.success, true));
                    });
                });
            });
            it('should return error, after try send invalid action', function test() {
                let body = {};
                body.action = 'some_action';
                return bot_1.sendAction(DIALOG_ID, body).catch(res => {
                    assert.ok(is.object(res));
                    assert.ok(is.equal(res.code, 'proto.payload'));
                    assert.ok(is.equal(res.message, 'action: value not found in enum. Possible values are: typing_on, sending_photo, sending_video, sending_audio, sending_file, mark_seen'));
                });
            });
        });

        describe('#pinSuite', function pinMessageSuite() {
            let pinMsg = 'Test #unpinMessage #' + utils.randomInteger();
            it('should return success: true', function test() {
                bot_1.sendMessage(undefined, CHAT_ID_1, undefined, {text: pinMsg})
                    .then( respSendMessage => {
                        let midPinMessage = respSendMessage.message.body.mid;
                        bot_1.pinMessage(CHAT_ID_1,{message_id: midPinMessage, notify: true})
                            .then(respPinMessage => {
                                assert.ok(is.object(respPinMessage));
                                assert.ok(is.true(respPinMessage.success));
                                bot_1.getPinnedMessage(CHAT_ID_1).then( respGetPinnedMsg => {
                                    assert.ok(is.object(respGetPinnedMsg));
                                    assert.ok(is.equal(pinMsg, respGetPinnedMsg.message.body.text));
                                    assert.ok(is.equal(midPinMessage, respGetPinnedMsg.message.body.mid));
                                    bot_1.unpinMessage(CHAT_ID_1).then(respUnpinMsg => {
                                        assert.ok(is.object(respUnpinMsg));
                                        assert.ok(is.true(respUnpinMsg.success));
                                    });
                                });
                            });
                    });
            });
        });

        describe('#getMembership', function getMembershipSuite() {
            it('should returns chat membership info for current bot', function test() {
                return bot_1.getMembership(CHAT_ID_1).then( resp => {
                    assert.ok(is.object(resp));
                    assert.ok(is.array(resp.permissions));
                    assert.ok(is.equal(resp.is_admin, true));
                });
            });
            it('should returns error, because send chat_id from dialog', function test() {
                return bot_1.getMembership(DIALOG_ID).catch( resp => {
                    assert.ok(is.object(resp));
                    assert.ok(is.equal(resp.code, 'proto.payload'));
                    assert.ok(is.equal(resp.message, 'Method is not available for dialogs'));
                });
            });
        });

        describe('#leaveChat', function leaveChatSuite() {
            it('should be return success', function test() {
                bot_1.addMembers(CHAT_ID_1, {user_ids: [USER_ID_BOT_2]});
                return bot_2.leaveChat(CHAT_ID_1).then(resp => {
                    assert.ok(is.object(resp));
                    assert.ok(is.true(resp.success));
                });
            });
        });

        describe('#getAdmins', function getAdminsSuite() {
            it('should be one of admins', function test() {
                return bot_1.getAdmins(CHAT_ID_1).then(resp => {
                    assert.ok(is.object(resp));
                    assert.ok(is.array(resp.members));
                    assert.ok(is.true(resp.members.some(member => member.user_id == USER_ID_BOT_1)));
                });
            });
        });

        describe('', function getMembersSuite() {
            it('should be one of member', function test() {
                return bot_1.getMembers(CHAT_ID_1).then(resp => {
                    assert.ok(is.object(resp));
                    assert.ok(is.array(resp.members));
                    assert.ok(is.true(resp.members.some(member => member.user_id == USER_ID_BOT_1)));
                });
            });
        });

        describe('#addMembers', function addMembersSuite() {
            it('should be return success', function test() {
                bot_1.removeMember(CHAT_ID_1, USER_ID_BOT_3);
                return bot_1.addMembers(CHAT_ID_1, {user_ids: [USER_ID_BOT_3]}).then(resp => {
                    assert.ok(is.object(resp));
                    assert.ok(is.true(resp.success));
                });
            });
        });

        describe('#removeMember', function removeMemberSuite() {
            it('should be return success', function test() {
                bot_1.addMembers(CHAT_ID_1, {user_ids: [USER_ID_BOT_2]});
                return bot_1.removeMember(CHAT_ID_1, USER_ID_BOT_2).then(resp => {
                    assert.ok(is.object(resp));
                    assert.ok(is.true(resp.success));
                });
            });
        });
    });

    describe('#messages', function messages() {
        describe('#getMessages', function getMessages() {
            let msg = 'Test #getMessages #' + utils.randomInteger() ;
            it('should send test message \"' + msg + '\"', function test() {
                bot_1.sendMessage(undefined, CHAT_ID_1, undefined, {text: msg});
                return bot_1.getMessages(CHAT_ID_1).then(resp => {
                    assert.ok(is.object(resp));
                    assert.equal(resp.messages[0].body.text, msg);
                });
            });
        });

        describe('#editMessage', function editMessage() {
            let msg = 'Test #editMessage #' + utils.randomInteger();
            it('should send test message and  edit it', function test() {
                bot_1
                    .sendMessage(undefined, CHAT_ID_1, undefined, {text: msg})
                    .then(respSendMessage => {
                        let editedMessage = msg + 'edit ' + utils.randomInteger();
                        let midEditMessage = respSendMessage.message.body.mid;
                        return bot_1
                            .editMessage(midEditMessage, {text: editedMessage})
                            .then(respEditMessage => {
                                assert.ok(is.object(respEditMessage));
                                assert.ok(is.true(respEditMessage.success));
                                bot_1.getMessageById(midEditMessage).then(respGetMessageById => {
                                    assert.ok(is.object(respGetMessageById));
                                    assert.equal(respGetMessageById.body.text, editedMessage);
                                });
                            });
                    });
            });
        });

        describe('#deleteMessage', function deleteMessage() {
            let msg = 'Test #deleteMessage #' + utils.randomInteger();
            it('delete', function test() {
                bot_1
                    .sendMessage(undefined, CHAT_ID_1, undefined, {text: msg})
                    .then(respSendMessage => {
                        let midEditMessage = respSendMessage.message.body.mid;
                        bot_1.deleteMessage(midEditMessage).then(respDeleteMessage => {
                            assert.ok(is.object(respDeleteMessage));
                            assert.ok(is.true(respDeleteMessage.success));
                            bot_1.getMessageById(midEditMessage).catch(respGetMessageById => {
                                assert.ok(is.object(respGetMessageById));
                                assert.ok(is.equal(respGetMessageById.code, 'not.found'));
                                assert.ok(is.equal(respGetMessageById.message, 'Message ' + midEditMessage + ' not found'));
                            });
                        });
                    });
            });
        });
    });

    describe('#subscriptions', function subscriptions() {
        const url_1 = 'http://test1.botapi.ok';
        const url_2 = 'http://test2.botapi.ok';
        before(function () {
            bot_1.subscribe({url: url_1});
            bot_1.subscribe({url: url_2});
        });
        describe('#getSubscriptions', function getSubscriptionsSuite() {
            it('should returns list of all subscriptions', function test() {
                return bot_1.getSubscriptions().then( resp => {
                    assert.ok(is.object(resp));
                    assert.ok(is.equal(utils.isSubscribeOnUrl(resp, url_1), true));
                });
            });
        });
        describe('#unsubscribe', function unsubscribeSuite() {
            it('should returns boolean', function test() {
                return bot_1.unsubscribe(url_2).then( resp => {
                    assert.ok(is.object(resp));
                    assert.ok(is.equal(resp.success, true));
                });
            });
        });

    });

    describe('#upload', function upload() {
        describe('#getUploadUrl', function getUploadUrlSuite() {
            const types = ['photo', 'video', 'audio', 'file'];
            types.forEach(function (type) {
                it('should return url', function test() {
                    return bot_1.getUploadUrl(type).then(resp => {
                        assert.ok(is.object(resp));
                        assert.ok(!is.undefined(resp.url));
                    });
                });
            });
        });
    });

    describe('#unit test', function unitTest() {
        let longPollingUpdate = '{"updates":[{"message":{"body":{"text":"Test message longPolling"}},"update_type":"message_created"}]}';
        let webhookUpdate = '{"message":{"body":{"text":"Test message webHook"}},"update_type":"message_callback"}';

        let longPollingUpdateNotArray = '{"updates":{"message":{"body":{"text":"Test message longPolling"}},"update_type":"message_created"}}';
        let longPollingUpdateWithoutUpdateType = '{"updates":[{"message":{"body":{"text":"Test message longPolling"}}}]}';
        let longPollingUpdateTypeIsNotSupported = '{"updates":[{"message":{"body":{"text":"Test message longPolling"}},"update_type":"message"}]}';

        let webhookUpdateWithoutUpdateType = '{"message":{"body":{"text":"Test message webHook"}}}';
        let webhookUpdateTypeIsNotSupported = '{"message":{"body":{"text":"Test message webHook"}},"update_type":"message"}';

        describe('#polling method positive test', function test() {
            it('should expected true', function test() {
                bot_1.longPollingUpdateTypeHandler(JSON.parse(longPollingUpdate));
                bot_1.on('message_created', updates => {
                    assert.ok(is.equal(updates.message.body.text, 'Test message longPolling'));
                });
            });
        });
        describe('#polling method negative test, not array', function test() {
            it('should expected true', function test() {
                assert.throws(() => bot_1.longPollingUpdateTypeHandler(JSON.parse(longPollingUpdateNotArray)), Error,'');
            });
        });
        describe('#polling method negative test, without update_type', function test() {
            it('should expected true', function test() {
                assert.throws(() => bot_1.longPollingUpdateTypeHandler(JSON.parse(longPollingUpdateWithoutUpdateType)), Error,'');
            });
        });
        describe('#polling method negative test, update_type is not supported', function test() {
            it('should expected true', function test() {
                assert.throws(() => bot_1.longPollingUpdateTypeHandler(JSON.parse(longPollingUpdateTypeIsNotSupported)), Error,'');
            });
        });

        describe('#webhook method test', function test() {
            it('should  expected true', function test() {
                bot_1.webhookUpdateTypeHandler(JSON.parse(webhookUpdate));
                bot_1.on('message_callback', updates => {
                    assert.ok(is.equal(updates.message.body.text, 'Test message webHook'));
                });
            });
        });
        describe('#webhook method negative test, without update_type', function test() {
            it('should expected true', function test() {
                assert.throws(() => bot_1.webhookUpdateTypeHandler(JSON.parse(webhookUpdateWithoutUpdateType)), Error,'');
            });
        });
        describe('#webhook method negative test, update_type is not supported', function test() {
            it('should expected true', function test() {
                assert.throws(() => bot_1.webhookUpdateTypeHandler(JSON.parse(webhookUpdateTypeIsNotSupported)), Error,'');
            });
        });

        describe('', function test() {
            it('should ', function () {

            });
        });
    });
});