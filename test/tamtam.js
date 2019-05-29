const TamTamBotApi = require('..');
const assert = require('assert');
const is = require('is');

const TOKEN = 'wzkaE8SrN9Nmu9I-CdSfGjnwxAdKO2CYVv8PfTGvodc';

if (!TOKEN) {
    throw new Error('Bot token not provided');
}

describe('TamTamBotAPI', function tamtamSuite() {
    let bot;

    before(function beforeAll() {
        bot = new TamTamBotApi(TOKEN);
    });

    describe('#getMyInfo', function getMyInfoSuite() {
        it('should return object with current bot info', function test() {
            return bot.getMyInfo().then(resp => {
                resp = JSON.parse(resp);
                assert.ok(is.object(resp));
                assert.ok(is.number(resp.user_id));
                assert.ok(is.string(resp.name));
            });
        });
    });
});
