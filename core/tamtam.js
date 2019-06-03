require('dotenv').config();
const EventEmitter = require('eventemitter3');
const request = require('request-promise');

const _methods = {
    /**
     * bots
     */
    GET_MY_INFO: 'getMyInfo',
    EDIT_MY_INFO: 'editMyInfo',
    /**
     * chats
     */
    GET_ALL_CHATS: 'getAllMessage',
    GET_CHAT: 'getChat',
    EDIT_CHAT: 'editChat',
    SEND_ACTION: 'sendAction',
    GET_MEMERSHIP: 'getMembership',
    LEAVE_CHAT: 'leaveChat',
    GET_MEMBERS: 'getMembers',
    ADD_MEMBERS: 'addMembers',
    REMOVE_MEMBER: 'removeMember',
    /**
     * messages
     */
    GET_MESSAGES: 'getMessages',
    SEND_MESSAGE: 'sendMessage',
    EDIT_MESSAGE: 'editMessage',
    DELETE_MESSAGE: 'deleteMessage',
    ANSWER_ON_CALLBACK: 'answerOnCallback',
    /**
     * subscriptions
     */
    GET_SUBSCRIPTIONS: 'getSubscriptions',
    SUBSCRIBE: 'subscribe',
    UNSUBSCRIBE: 'unsubscribe',
    GET_UPDATES: 'getUpdates',
    /**
     * upload
     */
    GET_UPLOAD_URL: 'getUploadUrl'
};

const _updateTypes = [
    'message_callback',
    'message_created',
    'message_removed',
    'message_edited',
    'bot_added',
    'bot_removed',
    'user_added',
    'user_removed',
    'bot_started',
    'chat_title_changed'
];

class TamTamBot extends EventEmitter {

    constructor(token, options = {}) {
        super();
        this.token = token;
        this.version = '0.1.6';
        this.options = options;
        this.options.baseApiUrl = 'https://botapi.tamtam.chat';
    }

    /**
     *
     * @param event
     * @param listener
     */
    on(event, listener) {
        super.on(event, listener);
    }

    /**
     *
     * @param {String} methodName
     * @param {Number} _chatId
     * @private
     */
    _methodBuilder(methodName, _chatId) {
        const builder = {};
        switch (methodName) {
            case _methods.GET_MY_INFO:
                builder.verbs = 'GET';
                builder.url = `${this.options.baseApiUrl}/me`;
                break;
            case _methods.EDIT_MY_INFO:
                builder.verbs = 'PATCH';
                builder.url = `${this.options.baseApiUrl}/me`;
                break;
            case _methods.GET_ALL_CHATS:
                builder.verbs = 'GET';
                builder.url = `${this.options.baseApiUrl}/chats`;
                break;
            case _methods.GET_CHAT:
                builder.verbs = 'GET';
                builder.url = `${this.options.baseApiUrl}/chats/${_chatId}`;
                break;
            case _methods.EDIT_CHAT:
                builder.verbs = 'PATCH';
                builder.url = `${this.options.baseApiUrl}/chats/${_chatId}`;
                break;
            case _methods.SEND_ACTION:
                builder.verbs = 'POST';
                builder.url = `${this.options.baseApiUrl}/chats/${_chatId}/actions`;
                break;
            case _methods.GET_MEMERSHIP:
                builder.verbs = 'GET';
                builder.url = `${this.options.baseApiUrl}/chats/${_chatId}/members/me`;
                break;
            case _methods.LEAVE_CHAT:
                builder.verbs = 'DELETE';
                builder.url = `${this.options.baseApiUrl}/chats/${_chatId}/members/me`;
                break;
            case _methods.GET_MEMBERS:
                builder.verbs = 'GET';
                builder.url = `${this.options.baseApiUrl}/chats/${_chatId}/members`;
                break;
            case _methods.ADD_MEMBERS:
                builder.verbs = 'POST';
                builder.url = `${this.options.baseApiUrl}/chats/${_chatId}/members`;
                break;
            case _methods.REMOVE_MEMBER:
                builder.verbs = 'DELETE';
                builder.url = `${this.options.baseApiUrl}/chats/${_chatId}/members`;
                break;
            case _methods.GET_MESSAGES:
                builder.verbs = 'GET';
                builder.url = `${this.options.baseApiUrl}/messages`;
                break;
            case _methods.SEND_MESSAGE:
                builder.verbs = 'POST';
                builder.url = `${this.options.baseApiUrl}/messages`;
                break;
            case _methods.EDIT_MESSAGE:
                builder.verbs = 'PUT';
                builder.url = `${this.options.baseApiUrl}/messages`;
                break;
            case _methods.DELETE_MESSAGE:
                builder.verbs = 'DELETE';
                builder.url = `${this.options.baseApiUrl}/messages`;
                break;
            case _methods.ANSWER_ON_CALLBACK:
                builder.verbs = 'POST';
                builder.url = `${this.options.baseApiUrl}/answers`;
                break;
            case _methods.GET_SUBSCRIPTIONS:
                builder.verbs = 'GET';
                builder.url = `${this.options.baseApiUrl}/subscriptions`;
                break;
            case _methods.SUBSCRIBE:
                builder.verbs = 'POST';
                builder.url = `${this.options.baseApiUrl}/subscriptions`;
                break;
            case _methods.UNSUBSCRIBE:
                builder.verbs = 'DELETE';
                builder.url = `${this.options.baseApiUrl}/subscriptions`;
                break;
            case _methods.GET_UPDATES:
                builder.verbs = 'GET';
                builder.url = `${this.options.baseApiUrl}/updates`;
                break;
            default:
                throw new Error('Undefined method name')
        }
        return builder;
    }

