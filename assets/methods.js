const functions = require('../assets/functions');
const queries = require('../assets/queries');
const oracle = require('../db/oracle');
const fs = require('fs');
const oracledb = require('oracledb');
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

    async getGiftcardwebConfigs(name) {
        let giftcardwebData = [];
        let allConfigs = await queries.getall(name);
        let giftcardweb = await queries.getDefaults('giftcardweb');
        for (let k = 0; k < allConfigs.length; k++) {
            if (allConfigs[k].giftcardweb) {
                let address = 'https://' + allConfigs[k].dns.name + '.' + allConfigs[k].giftcardweb.subdomain + '.' + allConfigs[k].dns.domain + '/';
                let port;
                if (allConfigs[k].type === 'loyalty30') {
                    port = 300 + allConfigs[k].loyalty_id + '47';
                }
                if (allConfigs[k].type === 'regular') {
                    port = 100 + allConfigs[k].loyalty_id + '47';
                }
                giftcardwebData.push({
                    "name": allConfigs[k].name,
                    "address": address,
                    "port": port,
                    "build": giftcardweb.build
                })
            }
        }
        return giftcardwebData;
    },

    async getExtrapaymentConfigs(name) {
        let extrapaymentData = [];
        let allConfigs = await queries.getall(name);
        let extrapayment = await queries.getDefaults('extrapayment');
        for (let k = 0; k < allConfigs.length; k++) {
            let port;
            if (allConfigs[k].type === 'loyalty30') {
                port = 300 + allConfigs[k].loyalty_id + '38';
            }
            if (allConfigs[k].type === 'regular') {
                port = 100 + allConfigs[k].loyalty_id + '38';
            }
            extrapaymentData.push({
                "name": allConfigs[k].name,
                "port": port,
                "build": extrapayment.build
            })
        }
        return extrapaymentData;
    },

    async getdatabaseconfigs(name) {
        let databaseData = [];
        const allConfigs = await queries.getall(name);
        const allDbPlacements = await queries.getAllDbPlacements();
        for (let k = 0; k < allConfigs.length; k++) {
            if (allConfigs[k].database) {
                let placement = allDbPlacements.filter(obj => {
                    return obj.name === allConfigs[k].database.placement
                });
                placement = placement[0];
                databaseData.push({
                    "name": allConfigs[k].name,
                    "description": allConfigs[k].description,
                    "user": allConfigs[k].database.user,
                    "password": allConfigs[k].database.password,
                    "connectString": placement.local.address + ':' + placement.local.port + '/' + placement.oracle_sid,
                    "placement": allConfigs[k].database.placement
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
            let placement = await queries.getPlacement(statSenderConfigs[k].database.placement);
            statSenderData.push({
                "dataBase": statSenderConfigs[k].name,
                "user": statSenderConfigs[k].database.user,
                "password": statSenderConfigs[k].database.password,
                "connectString": placement.local.address + ':' + placement.local.port + '/' + placement.oracle_sid,
            })
        }
        return statSenderData;
    },

    async liquibeniobms() {
        let tasksData = [];
        let beniobmsData = [];
        const allConfigs = await queries.getall();
        const allDbPlacements = await queries.getAllDbPlacements();
        const sqlQuery = fs.readFileSync('./db/sql/getpatch.sql').toString();
        for (let k = 0; k < allConfigs.length; k++) {
            let dataBase = allConfigs[k].name;
            let beniobmsExt;
            if (allConfigs[k].dns) {
                let name = allConfigs[k].beniobms.name || allConfigs[k].dns.name;
                let subdomain = allConfigs[k].beniobms.subdomain || allConfigs[k].dns.subdomain;
                beniobmsExt = 'https://' + name + '.' + subdomain + '.' + allConfigs[k].dns.domain + '/';
            }
            let placement = allDbPlacements.filter(obj => {
                return obj.name === allConfigs[k].database.placement
            });
            placement = placement[0];
            let initialData = {
                'name' : dataBase,
                'dataBase' : dataBase,
                'user' : allConfigs[k].database.user,
                'password' : allConfigs[k].database.password,
                'connectString' : placement.local.address + ':' + placement.local.port + '/' + placement.oracle_sid,
                'beniobmsExt': beniobmsExt,
                'sqlQuery' : sqlQuery
            }
            tasksData.push(initialData);
        }
        let beniobmsVersions = await functions.parallelProcess(functions.getbeniobmsversion, tasksData);
        let currentPatches = await functions.parallelProcess(oracle.sqlrequest, tasksData);
        for (let k = 0; k < tasksData.length; k++) {
            let beniobmsVersion = beniobmsVersions.filter(obj => {
                return obj.name === tasksData[k].name
            });
            let currentPatch = currentPatches.filter(obj => {
                return obj.name === tasksData[k].name
            });
            beniobmsData.push({
                dataBase: tasksData[k].name,
                id: currentPatch[0].data.ID,
                beniobmsVersion: beniobmsVersion[0].beniobmsVersion,
                beniobmsExt: tasksData[k].beniobmsExt
            });
        }
        return beniobmsData;
    },

    async liquiprocessing() {
        let tasksData = [];
        let processingData = [];
        const allConfigs = await queries.getall();
        const allDbPlacements = await queries.getAllDbPlacements();
        const sqlQuery = fs.readFileSync('./db/sql/getpatch.sql').toString();
        for (let k = 0; k < allConfigs.length; k++) {
            let dataBase = allConfigs[k].name;
            let dns, processingExt, processingInt, mobileExt;
            if (allConfigs[k].dns) {
                dns = allConfigs[k].dns.name + '.' + allConfigs[k].dns.subdomain + '.' + allConfigs[k].dns.domain;
            }
            if (allConfigs[k].bps) {
                processingExt = 'https://' + dns + '/' + allConfigs[k].bps.context + '/';
                processingInt = 'http://' + allConfigs[k].bps.placement + ':' + allConfigs[k].bps.port + '/' + allConfigs[k].bps.context + '/';
            }
            if (allConfigs[k].mobile) {
                mobileExt = 'https://' + dns + '/' + allConfigs[k].mobile.context + '/'
            }
            let placement = allDbPlacements.filter(obj => {
                return obj.name === allConfigs[k].database.placement
            });
            placement = placement[0];
            let initialData = {
                'name' : dataBase,
                'dataBase' : dataBase,
                'user' : allConfigs[k].database.user,
                'password' : allConfigs[k].database.password,
                'connectString' : placement.local.address + ':' + placement.local.port + '/' + placement.oracle_sid,
                'processingExt': processingExt,
                'processingInt': processingInt,
                'mobileExt': mobileExt,
                'sqlQuery' : sqlQuery
            }
            tasksData.push(initialData);
        }
        let processingVersions = await functions.parallelProcess(functions.getprocessingversion, tasksData);
        let currentPatches = await functions.parallelProcess(oracle.sqlrequest, tasksData);
        for (let k = 0; k < tasksData.length; k++) {
            let processingVersion = processingVersions.filter(obj => {
                return obj.name === tasksData[k].name
            });
            let currentPatch = currentPatches.filter(obj => {
                return obj.name === tasksData[k].name
            });
            processingData.push({
                dataBase: tasksData[k].name,
                id: currentPatch[0].data.ID,
                processingVersion: processingVersion[0].processingVersion,
                processingExt: tasksData[k].processingExt,
                processingInt: tasksData[k].processingInt,
                mobileExt: tasksData[k].mobileExt
            });
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
        let giftcardweb = await queries.getDefaults('giftcardweb');

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
                for (let i = 0; i < web.dns[allConfigs[k].type].content.length; i++) {
                    dnsData.push({
                        "domain": domain,
                        "subdomain": webSubdomain,
                        "type": web.dns.type,
                        "content": web.dns[allConfigs[k].type].content[i],
                        "ttl": web.dns.ttl
                    })
                }

                let giftcardwebSubdomain = name + '.' + allConfigs[k].giftcardweb.subdomain;
                for (let i = 0; i < giftcardweb.dns.content.length; i++) {
                    dnsData.push({
                        "domain": domain,
                        "subdomain": giftcardwebSubdomain,
                        "type": giftcardweb.dns.type,
                        "content": giftcardweb.dns.content[i],
                        "ttl": giftcardweb.dns.ttl
                    })
                }

            }
        }
        return dnsData;
    },

    async getBmscardwebList() {
        let webList = [];
        let bmscardwebList = [];
        webList = await queries.getBmscardweb();
        let placements = webList.map( config => {
            return config.bmscardweb.placement;
        });
        placements = Array.from(new Set(placements));
        placements.forEach( placement => {
            let filteredWebList = webList.filter( config => {
                return config.bmscardweb.placement === placement;
            });
            let namesArr = [];
            filteredWebList.forEach( config => {
                namesArr = namesArr.concat(config.bmscardweb.names)
            });
            bmscardwebList.push({
                'placement' : placement,
                'names' : namesArr
            });
        });
        return bmscardwebList;
    },

    async getBmscardwebConfigs(name) {
        let webConfig = {};
        let webData = await queries.getWebData(name);
        let partnerConfig = await queries.getOne(name);
        let web = await queries.getDefaults('web');
        let deployhost = await queries.getDeployHost(partnerConfig.location, partnerConfig.bmscardweb.placement);
        let basePorts = await queries.getDefaults('baseports');
        let basePort = basePorts.ports[partnerConfig.bmscardweb.placement][partnerConfig.type].port;
        webConfig.name = name;
        webConfig.namespace = name;
        webConfig.port = basePort + partnerConfig.loyalty_id*20 + web.service_id;
        webConfig.colorPrimary = webData.color1;
        webConfig.colorAccent = webData.color2;
        webConfig.deployhost = deployhost.hostname;
        webConfig.build = web.build;
        webConfig.description = partnerConfig.description;
        return webConfig;
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
        return {
            "name" : name,
            "loyalty_id" : loyaltyId.loyalty_id,
            "type" : loyaltyId.type
        }
    },

    async getBundleIdData(name) {
        let bundleIdData = {};
        let configData = await queries.getBundleIdData(name);
        if (configData !== null) {
            let address = 'https://' + configData.dns.name + '.' + configData.dns.subdomain + '.' + configData.dns.domain;
            let mobileExt = address + '/' + configData.mobile.context + '/';
            bundleIdData.name = configData.name;
            bundleIdData.mobileExt = mobileExt;
            bundleIdData.token = configData.mobile.token;
        }
        return bundleIdData;
    },

    async usersSpace(name) {
        const sqlQuery = fs.readFileSync('./db/sql/getusersspace.sql').toString();
        const placement = await queries.getPlacement(name);
        let initialData = {
            'name' : name,
            'user' : 'sys',
            'password' : placement.sys_password,
            'connectString' : placement.local.address + ':' + placement.local.port + '/' + placement.oracle_sid,
            'privilege' : oracledb.SYSDBA,
            'sqlQuery' : sqlQuery

        }
        let usersSpaceData = await oracle.sqlrequest(initialData, sqlQuery);
        return {
            "name" : usersSpaceData.name,
            "bytes" : usersSpaceData.data.BYTES,
            "maxbytes" : usersSpaceData.data.MAXBYTES,
            "user_bytes" : usersSpaceData.data.USER_BYTES
        }
    },

    async getInfrastructure(data) {
        console.log(data)
        let location = data.location;
        let placement = data.placement;
        let result = await queries.readInfrastructure(location, placement);
        return result;
    },

}

module.exports = methods;
