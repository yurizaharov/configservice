const functions = require('../assets/functions')
const queries = require('../assets/queries');
const oracle = require('../db/oracle')

const methods = {

    async getallconfigs () {
        let allData = [];
        allData = await queries.getall();
        return allData;
    },

    async getbeniobmsconfigs (name) {
        let allConfigs = [];
        let beniobmsData = [];
        allConfigs = await queries.getall(name);
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
    },

    async getdatabaseconfigs (name) {
        let allConfigs = [];
        let databaseData = [];
        allConfigs = await queries.getall(name);
        for (let k = 0; k < allConfigs.length; k++) {
            if (allConfigs[k].database) {
                databaseData.push({
                    "name": allConfigs[k].name,
                    "description": allConfigs[k].description,
                    "user": allConfigs[k].database.user,
                    "password": allConfigs[k].database.password,
                    "connectString": allConfigs[k].database.connectString
                })
            }
        }
        return databaseData;
    },

    async getmobilebackconfigs (name) {
        let allConfigs = [];
        let mobileBackData = [];
        allConfigs = await queries.getall(name);
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

    async getstatsenderconfigs () {
        let statSenderConfigs = [];
        let statSenderData = [];
        statSenderConfigs = await queries.getstatsender();
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

    async liquibeniobms () {
        let beniobmsData = [];
        let allConfigs = await queries.getall();
        for (let k = 0; k < allConfigs.length; k++) {
            let dataBase = allConfigs[k].name;
            let currentPatch, beniobmsExt, beniobmsInt, beniobmsVersion;
            if (allConfigs[k].database) {
                currentPatch = await oracle.getpatch(allConfigs[k].database)
            }
            if (allConfigs[k].beniobms) {
                let name = allConfigs[k].beniobms.name || allConfigs[k].dns.name;
                let subdomain = allConfigs[k].beniobms.subdomain || allConfigs[k].dns.subdomain;
                let domain = allConfigs[k].dns.domain;
                let dns = name + '.' + subdomain + '.' + domain;
                let beniobmsPlacement = allConfigs[k].beniobms.placement;
                let beniobmsPort = allConfigs[k].beniobms.port;
                beniobmsExt = 'https://' + dns + '/';
                beniobmsInt = 'http://' + beniobmsPlacement + ':' + beniobmsPort + '/';
                beniobmsVersion = await functions.getbeniobmsversion(beniobmsExt);
            }
            beniobmsData.push({
                dataBase: dataBase,
                id: currentPatch,
                beniobmsExt: beniobmsExt,
                beniobmsInt: beniobmsInt,
                beniobmsVersion: beniobmsVersion
            })
        }
        return beniobmsData;
    },

    async liquiprocessing () {
        let processingData = [];
        let allConfigs = await queries.getall();
        for (let k = 0; k < allConfigs.length; k++) {
            let dataBase = allConfigs[k].name;
            let currentPatch, processingVersion, dns;
            let processingExt,processingInt,mobileExt,mobileInt;
            if (allConfigs[k].database) {
                currentPatch = await oracle.getpatch(allConfigs[k].database)
            }
            if (allConfigs[k].dns) {
                dns = allConfigs[k].dns.name + '.' + allConfigs[k].dns.subdomain + '.' + allConfigs[k].dns.domain;
            }
            if (allConfigs[k].bps) {
                processingExt = 'https://' + dns + '/' + allConfigs[k].bps.context + '/';
                processingInt = 'http://' + allConfigs[k].bps.placement + ':' + allConfigs[k].bps.port + '/' + allConfigs[k].bps.context + '/';
            }
            if (allConfigs[k].mobile) {
                mobileExt = 'https://' + dns + '/' + allConfigs[k].mobile.context + '/'
                mobileInt = 'http://' + allConfigs[k].mobile.placement + ':' + allConfigs[k].mobile.port + '/' + allConfigs[k].mobile.context + '/'
            }
            processingVersion = await functions.getprocessingversion(processingExt);
            processingData.push({
                dataBase: dataBase,
                id: currentPatch,
                processingVersion: processingVersion,
                processingExt: processingExt,
                processingInt: processingInt,
                mobileExt: mobileExt,
                mobileInt: mobileInt
            })
        }
        return processingData;
    }

}

module.exports = methods;
