const passfather = require('passfather');

const functions = {

    async getDefaults () {
        return {
            "dns" : {
                "domain" : "bms.group",
                "subdomain" : "srv"
            },
            "beniobms" : {
                "subdomain": "adb"
            }
        }
    },

    symbolsgen (len) {
        let result = '';
        let symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        for (let i = 0; i < len; i++){
            result += symbols.charAt(Math.floor(Math.random() * symbols.length));
        }
        return result;
    },

    passwordgen (len) {
        const result = passfather({
            symbols: false,
            length: len
        });
        return result;
    },

    usergen (name) {
        let user = ('c##' + name + 'user').slice(0,10);
        return user
    },

    passgen () {
        let part1 = functions.symbolsgen(1);
        let part2 = functions.passwordgen(11);
        return part1 + part2;
    },

}

module.exports = functions;