    /**
     *
     * @param form
     * @private
     */
    _buildQuery(form = {}) {
        const qs = {};
        qs.chat_id = form.chat_id;
        qs.user_id = form.user_id;
        qs.message_ids = form.message_ids;
        qs.from = form.from;
        qs.to = form.to;
        qs.count = form.count;
        qs.marker = form.marker;
        qs.message_id = form.message_id;
        qs.message_ids = form.message_ids;
        qs.user_ids = form.user_ids;
        qs.access_token = this.token;
        qs.v = this.version;
        return qs;
    }

    /**
     *
     * @param parameters
     * @returns {request.Request}
     * @private
     */
    _request(parameters = {}) {
        const options = {};
        options.method = parameters.form.method.verbs;
        options.url = parameters.form.method.url;
        options.qs = parameters.form.query;
        options.body = JSON.stringify(parameters.form.body);
        return request(null, options, function (error, response, body) {
            // if (response.statusCode !== 200) {
            //     // console.log('Response statusCode:', response.statusCode);
            //     // console.log('Response body:', body);
            // }
        })
    }

    /**
     *
     * @param {Object} update
     */
    webhookUpdateTypeHandler(update) {
        if (update.update_type === !undefined) {
            if (TamTamBot._checkUpdateType(update)) {
                this.emit(update.update_type, update);
            }
        } else {
            throw new Error('Can not find parameter \'update_type\' in response body')
        }
    }

    /**
     *
     * @param {Object} update
     */
    longPollingUpdateTypeHandler(update) {
        if ((update.updates === !undefined) || !update.updates.isArray()) {
            let updates = update.updates;
            updates.forEach(function (updatesElement) {
                if (TamTamBot._checkUpdateType(updatesElement)) {
                    this.emit(updatesElement.update_type, update)
                }
            });
        } else {
            throw new Error('Can not find parameter \'updates\' in response body')
        }
    }

    /**
     *
     * @param {Object} update
     * @private
     */
    static _checkUpdateType(update) {
        let receivedUpdateType = update.update_type;
        if (_updateTypes.find(receivedUpdateType) === -1) {
            throw new Error('Expected value ' + update.update_type + ' of \'update_type\' not found')
        } else {
            return true;
        }
    }

