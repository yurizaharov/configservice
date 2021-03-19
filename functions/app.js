const {getall} = require('../functions/queries.js')
const {getstatsender} = require('../functions/queries.js')

module.exports = {

    getallconfigs: async function () {
        let allConfigs = [];

        allConfigs = await getall();

        return allConfigs;
    },

    getliquicheckconfigs: async function () {
        let allConfigs = [];
        let initialData = [];

        allConfigs = await getall();

        for (let k = 0; k < allConfigs.length; k++) {
            if (allConfigs[k].processingExt) {
                initialData.push({
                    "dataBase": allConfigs[k].name,
                    "user": allConfigs[k].user,
                    "password": allConfigs[k].password,
                    "connectString": allConfigs[k].connectString,
                    "processingExt" : allConfigs[k].processingExt,
                    "processingInt" : allConfigs[k].processingInt,
                    "mobileExt" : allConfigs[k].mobileExt,
                    "mobileInt" : allConfigs[k].mobileInt
                })

            } else {
                let dns = allConfigs[k].dns.name;

                let bpsContext = allConfigs[k].bps.context
                let bpsPlacement = allConfigs[k].bps.placement
                let bpsPort = allConfigs[k].bps.port

                let mobileContext = allConfigs[k].mobile.context
                let mobilePlacement = allConfigs[k].mobile.placement
                let mobilePort = allConfigs[k].mobile.port

                initialData.push({
                    "dataBase": allConfigs[k].name,
                    "user": allConfigs[k].database.user,
                    "password": allConfigs[k].database.password,
                    "connectString": allConfigs[k].database.connectString,
                    "processingExt" : 'https://' + dns + '/' + bpsContext + '/',
                    "processingInt" : 'http://' + bpsPlacement + ':' + bpsPort + '/' + bpsContext + '/',
                    "mobileExt" : 'https://' + dns + '/' + mobileContext + '/',
                    "mobileInt" : 'http://' + mobilePlacement + ':' + mobilePort + '/' + bpsContext + '/'
                })
            }
        }

            return initialData;
    },

    getstatsenderconfigs: async function () {
        let statSender = [];
        let initialData = [];

        statSender = await getstatsender();

        for (let k = 0; k < statSender.length; k++) {
            if (!statSender[k].database){
                initialData.push({
                    "dataBase": statSender[k].name,
                    "user": statSender[k].user,
                    "password": statSender[k].password,
                    "connectString": statSender[k].connectString
                })
            } else {
                initialData.push({
                    "dataBase": statSender[k].name,
                    "user": statSender[k].database.user,
                    "password": statSender[k].database.password,
                    "connectString": statSender[k].database.connectString
                })
            }


        }

        return initialData;
    }
}
