const loyaltyFunctions = require('../loyalty/functions');
const loyaltyQueries = require('../loyalty/queries');
const assetsQueries = require('../assets/queries');
const responses = require('../responses');

// Setting variables
databaseHost = process.env.databaseHost || 'db3'

module.exports = {

    _checkLoyaltyExists: async function (name) {
        return await assetsQueries.getOne(name);
    },

    newPartner: async function (type, name, description, modules) {
        console.log(modules);
        if (await this._checkLoyaltyExists(name)) {
            return responses.error104;
        }
        let partner = {};
        const currentDate = new Date().toLocaleString('ru-RU');
        const bps = await assetsQueries.getDefaults('bps');
        const mobileback = await assetsQueries.getDefaults('mobileback');
        const beniobms = await assetsQueries.getDefaults('beniobms');
        const bmscardweb = await assetsQueries.getDefaults('bmscardweb');
        const lastId = await loyaltyQueries.getLastID(type);
        const loyalty_id = lastId + 1;
        const projectID = (loyalty_id + name).slice(0,6);
        const user = loyaltyFunctions.userGen(name);
        const password = loyaltyFunctions.passGen();
        const procPassword = loyaltyFunctions.passGen();
        partner.loyalty_id = loyalty_id;
        partner.type = type;
        partner.name = name;
        partner.location = 'prod';
        partner.description = description || '!!! Change me !!!';
        partner.subscription = true;
        partner.stage = 'new';
        partner.inProd = false;
        partner.projectID = projectID;
        partner.database = {};
        partner.database.user = user;
        partner.database.password = password;
        partner.database.host = databaseHost;
        partner.dns = {};
        partner.dns.domain = 'bms.group';
        partner.dns.subdomain = 'srv';
        partner.dns.name = name;
        partner.bps = {};
        partner.bps.context = 'bps-' + name;
        partner.bps.token = procPassword;
        partner.bps.placement = bps.placement;
        partner.cards = {};
        if (partner.type === 'loyalty30') {
            partner.cards.min = String(8000100600000000 + partner.loyalty_id*100000);
            partner.cards.max = String(8000100600099999 + partner.loyalty_id*100000);
        }
        if (partner.type === 'regular') {
            partner.cards.min = String(8000081600000000 + partner.loyalty_id*1000000);
            partner.cards.max = String(8000081600999999 + partner.loyalty_id*1000000);
        }
        partner.mobileback = {};
        partner.mobileback.context =  'mobile-' + name;
        partner.mobileback.token = procPassword;
        partner.mobileback.placement = mobileback.placement;
        partner.beniobms = {};
        partner.beniobms.token = loyaltyFunctions.passGen();
        partner.beniobms.subdomain = 'adb';
        partner.beniobms.placement = beniobms.placement;
        partner.bmscardweb = {};
        partner.bmscardweb.placement = bmscardweb.placement;
        partner.bmscardweb.names = [name];
        if (modules.includes('giftcardweb')) {
            const giftcardweb = await assetsQueries.getDefaults('giftcardweb');
            partner.giftcardweb = {};
            partner.giftcardweb.subdomain = 'gcb';
            partner.giftcardweb.placement = giftcardweb.placement;
        }
        if (modules.includes('extrapayment')) {
            const extrapayment = await assetsQueries.getDefaults('extrapayment');
            partner.extrapayment = {};
            partner.extrapayment.placement = extrapayment.placement;
        }
        await loyaltyQueries.savePartner(name, partner, currentDate);
        return responses.response204;
    },

    getNewPartner: async function () {
        return await loyaltyQueries.getNewPartner();
    },

    getAllNames: async function () {
        let allData = [];
        let allNames = [];
        allData = await loyaltyQueries.getAll();
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
        let result = await loyaltyQueries.updateStage(name, stage);
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
        return await loyaltyQueries.getLoyaltyData(name);
    },

    setStatus: async function (name, action) {
        if (!(action === 'block' || action === 'unblock')) { return responses.error102 }
        let stage = await loyaltyQueries.getStage(name);
        stage = stage.stage;
        if (stage === action + 'ed' || stage === 'to_' + action) { return responses.error103 }
        let result = await loyaltyQueries.updateStage(name, 'to_' + action);
        if (result.name === name) {
            responses.response201.message = "Status was changed to " + action;
            return responses.response201;
        } else {
            return responses.error1;
        }
    },

    getNewStatus: async function () {
        return await loyaltyQueries.getNewStatus();
    },

}