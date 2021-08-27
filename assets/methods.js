const functions = require('../assets/functions')
const queries = require('../assets/queries');
const oracle = require('../db/oracle')

const methods = {

    async getallconfigs() {
        let allData = [];
        allData = await queries.getall();
        return allData;
    },

    async getbeniobmsconfigs(name) {
        let beniobmsData = [];
        let allConfigs = await queries.getall(name);
        let beniobms = await queries.getDefaults('beniobms');
        for (let k = 0; k < allConfigs.length; k++) {
            if (allConfigs[k].beniobms) {
                let address = 'https://' + allConfigs[k].dns.name + '.' + allConfigs[k].beniobms.subdomain + '.' + allConfigs[k].dns.domain + '/';
                beniobmsData.push({
                    "name": allConfigs[k].name,
                    "address": address,
                    "aw_port": 31000 + allConfigs[k].loyalty_id + '',
                    "mds_port": 31700 + allConfigs[k].loyalty_id + '',
                    "token": allConfigs[k].beniobms.token,
                    "build": beniobms.build
                })
            }
        }
        return beniobmsData;
    },

    async getdatabaseconfigs(name) {
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

    async getbpsconfigs(name) {
        let bpsData = [];
        let allConfigs = await queries.getall(name);
        let processings = await queries.getDefaults('processings');
        for (let k = 0; k < allConfigs.length; k++) {
            if (allConfigs[k].bps) {
                let address = 'https://' + allConfigs[k].dns.name + '.' + allConfigs[k].dns.subdomain + '.' + allConfigs[k].dns.domain;
                let bpsExt = address + '/' + allConfigs[k].bps.context + '/';
                let port;
                if (allConfigs[k].type === 'loyalty30') {
                    port = 300 + allConfigs[k].loyalty_id + '10';
                }
                if (allConfigs[k].type === 'regular') {
                    port = 100 + allConfigs[k].loyalty_id + '10';
                }
                bpsData.push({
                    "name": allConfigs[k].name,
                    "address": address,
                    "bpsExt": bpsExt,
                    "port": port,
                    "context": allConfigs[k].bps.context,
                    "token": allConfigs[k].bps.token,
                    "min_card": allConfigs[k].cards.min,
                    "max_card": allConfigs[k].cards.max,
                    "build": processings.build
                });
            }
        }
        return bpsData;
    },

    async getmobilebackconfigs(name) {
        let mobileData = [];
        let allConfigs = await queries.getall(name);
        let processings = await queries.getDefaults('processings');
        for (let k = 0; k < allConfigs.length; k++) {
            if (allConfigs[k].mobile) {
                let address = 'https://' + allConfigs[k].dns.name + '.' + allConfigs[k].dns.subdomain + '.' + allConfigs[k].dns.domain;
                let mobileExt = address + '/' + allConfigs[k].mobile.context + '/';
                let port;
                if (allConfigs[k].type === 'loyalty30') {
                    port = 300 + allConfigs[k].loyalty_id + '27';
                }
                if (allConfigs[k].type === 'regular') {
                    port = 100 + allConfigs[k].loyalty_id + '27';
                }
                mobileData.push({
                    "name": allConfigs[k].name,
                    "address": address,
                    "mobileExt": mobileExt,
                    "port": port,
                    "context": allConfigs[k].mobile.context,
                    "token": allConfigs[k].mobile.token,
                    "build": processings.build
                });
            }
        }
        return mobileData;
    },

    async getstatsenderconfigs() {
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

    async liquibeniobms() {
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

    async liquiprocessing() {
        let processingData = [];
        let allConfigs = await queries.getall();
        for (let k = 0; k < allConfigs.length; k++) {
            let dataBase = allConfigs[k].name;
            let currentPatch, processingVersion, dns;
            let processingExt, processingInt, mobileExt, mobileInt;
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
    },

    async getcardsranges() {
        let allConfigs = [];
        let cardsData = [];
        allConfigs = await queries.getcardsranges();
        for (let k = 0; k < allConfigs.length; k++) {
            if (allConfigs[k].cards) {
                cardsData.push({
                    "name": allConfigs[k].name,
                    "min_number": allConfigs[k].cards.min,
                    "max_number": allConfigs[k].cards.max
                })
            }
        }
        return cardsData;
    },

    async getdnsrecords(name) {
        let dnsData = [];
        let allConfigs = await queries.getall(name);
        let processings = await queries.getDefaults('processings');
        let beniobms = await queries.getDefaults('beniobms');
        let web = await queries.getDefaults('web');

        for (let k = 0; k < allConfigs.length; k++) {
            if (allConfigs[k].dns && allConfigs[k].bps && allConfigs[k].mobile && allConfigs[k].beniobms) {
                let domain = allConfigs[k].dns.domain;

                let bpsSubdomain = name + '.' + allConfigs[k].bps.subdomain;
                for (let i = 0; i < processings.dns.content.length; i++) {
                    dnsData.push({
                        "domain": domain,
                        "subdomain": bpsSubdomain,
                        "type": processings.dns.type,
                        "content": processings.dns.content[i],
                        "ttl": processings.dns.ttl
                    })
                }

                let beniobmsSubdomain = name + '.' + allConfigs[k].beniobms.subdomain;
                for (let i = 0; i < beniobms.dns.content.length; i++) {
                    dnsData.push({
                        "domain": domain,
                        "subdomain": beniobmsSubdomain,
                        "type": beniobms.dns.type,
                        "content": beniobms.dns.content[i],
                        "ttl": beniobms.dns.ttl
                    })
                }

                let webSubdomain = name;
                for (let i = 0; i < web.dns.content.length; i++) {
                    dnsData.push({
                        "domain": domain,
                        "subdomain": webSubdomain,
                        "type": web.dns.type,
                        "content": web.dns.content[i],
                        "ttl": web.dns.ttl
                    })
                }

            }
        }
        return dnsData;
    },

    async getOracleData(name) {
        let oracleData = [];
        let projectNames = [];
        let placement = await queries.getPlacement(name);
        let projects = await queries.getProjectsInPlacement(name);
        if (placement !== null) {
            let oracleUrl = placement.address + ':' + placement.oracle_port + '/' + placement.oracle_sid;
            for (let i = 0; i < projects.length; i++) {
                projectNames[i] = projects[i].name
            }
            oracleData.push ({
                "name" : name,
                "oracle_url" : oracleUrl,
                "oracle_sid" : placement.oracle_sid,
                "sys_password" : placement.sys_password,
                "projects" : projectNames
            });
        }
        return oracleData;
    },

    async getLoyaltyId(name) {
        let loyaltyId = await queries.getLoyaltyId(name);
        loyaltyId = loyaltyId.loyalty_id
        return {
            "name" : name,
            "loyalty_id" : loyaltyId
        }
    },

    }

module.exports = methods;
