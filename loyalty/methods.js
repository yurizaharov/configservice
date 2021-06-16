const functions = require('../loyalty/functions')
const queries = require('../loyalty/queries')

// Setting variables
connectString = process.env.connectString || '192.168.4.248:1521/BONUS'

module.exports = {

    newpartner: async function (name, colorPrimary, colorAccent) {
        let partner = {};
        let currentDate = new Date().toLocaleString('ru-RU');
        let lastId = await queries.getlastid();
        let user = functions.usergen(name);
        let password = functions.passgen(lastId);
        partner.loyalty_id = lastId + 1;
        partner.type = 'loyalty30';
        partner.name = name;
        partner.description = null;
        partner.subscription = true;
        partner.stage = 'new';
        partner.inProd = false;
        partner.database = {};
        partner.database.user = user;
        partner.database.password = password;
        partner.database.connectString = connectString;
        partner.dns = {};
        partner.dns.domain = "bms.group";
        partner.dns.subdomain = "srv";
        partner.dns.name = name;
        partner.cards = {};
        partner.cards.min = String(8000100600000000 + partner.loyalty_id*100000);
        partner.cards.max = String(8000100600099999 + partner.loyalty_id*100000);
        return await queries.savepartner(name, partner, currentDate);
    },

    getnewpartner: async function () {
        return await queries.getnewpartner();
    },

    deployment: async function (name, stage) {
        let [ code, status ] = [ 1, "error" ];
        if (stage === 'dns') {
            let dns = await functions.getDefaults();
            dns.name = name;
            dns.dns.name = name;
            let result = await queries.dnsstage(dns, name);
            if (result.name === name) {
                queries.deletenewloyalty(name);
                code = 0;
                status = "success";
            }
        }
        return {
            "code": code,
            "status": status
        };
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
    }

}