    /**
     * Get current bot info
     * Returns info about current bot. Current bot can be identified by access token.
     * Method returns bot identifier, name and avatar (if any).
     * https://dev.tamtam.chat/#operation/getMyInfo
     *
     * @param form
     * @returns {request.Request}
     */
    getMyInfo(form = {}) {
        form.method = this._methodBuilder(_methods.GET_MY_INFO);
        form.query = this._buildQuery(form);
        return this._request({form});
    }

    /**
     * Edit current bot info
     * Edits current bot info. Fill only the fields you want to update. All remaning fields will stay untouched.
     * https://dev.tamtam.chat/#operation/editMyInfo
     *
     * @param {Object} body
     * @param form
     * @returns {request.Request}
     */
    editMyInfo(body, form = {}) {
        form.body = body;
        form.method = this._methodBuilder(_methods.EDIT_MY_INFO);
        form.query = this._buildQuery(form);
        return this._request({form});
    }

    /**
     * Get all chats
     * Returns information about chats that bot participated in: a result list and marker points to the next page.
     * https://dev.tamtam.chat/#operation/getChats
     *
     * @param {Number} count
     * @param {Number} marker
     * @param form
     * @returns {request.Request}
     */
    getAllChats(count, marker, form = {}) {
        form.count = count;
        form.marker = marker;
        form.method = this._methodBuilder(_methods.GET_ALL_CHATS);
        form.query = this._buildQuery(form);
        return this._request({form})
    }

    /**
     * Get chat
     * Returns info about chat.
     * https://dev.tamtam.chat/#operation/getChat
     *
     * @param {Number} chatId
     * @param form
     * @returns {request.Request}
     */
    getChat(chatId, form = {}) {
        form.method = this._methodBuilder(_methods.GET_CHAT, chatId);
        form.query = this._buildQuery(form);
        return this._request({form})
    }

    /**
     * Edit chat info
     * Edits chat info: title, icon, etc…
     * https://dev.tamtam.chat/#operation/editChat
     *
     * @param {Number} chatId
     * @param {Object} body
     * @param form
     * @returns {request.Request}
     */
    editChat(chatId, body, form = {}) {
        form.body = body;
        form.method = this._methodBuilder(_methods.EDIT_CHAT, chatId);
        form.query = this._buildQuery(form);
        return this._request({form})
    }

    /**
     * Send action
     * https://dev.tamtam.chat/#operation/sendAction
     *
     * @param {Number} chatId
     * @param {Object} body
     * @param form
     * @returns {request.Request}
     */
    sendAction(chatId, body, form = {}) {
        form.body = body;
        form.method = this._methodBuilder(_methods.SEND_ACTION, chatId);
        form.query = this._buildQuery(form);
        return this._request({form})
    }

    /**
     * Get chat membership
     * Returns chat membership info for current bot
     * https://dev.tamtam.chat/#operation/getMembership
     *
     * @param {Number} chatId
     * @param form
     * @returns {request.Request}
     */
    getMembership(chatId, form = {}) {
        form.method = this._methodBuilder(_methods.GET_MEMERSHIP, chatId);
        form.query = this._buildQuery(form);
        return this._request({form})
    }

    /**
     * Leave chat
     * Removes bot from chat members.
     * https://dev.tamtam.chat/#operation/leaveChat
     *
     * @param {Number} chatId
     * @param form
     * @returns {request.Request}
     */
    leaveChat(chatId, form = {}) {
        form.method = this._methodBuilder(_methods.LEAVE_CHAT, chatId);
        form.query = this._buildQuery(form);
        return this._request({form})
    }

    /**
     * Get members
     * https://dev.tamtam.chat/#operation/getMembers
     *
     * @param {Number} chatId
     * @param {Number} userIds
     * @param {Number} marker
     * @param {Number} count
     * @param form
     * @returns {request.Request}
     */
    getMembers(chatId, userIds, marker, count, form = {}) {
        form.user_ids = userIds;
        form.marker = marker;
        form.count = count;
        form.method = this._methodBuilder(_methods.GET_MEMBERS, chatId);
        form.query = this._buildQuery(form);
        return this._request({form})
    }

