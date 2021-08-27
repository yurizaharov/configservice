const functions = require('../loyalty/functions')
const queries = require('../loyalty/queries')

// Setting variables
connectString = process.env.connectString || '192.168.4.248:1521/BONUS'
databasePlacement = process.env.databasePlacement || 'db3'

module.exports = {

    newpartner: async function (type, name, colorPrimary, colorAccent) {
        let partner = {};
        let currentDate = new Date().toLocaleString('ru-RU');
        let lastId = await queries.getlastid(type);
        let user = functions.usergen(name);
        let password = functions.passgen(lastId);
        let procPassword = functions.passgen();
        partner.loyalty_id = lastId + 1;
        partner.type = type;
        partner.name = name;
        partner.description = null;
        partner.subscription = true;
        partner.stage = 'new';
        partner.inProd = false;
        partner.database = {};
        partner.database.user = user;
        partner.database.password = password;
        partner.database.connectString = connectString;
        partner.database.placement = databasePlacement;
        partner.dns = {};
        partner.dns.domain = 'bms.group';
        partner.dns.subdomain = 'srv';
        partner.dns.name = name;
        partner.bps = {};
        partner.bps.context = 'bps-' + name;
        partner.bps.token = procPassword;
        partner.bps.subdomain = 'srv';
        partner.cards = {};
        if (partner.type === 'loyalty30') {
            partner.cards.min = String(8000100600000000 + partner.loyalty_id*100000);
            partner.cards.max = String(8000100600099999 + partner.loyalty_id*100000);
        }
        if (partner.type === 'regular') {
            partner.cards.min = String(8000081600000000 + partner.loyalty_id*1000000);
            partner.cards.max = String(8000081600999999 + partner.loyalty_id*1000000);
        }
        partner.mobile = {};
        partner.mobile.context =  'mobile-' + name;
        partner.mobile.token = procPassword;
        partner.mobile.subdomain = 'srv';
        partner.beniobms = {};
        partner.beniobms.token = functions.passgen();
        partner.beniobms.subdomain = 'adb';
        return await queries.savepartner(name, partner, currentDate);
    },

    getnewpartner: async function () {
        return await queries.getnewpartner();
    },

    getallnames: async function () {
        let allData = [];
        let allNames = [];
        allData = await queries.getall();
        for (let k = 0; k < allData.length; k++) {
            if (allData[k].dns) {
                allNames[k*2] = allData[k].dns.name;
            }
            if (allData[k].name) {
                allNames[k*2+1] = allData[k].name;
            }
        }
        return {
            "code": "0",
            "status": "success",
            "names": allNames
        };
    },

    updateStage: async function (name, stage) {
        let [ code, status ] = [ 1, "error" ];
        let result = await queries.updateStage(name, stage);
        if (result.name === name) {
            code = 0;
            status = "success";
        }
        return {
            "code": code,
            "status": status
        };

    },


    }