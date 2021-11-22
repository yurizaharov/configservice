const passfather = require('passfather');

const functions = {

    symbolsGen (len) {
        let result = '';
        let symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        for (let i = 0; i < len; i++){
            result += symbols.charAt(Math.floor(Math.random() * symbols.length));
        }
        return result;
    },

    passwordGen (len) {
        const result = passfather({
            symbols: false,
            length: len
        });
        return result;
    },

    userGen (name) {
        let user = ('c##' + name + 'user').slice(0,10);
        return user
    },

    passGen () {
        let part1 = functions.symbolsGen(1);
        let part2 = functions.passwordGen(11);
        return part1 + part2;
    },

}

module.exports = functions;