    /**
     * Add members
     * Adds members to chat. Additional permissions may require.
     * https://dev.tamtam.chat/#operation/addMembers
     *
     * @param {Number} chatId
     * @param {Object} body
     * @param form
     * @returns {request.Request}
     */
    addMembers(chatId, body, form = {}) {
        form.body = body;
        form.method = this._methodBuilder(_methods.ADD_MEMBERS, chatId);
        form.query = this._buildQuery(form);
        return this._request({form})
    }

    /**
     * Remove member
     * Removes member from chat. Additional permissions may require.
     * https://dev.tamtam.chat/#operation/removeMember
     *
     * @param chatId
     * @param userId
     * @param form
     * @returns {request.Request}
     */
    removeMember(chatId, userId, form = {}) {
        form.user_id = userId;
        form.method = this._methodBuilder(_methods.REMOVE_MEMBER, chatId);
        form.query = this._buildQuery(form);
        return this._request({form})
    }

    /**
     * Get messages
     * Returns messages in chat: result page and marker referencing to the next page.
     * Messages traversed in reverse direction so the latest message in chat will be first in result array.
     * Therefore if you use from and to parameters, to must be less than from
     * https://dev.tamtam.chat/#operation/getMessages
     *
     * @param {Number} chatId
     * @param {Number} messageIds
     * @param {Number} from
     * @param {Number} to
     * @param {Number} count
     * @param form
     * @returns {request.Request}
     */
    getMessages(chatId, messageIds, from, to, count, form = {}) {
        form.chat_id = chatId;
        form.message_ids = messageIds;
        form.from = from;
        form.to = to;
        form.count = count;
        form.method = this._methodBuilder(_methods.GET_MESSAGES);
        form.query = this._buildQuery(form);
        return this._request({form})
    }

    /**
     * Send message
     * Sends a message to a chat. As a result for this method new message identifier returns.
     * https://dev.tamtam.chat/#operation/sendMessage
     *
     * @param {Number} userId
     * @param {Number} chatId
     * @param {Object} body
     * @param form
     * @returns {request.Request}
     */
    sendMessage(userId, chatId, body, form = {}) {
        form.user_id = userId;
        form.chat_id = chatId;
        form.body = body;
        form.method = this._methodBuilder(_methods.SEND_MESSAGE, chatId);
        form.query = this._buildQuery(form);
        return this._request({form});
    }

    /**
     * Edit message
     * Updated message should be sent as NewMessageBody in a request body.
     * In case attachments field is null, the current message attachments won’t be changed.
     * In case of sending an empty list in this field, all attachments will be deleted.
     * https://dev.tamtam.chat/#operation/editMessage
     *
     * @param {Number} messageId
     * @param {Object} body
     * @param form
     * @returns {request.Request}
     */
    editMessage(messageId, body, form = {}) {
        form.message_id = messageId;
        form.body = body;
        form.method = this._methodBuilder(_methods.EDIT_MESSAGE);
        form.query = this._buildQuery(form);
        return this._request({form})
    }

    /**
     * Subscribes bot to receive updates via WebHook.
     * After calling this method, the bot will receive notifications about new events in chat rooms at the specified URL
     * https://dev.tamtam.chat/#operation/subscribe
     *
     * @param {String} url
     * @param {Array} updateTypes
     * @param {Number} version
     * @param form
     * @returns {request.Request}
     */
    subscribe(url, updateTypes, version, form = {}) {
        const body = {};
        body.url = url;
        body.update_types = updateTypes;
        body.version = this.version;
        form.body = body;
        form.query = this._buildQuery();
        form.method = this._methodBuilder(_methods.SUBSCRIBE);
        return this._request({form})
    }

}

module.exports = TamTamBot;
