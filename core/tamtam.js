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
    GET_ALL_CHATS: 'getAllChats',
    GET_CHAT_BY_LINK: 'getChatByLink',
    GET_CHAT: 'getChat',
    EDIT_CHAT: 'editChat',
    SEND_ACTION: 'sendAction',
    PIN_MESSAGE: 'pinMessage',
    UNPIN_MESSAGE: 'unpinMessage',
    GET_PINNED_MESSAGE: 'getPinnedMessage',
    GET_MEMBERSHIP: 'getMembership',
    LEAVE_CHAT: 'leaveChat',
    GET_ADMINS: 'getAdmins',
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
    GET_MESSAGE_BY_ID: 'getMessageById',
    ANSWER_ON_CALLBACK: 'answerOnCallback',
    CONSTRUCTS_MESSAGE: 'constructsMessage',
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
    'chat_title_changed',
    'message_construction_request',
    'message_constructed',
    'message_chat_created'
];

const _uploadTypes = [
    'photo', 'video', 'audio', 'file'
];

class TamTamBot extends EventEmitter {

    constructor(configs, options = {}) {
        super();
        this.token = configs.token;
        this.version = configs.version;
        this.options = options;
        this.options.baseApiUrl = configs.host;
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
     * @param {String} _chatLink
     * @param {String} _messageId
     * @private
     */
    _methodBuilder(methodName,
                   _chatId = undefined,
                   _chatLink = undefined,
                   _messageId = undefined)
    {
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
            case _methods.GET_CHAT_BY_LINK:
                builder.verbs = 'GET';
                builder.url = `${this.options.baseApiUrl}/chats/${_chatLink}`;
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
            case _methods.GET_PINNED_MESSAGE:
                builder.verbs = 'GET';
                builder.url = `${this.options.baseApiUrl}/chats/${_chatId}/pin`;
                break;
            case _methods.PIN_MESSAGE:
                builder.verbs = 'PUT';
                builder.url = `${this.options.baseApiUrl}/chats/${_chatId}/pin`;
                break;
            case _methods.UNPIN_MESSAGE:
                builder.verbs = 'DELETE';
                builder.url = `${this.options.baseApiUrl}/chats/${_chatId}/pin`;
                break;
            case _methods.GET_MEMBERSHIP:
                builder.verbs = 'GET';
                builder.url = `${this.options.baseApiUrl}/chats/${_chatId}/members/me`;
                break;
            case _methods.LEAVE_CHAT:
                builder.verbs = 'DELETE';
                builder.url = `${this.options.baseApiUrl}/chats/${_chatId}/members/me`;
                break;
            case _methods.GET_ADMINS:
                builder.verbs = 'GET';
                builder.url = `${this.options.baseApiUrl}/chats/${_chatId}/members/admins`;
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
            case _methods.GET_MESSAGE_BY_ID:
                builder.verbs = 'GET';
                builder.url = `${this.options.baseApiUrl}/messages/${_messageId}`;
                break;
            case _methods.ANSWER_ON_CALLBACK:
                builder.verbs = 'POST';
                builder.url = `${this.options.baseApiUrl}/answers`;
                break;
            case _methods.CONSTRUCTS_MESSAGE:
                builder.verbs = 'POST';
                builder.url = `${this.options.baseApiUrl}/answers/constructor`;
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
            case _methods.GET_UPLOAD_URL:
                builder.verbs = 'POST';
                builder.url = `${this.options.baseApiUrl}/uploads`;
                break;
            default:
                throw new Error('Undefined method name');
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
        qs.from = form.from;
        qs.to = form.to;
        qs.count = form.count;
        qs.marker = form.marker;
        qs.message_id = form.message_id;
        qs.message_ids = form.message_ids;
        qs.callback_id = form.callback_id;
        qs.user_ids = form.user_ids;
        qs.url = form.url;
        qs.limit = form.limit;
        qs.timeout = form.timeout;
        qs.types = form.types;
        qs.type = form.type;
        qs.disable_link_preview = form.disable_link_preview;
        qs.session_id = form.session_id;
        qs.block = form.block;
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
    static _request(parameters = {}) {
        const options = {};
        options.method = parameters.form.method.verbs;
        options.url = parameters.form.method.url;
        options.qs = parameters.form.query;
        options.body = JSON.stringify(parameters.form.body);
        return request(null, options)
            .then(response => {
                try{
                    return JSON.parse(response);
                } catch(e) {
                    throw response;
                }
            })
            .catch(error_response => {
                throw JSON.parse(error_response.error);
            });
    }

    /**
     *
     * @param {Object} update
     */
    webhookUpdateTypeHandler(update = {}) {
        if (update.update_type !== undefined) {
            if (_updateTypes.includes(update.update_type)) {
                this.emit(update.update_type, update);
            } else {
                throw new Error('Can not find parameter \'' + update.update_type + '\' among the supported');
            }
        } else {
            throw new Error('Can not find parameter \'update_type\' in response body');
        }
    }

    /**
     *
     * @param {Object} update
     */
    longPollingUpdateTypeHandler(update = {}) {
        if (update.updates instanceof Array) {
            update.updates.forEach(function (updatesElement) {
                if (updatesElement.update_type !== undefined) {
                    if (_updateTypes.includes(updatesElement.update_type)) {
                        this.emit(updatesElement.update_type, updatesElement);
                    }  else {
                        throw new Error('Can not find parameter \'' + update.update_type + '\' among the supported');
                    }
                } else {
                    throw new Error('Can not find parameter \'update_type\' in response body');
                }
            }, this);
        } else {
            throw new Error('\'updates\' is not instanceof Array');
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
        return TamTamBot._request({form});
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
        form.method = this._methodBuilder(_methods.EDIT_MY_INFO,undefined,undefined);
        form.query = this._buildQuery(form);
        return TamTamBot._request({form});
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
        return TamTamBot._request({form});
    }

    /**
     * Get chat by link
     * Returns chat/channel information by its public link or dialog with user by username
     * https://dev.tamtam.chat/#operation/getChatByLink
     *
     * @param {String} chatLink
     * @param form
     * @returns {request.Request}
     */
    getChatByLink(chatLink, form = {}) {
        form.method = this._methodBuilder(_methods.GET_CHAT_BY_LINK, undefined, chatLink);
        form.query = this._buildQuery(form);
        return TamTamBot._request({form});
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
        form.method = this._methodBuilder(_methods.GET_CHAT, chatId, undefined);
        form.query = this._buildQuery(form);
        return TamTamBot._request({form});
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
        form.method = this._methodBuilder(_methods.EDIT_CHAT, chatId, undefined);
        form.query = this._buildQuery(form);
        return TamTamBot._request({form});
    }

    /**
     * Send action
     * Send bot action to chat
     * https://dev.tamtam.chat/#operation/sendAction
     *
     * @param {Number} chatId
     * @param {Object} body
     * @param form
     * @returns {request.Request}
     */
    sendAction(chatId, body, form = {}) {
        form.body = body;
        form.method = this._methodBuilder(_methods.SEND_ACTION, chatId, undefined);
        form.query = this._buildQuery(form);
        return TamTamBot._request({form});
    }

    /**
     * Get pinned message
     * Get pinned message in chat or channel.
     * https://dev.tamtam.chat/#operation/getPinnedMessage
     *
     * @param {Number} chatId  
     * @param form
     * @returns {request.Request}
     */
    getPinnedMessage(chatId, form = {}) {
        form.method = this._methodBuilder(_methods.GET_PINNED_MESSAGE, chatId, undefined);
        form.query = this._buildQuery(form);
        return TamTamBot._request({form});
    }

    /**
     * Pin message
     * Pins message in chat or channel.
     * https://dev.tamtam.chat/#operation/pinMessage
     *
     * @param {Number} chatId 
     * @param {Object} body
     * @param form
     * @returns {request.Request}
     */
    pinMessage(chatId, body, form = {}) {
        form.body = body;
        form.method = this._methodBuilder(_methods.PIN_MESSAGE, chatId, undefined);
        form.query = this._buildQuery(form);
        return TamTamBot._request({form});
    }

    /**
     * Unpin message
     * Unpins message in chat or channel.
     * https://dev.tamtam.chat/#operation/unpinMessage
     *
     * @param {Number} chatId  
     * @param form
     * @returns {request.Request}
     */
    unpinMessage(chatId, form = {}) {
        form.method = this._methodBuilder(_methods.UNPIN_MESSAGE, chatId, undefined);
        form.query = this._buildQuery(form);
        return TamTamBot._request({form});
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
        form.method = this._methodBuilder(_methods.GET_MEMBERSHIP, chatId, undefined);
        form.query = this._buildQuery(form);
        return TamTamBot._request({form});
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
        form.method = this._methodBuilder(_methods.LEAVE_CHAT, chatId, undefined);
        form.query = this._buildQuery(form);
        return TamTamBot._request({form});
    }

    /**
     * Get chat admins
     * https://dev.tamtam.chat/#operation/getAdmins
     * @param {Number} chatId
     * @param form
     * @returns {request.Request}
     */
    getAdmins(chatId, form = {}) {
        form.method = this._methodBuilder(_methods.GET_ADMINS, chatId, undefined);
        form.query = this._buildQuery(form);
        return TamTamBot._request({form});
    }

    /**
     * Get members
     * Returns users participated in chat.
     * https://dev.tamtam.chat/#operation/getMembers
     *
     * @param {Number} chatId
     * @param {Array} userIds
     * @param {Number} marker
     * @param {Number} count
     * @param form
     * @returns {request.Request}
     */
    getMembers(chatId, userIds, marker, count, form = {}) {
        form.user_ids = userIds;
        form.marker = marker;
        form.count = count;
        form.method = this._methodBuilder(_methods.GET_MEMBERS, chatId, undefined);
        form.query = this._buildQuery(form);
        return TamTamBot._request({form});
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
        form.method = this._methodBuilder(_methods.ADD_MEMBERS, chatId, undefined);
        form.query = this._buildQuery(form);
        return TamTamBot._request({form});
    }

    /**
     * Remove member
     * Removes member from chat. Additional permissions may require.
     * https://dev.tamtam.chat/#operation/removeMember
     *
     * @param {Number} chatId
     * @param {Number} userId
     * @param {Boolean} block
     * @param form
     * @returns {request.Request}
     */
    removeMember(chatId, userId, block, form = {}) {
        form.user_id = userId;
        form.block = block;
        form.method = this._methodBuilder(_methods.REMOVE_MEMBER, chatId, undefined);
        form.query = this._buildQuery(form);
        return TamTamBot._request({form});
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
        return TamTamBot._request({form});
    }

    /**
     * Send message
     * Sends a message to a chat. As a result for this method new message identifier returns.
     * https://dev.tamtam.chat/#operation/sendMessage
     *
     * @param {Number} userId
     * @param {Number} chatId
     * @param {Boolean} disableLinkPreview
     * @param {Object} body
     * @param form
     * @returns {request.Request}
     */
    sendMessage(userId, chatId, disableLinkPreview, body, form = {}) {
        form.user_id = userId;
        form.chat_id = chatId;
        form.disable_link_preview = disableLinkPreview;
        form.body = body;
        form.method = this._methodBuilder(_methods.SEND_MESSAGE, chatId, undefined);
        form.query = this._buildQuery(form);
        return TamTamBot._request({form});
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
        return TamTamBot._request({form});
    }

    /**
     * Delete message
     * Deletes message in a dialog or in a chat if bot has permission to delete messages.
     * https://dev.tamtam.chat/#operation/deleteMessage
     *
     * @param {String} messageId
     * @param form
     * @returns {request.Request}
     */
    deleteMessage(messageId, form = {}) {
        form.message_id = messageId;
        form.method = this._methodBuilder(_methods.DELETE_MESSAGE);
        form.query = this._buildQuery(form);
        return TamTamBot._request({form});
    }

    /**
     * Get message
     * Returns single message by its identifier.
     * https://dev.tamtam.chat/#operation/getMessageById
     *
     * @param messageId
     * @param form
     */
    getMessageById(messageId, form = {}) {
        form.message_id = messageId;
        form.method = this._methodBuilder(_methods.GET_MESSAGE_BY_ID, undefined, undefined, messageId);
        form.query = this._buildQuery(form);
        return TamTamBot._request({form});
    }

    /**
     * Answer on callback
     * This method should be called to send an answer after a user has clicked the button.
     * The answer may be an updated message or/and a one-time user notification.
     * https://dev.tamtam.chat/#operation/answerOnCallback
     *
     * @param {String} callbackId
     * @param {Object} body
     * @param form
     * @returns {request.Request}
     */
    answerOnCallback(callbackId, body, form = {}) {
        form.callback_id = callbackId;
        form.body = body;
        form.method = this._methodBuilder(_methods.ANSWER_ON_CALLBACK);
        form.query = this._buildQuery(form);
        return TamTamBot._request({form});
    }

    /**
     * Construct message
     * Sends answer on construction request.
     * Answer can contain any prepared message and/or keyboard to help user interact with bot.
     * https://dev.tamtam.chat/#operation/construct
     *
     * @param {String} sessionId
     * @param {Object} body
     * @param form
     * @returns {request.Request}
     */
    constructsMessage(sessionId, body, form = {}) {
        form.session_id = sessionId;
        form.body = body;
        form.method = this._methodBuilder(_methods.CONSTRUCTS_MESSAGE);
        form.query = this._buildQuery(form);
        return TamTamBot._request({form});
    }

    /**
     * Get subscriptions
     * In case your bot gets data via WebHook, the method returns list of all subscriptions.
     * https://dev.tamtam.chat/#operation/getSubscriptions
     *
     * @param form
     * @returns {request.Request}
     */
    getSubscriptions(form = {}) {
        form.method = this._methodBuilder(_methods.GET_SUBSCRIPTIONS);
        form.query = this._buildQuery(form);
        return TamTamBot._request({form});
    }

    /**
     * Subscribe
     * Subscribes bot to receive updates via WebHook.
     * After calling this method, the bot will receive notifications about new events in chat rooms at the specified URL
     * https://dev.tamtam.chat/#operation/subscribe
     *
     * @param {Object} body
     * @param form
     * @returns {request.Request}
     */
    subscribe(body, form = {}) {
        form.body = body;
        form.query = this._buildQuery(form);
        form.method = this._methodBuilder(_methods.SUBSCRIBE);
        return TamTamBot._request({form});
    }

    /**
     * Unsubscribe
     * Unsubscribes bot from receiving updates via WebHook.
     * After calling the method, the bot stops receiving notifications about new events.
     * Notification via the long-poll API becomes available for the bot
     * https://dev.tamtam.chat/#operation/unsubscribe
     *
     * @param {String} url
     * @param form
     */
    unsubscribe(url, form = {}) {
        form.url = url;
        form.query = this._buildQuery(form);
        form.method = this._methodBuilder(_methods.UNSUBSCRIBE);
        return TamTamBot._request({form});
    }

    /**
     * Get updates
     * You can use this method for getting updates in case your bot is not subscribed to WebHook.
     * The method based on long polling.
     * https://dev.tamtam.chat/#operation/getUpdates
     *
     * @param {Number} limit
     * @param {Number} timeout
     * @param {Number} marker
     * @param {Array} types
     * @param form
     */
    getUpdates(limit, timeout, marker, types, form = {}) {
        form.limit = limit;
        form.timeout = timeout;
        form.marker = marker;
        form.types = types;
        form.query = this._buildQuery(form);
        form.method = this._methodBuilder(_methods.GET_UPDATES);
        return TamTamBot._request({form});
    }

    /**
     * Get upload URL
     * Returns the URL for the subsequent file upload.
     * https://dev.tamtam.chat/#operation/getUploadUrl
     *
     * @param {String} type
     * @param form
     */
    getUploadUrl(type, form = {}) {
        if (type !== undefined && _uploadTypes.includes(type)) {
            form.type = type;
            form.query = this._buildQuery(form);
            form.method = this._methodBuilder(_methods.GET_UPLOAD_URL);
            return TamTamBot._request({form});
        } else {
            throw new Error('Invalid parameter \`type\`. Should be one of: [photo,video,audio,file]');
        }
    }
}

module.exports = TamTamBot;