const {getall} = require('../functions/queries.js')
const {getstatsender} = require('../functions/queries.js')

module.exports = {

    getallconfigs: async function () {
        let allData = [];

        allData = await getall();

        return allData;
    },

    getliquicheckconfigs: async function () {
        let allConfigs = [];
        let liquicheckData = [];

        allConfigs = await getall();

        for (let k = 0; k < allConfigs.length; k++) {
            let name = allConfigs[k].dns.name;
            let subdomain = allConfigs[k].dns.subdomain;
            let domain = allConfigs[k].dns.domain
            let dns = name + '.' + subdomain + '.' + domain;

            let bpsContext = allConfigs[k].bps.context
            let bpsPlacement = allConfigs[k].bps.placement
            let bpsPort = allConfigs[k].bps.port

            let mobileContext = allConfigs[k].mobile.context
            let mobilePlacement = allConfigs[k].mobile.placement
            let mobilePort = allConfigs[k].mobile.port

            liquicheckData.push({
                "dataBase": allConfigs[k].name,
                "user": allConfigs[k].database.user,
                "password": allConfigs[k].database.password,
                "connectString": allConfigs[k].database.connectString,
                "processingExt" : 'https://' + dns + '/' + bpsContext + '/',
                "processingInt" : 'http://' + bpsPlacement + ':' + bpsPort + '/' + bpsContext + '/',
                "mobileExt" : 'https://' + dns + '/' + mobileContext + '/',
                "mobileInt" : 'http://' + mobilePlacement + ':' + mobilePort + '/' + mobileContext + '/'
            })
        }
       return liquicheckData;
    },

    getstatsenderconfigs: async function () {
        let statSenderConfigs = [];
        let statSenderData = [];

        statSenderConfigs = await getstatsender();

        for (let k = 0; k < statSenderConfigs.length; k++) {
            statSenderData.push({
                "dataBase": statSenderConfigs[k].name,
                "user": statSenderConfigs[k].database.user,
                "password": statSenderConfigs[k].database.password,
                "connectString": statSenderConfigs[k].database.connectString
            })
        }
       return statSenderData;
    },

    getmobilebackconfigs: async function () {
        let allConfigs = [];
        let mobileBackData = [];

        allConfigs = await getall();

        for (let k = 0; k < allConfigs.length; k++) {
            if (allConfigs[k].mobile) {
                let name = allConfigs[k].mobile.name || allConfigs[k].dns.name;
                let subdomain = allConfigs[k].mobile.subdomain || allConfigs[k].dns.subdomain;
                let domain = allConfigs[k].dns.domain
                let dns = name + '.' + subdomain + '.' + domain;

                let mobileContext = allConfigs[k].mobile.context
                let mobilePlacement = allConfigs[k].mobile.placement
                let mobilePort = allConfigs[k].mobile.port
                let mobileToken = allConfigs[k].mobile.token

                mobileBackData.push({
                    "name": allConfigs[k].name,
                    "mobileExt": 'https://' + dns + '/' + mobileContext + '/',
                    "mobileInt": 'http://' + mobilePlacement + ':' + mobilePort + '/' + mobileContext + '/',
                    "token": mobileToken
                })
            }
        }
        return mobileBackData;
    },

    getbeniobmsconfigs: async function () {
        let allConfigs = [];
        let beniobmsData = [];

        allConfigs = await getall();

        for (let k = 0; k < allConfigs.length; k++) {
            if (allConfigs[k].beniobms) {
                let name = allConfigs[k].beniobms.name || allConfigs[k].dns.name;
                let subdomain = allConfigs[k].beniobms.subdomain || allConfigs[k].dns.subdomain;
                let domain = allConfigs[k].dns.domain
                let dns = name + '.' + subdomain + '.' + domain;

                let beniobmsPlacement = allConfigs[k].beniobms.placement
                let beniobmsPort = allConfigs[k].beniobms.port
                let beniobmsToken = allConfigs[k].beniobms.token

                beniobmsData.push({
                    "name": allConfigs[k].name,
                    "mobileExt": 'https://' + dns + '/',
                    "mobileInt": 'http://' + beniobmsPlacement + ':' + beniobmsPort + '/',
                    "token": beniobmsToken
                })
            }
        }
        return beniobmsData;
    }

}
