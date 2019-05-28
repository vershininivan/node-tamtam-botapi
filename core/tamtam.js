const TamTamWebHook = require('./webHook');
const EventEmitter = require('eventemitter3');
const request = require('request');

const methods = {
    SEND_MESSAGE: 'sendMessage',
    GET_ALL_CHATS: 'getAllMessage',
    GET_CHAT: 'getChats',
    GET_MESSAGES: 'getMessage'
};

class TamTamBot extends EventEmitter{

    constructor(token, options = {}) {
        super();
        this.token = token;
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
     * @param methodName
     * @param _chatId
     * @private
     */
    _methodBuilder(methodName, _chatId) {
        const builder = {};
        switch (methodName) {
            case methods.SEND_MESSAGE:
                builder.verbs = 'POST';
                builder.url = `${this.options.baseApiUrl}/messages`;
                break;
            case methods.GET_ALL_CHATS:
                builder.verbs = 'GET';
                builder.url = `${this.options.baseApiUrl}/chats`;
                break;
            case methods.GET_CHAT:
                builder.verbs = 'GET';
                builder.url = `${this.options.baseApiUrl}/chats/${_chatId}`;
                break;
            case methods.GET_MESSAGES:
                builder.verbs = 'GET';
                builder.url = `${this.options.baseApiUrl}/messages`;
                break;
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
        qs.access_token = this.token;
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
        return request( null, options, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log('Response statusCode:', response.statusCode);
                console.log('Response body:', body);
            } else {
                console.log('Response ERROR:', error);
                console.log('Response statusCode:', response.statusCode);
                console.log('Response body:', body);
            }
        })
    }

    /**
     *
     * @param update
     */
    updateHandler(update) {

    }

    /**
     *
     * @param userId
     * @param chatId
     * @param body
     * @param form
     * @returns {request.Request}
     */
    sendMessage(userId, chatId, body, form = {}) {
        form.user_id = userId;
        form.chat_id = chatId;
        form.body = body;
        form.method = this._methodBuilder(methods.SEND_MESSAGE, chatId);
        form.query = this._buildQuery(form);
        return this._request({form});
    }

    /**
     *
     * @param count
     * @param marker
     * @param form
     * @returns {request.Request}
     */
    getAllChats(count, marker, form = {}) {
        form.count = count;
        form.marker = marker;
        form.method = this._methodBuilder(methods.GET_ALL_CHATS);
        form.query = this._buildQuery(form);
        return this._request({form})
    }

    /**
     *
     * @param chatId
     * @param messageIds
     * @param from
     * @param to
     * @param count
     * @param form
     * @returns {request.Request}
     */
    getMessages(chatId, messageIds, from, to, count, form = {}) {
        form.chat_id = chatId;
        form.message_ids = messageIds;
        form.from = from;
        form.to = to;
        form.count = count;
        form.query = this._buildQuery(form);
        return this._request(methods.GET_MESSAGES, {form})
    }

}

module.exports = TamTamBot;

