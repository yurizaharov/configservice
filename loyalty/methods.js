const functions = require('../loyalty/functions')
const queries = require('../loyalty/queries')

// Setting variables
databasePlacement = process.env.databasePlacement || 'db3'

module.exports = {

    newPartner: async function (type, name, description, modules) {
        console.log(modules);
        let partner = {};
        let currentDate = new Date().toLocaleString('ru-RU');
        let lastId = await queries.getLastID(type);
        let loyalty_id = lastId + 1;
        let projectID = (loyalty_id + name).slice(0,6);
        let user = functions.userGen(name);
        let password = functions.passGen();
        let procPassword = functions.passGen();
        partner.loyalty_id = loyalty_id;
        partner.type = type;
        partner.name = name;
        partner.location = 'prod';
        partner.description = description;
        partner.subscription = true;
        partner.stage = 'new';
        partner.inProd = false;
        partner.projectID = projectID;
        partner.database = {};
        partner.database.user = user;
        partner.database.password = password;
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
        partner.beniobms.token = functions.passGen();
        partner.beniobms.subdomain = 'adb';
        partner.giftcardweb = {};
        partner.giftcardweb.subdomain = 'gcb';
        partner.bmscardweb = {};
        partner.bmscardweb.placement = 'k8s';
        partner.bmscardweb.names = [name];
        return await queries.savePartner(name, partner, currentDate);
    },

    getNewPartner: async function () {
        return await queries.getNewPartner();
    },

    getAllNames: async function () {
        let allData = [];
        let allNames = [];
        allData = await queries.getAll();
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

    getLoyaltyData: async function (name) {
        return await queries.getLoyaltyData(name);
    },

}