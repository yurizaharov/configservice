const functions = require('../assets/functions');
const queries = require('../assets/queries');
const oracle = require('../db/oracle');
const fs = require('fs');
const oracledb = require('oracledb');

const notFoundError = {
    "code": 1,
    "status": "Not found"
};

const methods = {

    async getallconfigs() {
        let allData = [];
        allData = await queries.getAll();
        return allData;
    },

    async getBeniobmsList() {
        let list = [];
        let beniobmsList = [];

        // Getting partners configs where defined beniobms modules
        list = await queries.getAllBeniobms();

        // Getting list of all partners with beniobms modules
        let all = list.map( config => {
            return config.name;
        });
        beniobmsList.push({
            'beniobms' : 'all',
            'names' : all
        });

        // Getting all locations and putting the list of beniobms in each location
        let locations = list.map( config => {
            return config.location;
        });
        locations = Array.from(new Set(locations));
        locations.forEach( location => {
            let filteredList = list.filter( config => {
                return config.location === location;
            });
            let namesArr = [];
            filteredList.forEach( config => {
                namesArr = namesArr.concat(config.name)
            });
            beniobmsList.push({
                'location' : location,
                'names' : namesArr
            });
        });

        // Getting all placements and putting the list of beniobms in each placement
        let placements = list.map( config => {
            return config.beniobms.placement;
        });
        placements = Array.from(new Set(placements));
        placements.forEach( placement => {
            let filteredList = list.filter( config => {
                return config.beniobms.placement === placement;
            });
            let namesArr = [];
            filteredList.forEach( config => {
                namesArr = namesArr.concat(config.name)
            });
            beniobmsList.push({
                'placement' : placement,
                'names' : namesArr
            });
        });

        // Returning result
        return beniobmsList;
     },

    async getBeniobmsConfig(name) {
        let partnerConfig = await queries.getOneBeniobms(name);
        if (!partnerConfig) {
            return notFoundError;
        } else {
            let beniobmsConfig = {};
            let beniobms = await queries.getDefaults('beniobms');
            let admin_web = await queries.getDefaults('admin-web');
            let message_delivery_service = await queries.getDefaults('message-delivery-service');
            let deployhost = await queries.getDeployHost(partnerConfig.location, partnerConfig.beniobms.placement);
            let basePorts = await queries.getDefaults('baseports');
            let basePort = basePorts.ports[partnerConfig.beniobms.placement][partnerConfig.type].port;
            let beniobmsDnsName = partnerConfig.beniobms.name || partnerConfig.dns.name;
            let beniobmsDnsSubdomain = partnerConfig.beniobms.subdomain || partnerConfig.dns.subdomain;
            let beniobmsDnsDomain = partnerConfig.dns.domain;
            beniobmsConfig.name = name;
            beniobmsConfig.namespace = name;
            beniobmsConfig.description = partnerConfig.description;
            beniobmsConfig.beniobmsAddress = 'https://' + beniobmsDnsName + '.' + beniobmsDnsSubdomain + '.' + beniobmsDnsDomain + '/';
            beniobmsConfig.aw_port = basePort + partnerConfig.loyalty_id * 20 + admin_web.service_id;
            beniobmsConfig.mds_port = basePort + partnerConfig.loyalty_id * 20 + message_delivery_service.service_id;
            beniobmsConfig.beniobmsDeployhost = deployhost.hostname;
            beniobmsConfig.beniobmsToken = partnerConfig.beniobms.token;
            beniobmsConfig.beniobmsBuild = beniobms.build;
            return beniobmsConfig;
        }
    },

    async getGiftcardwebConfig(name) {
        let partnerConfig = await queries.getOneGiftcardweb(name);
        if (!partnerConfig) {
            return notFoundError;
        } else {
            let giftcardwebConfig = {};
            let currentLocation = partnerConfig.giftcardweb.location || partnerConfig.location;
            let giftcardweb = await queries.getDefaults('giftcardweb');
            let deployhost = await queries.getDeployHost(currentLocation, partnerConfig.giftcardweb.placement);
            let basePorts = await queries.getDefaults('baseports');
            let basePort = basePorts.ports[partnerConfig.giftcardweb.placement][partnerConfig.type].port;
            let giftcardwebDnsName = partnerConfig.giftcardweb.name || partnerConfig.dns.name;
            let giftcardwebDnsSubdomain = partnerConfig.giftcardweb.subdomain || partnerConfig.dns.subdomain;
            let giftcardwebDnsDomain = partnerConfig.dns.domain;
            giftcardwebConfig.name = name;
            giftcardwebConfig.namespace = name;
            giftcardwebConfig.giftcardwebPort = basePort + partnerConfig.loyalty_id * 20 + giftcardweb.service_id;
            giftcardwebConfig.giftcardwebDeployhost = deployhost.hostname;
            giftcardwebConfig.giftcardwebBuild = giftcardweb.build;
            giftcardwebConfig.giftcardwebUrl = 'https://' + giftcardwebDnsName + '.' +  giftcardwebDnsSubdomain + '.' +  giftcardwebDnsDomain + '/';
            return giftcardwebConfig;
        }
    },

    async getExtrapaymentConfig(name) {
        let partnerConfig = await queries.getOne(name);
        if (!partnerConfig) {
            return notFoundError;
        } else {
            let extrapaymentConfig = {};
            let extrapayment = await queries.getDefaults('extrapayment');
            let deployhost = await queries.getDeployHost(partnerConfig.location, 'swarm');
            let basePorts = await queries.getDefaults('baseports');
            let basePort = basePorts.ports['swarm'][partnerConfig.type].port;
            extrapaymentConfig.name = name;
            extrapaymentConfig.extrapaymentPort = basePort + partnerConfig.loyalty_id * 20 + extrapayment.service_id;
            extrapaymentConfig.extrapaymentBuild = extrapayment.build;
            extrapaymentConfig.extrapaymentDeployhost = deployhost.hostname;
            return extrapaymentConfig;
        }
    },

    async getdatabaseconfigs(name) {
        let databaseData = [];
        const allConfigs = await queries.getAll(name);
        const allDbPlacements = await queries.getAllDbPlacements();
        for (let k = 0; k < allConfigs.length; k++) {
            if (allConfigs[k].database) {
                let placement = allDbPlacements.filter(obj => {
                    return obj.hostname === allConfigs[k].database.host
                });
                placement = placement[0];
                databaseData.push({
                    "name": allConfigs[k].name,
                    "description": allConfigs[k].description,
                    "user": allConfigs[k].database.user,
                    "password": allConfigs[k].database.password,
                    "connectString": placement.local.address + ':' + placement.local.port + '/' + placement.oracle_sid,
                    "host": allConfigs[k].database.host
                })
            }
        }
        return databaseData;
    },

    async getDatabaseConfig(name) {
        let partnerConfig = await queries.getOne(name);
        if (!partnerConfig) {
            return notFoundError;
        } else {
            let databaseConfig = {};
            const allDbPlacements = await queries.getAllDbPlacements();
            let placement = allDbPlacements.filter(obj => {
                return obj.hostname === partnerConfig.database.host
            });
            placement = placement[0];
            databaseConfig.name = name;
            databaseConfig.description = partnerConfig.description;
            databaseConfig.user = partnerConfig.database.user;
            databaseConfig.password = partnerConfig.database.password;
            databaseConfig.connectString = placement.local.address + ':' + placement.local.port + '/' + placement.oracle_sid;
            databaseConfig.host = partnerConfig.database.host;
            return databaseConfig;
        }
    },

    async getbpsconfigs(name) {
        let bpsData = [];
        let allConfigs = await queries.getAll(name);
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

    async getBpsConfig(name) {
        let partnerConfig = await queries.getOneBps(name);
        if (!partnerConfig) {
            return notFoundError;
        } else {
            let bpsConfig = {};
            let bps = await queries.getDefaults('bps');
            let deployhost = await queries.getDeployHost(partnerConfig.location, partnerConfig.bps.placement);
            let basePorts = await queries.getDefaults('baseports');
            let basePort = basePorts.ports[partnerConfig.bps.placement][partnerConfig.type].port;
            let bpsDnsName = partnerConfig.bps.name || partnerConfig.dns.name;
            let bpsDnsSubdomain = partnerConfig.bps.subdomain || partnerConfig.dns.subdomain;
            let bpsDnsDomain = partnerConfig.dns.domain;
            bpsConfig.name = name;
            bpsConfig.namespace = name;
            bpsConfig.description = partnerConfig.description;
            bpsConfig.bpsAddress = 'https://' + bpsDnsName + '.' + bpsDnsSubdomain + '.' + bpsDnsDomain + '/';
            bpsConfig.bpsExt = bpsConfig.bpsAddress + partnerConfig.bps.context + '/';
            bpsConfig.bpsPort = basePort + partnerConfig.loyalty_id * 20 + bps.service_id;
            bpsConfig.bpsContext = partnerConfig.bps.context;
            bpsConfig.bpsToken = partnerConfig.bps.token;
            bpsConfig.bpsBuild = bps.build;
            bpsConfig.bpsDeployhost = deployhost.hostname;
            bpsConfig.min_card = partnerConfig.cards.min;
            bpsConfig.max_card = partnerConfig.cards.max;
            return bpsConfig;
        }
    },

    async getMobilebackList() {
        let list = [];
        let mobilebackList = [];

        // Getting partners configs where defined mobileback module
        list = await queries.getAllMobileback();

        // Getting list of all partners with mobileback module
        let all = list.map( config => {
            return config.name;
        });
        mobilebackList.push({
            'mobileback' : 'all',
            'names' : all
        });

        // Getting all locations and putting the list of mobileback in each location
        let locations = list.map( config => {
            return config.location;
        });
        locations = Array.from(new Set(locations));
        locations.forEach( location => {
            let filteredList = list.filter( config => {
                return config.location === location;
            });
            let namesArr = [];
            filteredList.forEach( config => {
                namesArr = namesArr.concat(config.name)
            });
            mobilebackList.push({
                'location' : location,
                'names' : namesArr
            });
        });

        // Getting all placements and putting the list of mobileback in each placement
        let placements = list.map( config => {
            return config.mobileback.placement;
        });
        placements = Array.from(new Set(placements));
        placements.forEach( placement => {
            let filteredList = list.filter( config => {
                return config.mobileback.placement === placement;
            });
            let namesArr = [];
            filteredList.forEach( config => {
                namesArr = namesArr.concat(config.name)
            });
            mobilebackList.push({
                'placement' : placement,
                'names' : namesArr
            });
        });

        // Returning result
        return mobilebackList;
    },

    async getMobilebackConfig(name) {
        let parentConfig, childConfig;
        let config = await queries.getOneMobileback(name);
        if (!config) {
            return notFoundError;
        } else if (!config.coalition) {
            childConfig = config;
            parentConfig = config;
        } else {
            childConfig = config;
            parentConfig = await queries.getOneMobileback(config.coalition.name);
        }
        let mobilebackConfig = {};
        let mobileback = await queries.getDefaults('mobileback');
        let deployhost = await queries.getDeployHost(parentConfig.location, parentConfig.mobileback.placement);
        let basePorts = await queries.getDefaults('baseports');
        let basePort = basePorts.ports[parentConfig.mobileback.placement][parentConfig.type].port;
        let mobilebackDnsName = parentConfig.mobileback.name || parentConfig.dns.name;
        let mobilebackDnsSubdomain = parentConfig.mobileback.subdomain || parentConfig.dns.subdomain;
        let mobilebackDnsDomain = parentConfig.dns.domain;
        mobilebackConfig.name = name;
        mobilebackConfig.namespace = parentConfig.name;
        mobilebackConfig.description = childConfig.description;
        mobilebackConfig.mobileAddress = 'https://' + mobilebackDnsName + '.' + mobilebackDnsSubdomain + '.' + mobilebackDnsDomain + '/';
        mobilebackConfig.mobileExt = mobilebackConfig.mobileAddress + (childConfig.mobileback.context || parentConfig.mobileback.context) + '/';
        mobilebackConfig.mobilePort = childConfig.mobileback.port || basePort + parentConfig.loyalty_id * 20 + mobileback.service_id;
        mobilebackConfig.mobileContext = childConfig.mobileback.context || parentConfig.mobileback.context;
        mobilebackConfig.mobileToken = childConfig.mobileback.token || parentConfig.mobileback.token;
        mobilebackConfig.projectID = parentConfig.projectID;
        mobilebackConfig.mobileBuild = mobileback.build;
        mobilebackConfig.mobileDeployhost = deployhost.hostname;
        return mobilebackConfig;
    },

    async getStatSenderConfigs() {
        const statSenderConfigs = await queries.getStatSender();
        const allDbPlacements = await queries.getAllDbPlacements();
        const statSenderData = statSenderConfigs.map( partner => {
            let placement = allDbPlacements.filter( obj => {
                return obj.hostname === partner.database.host
            });
            placement = placement[0];
            return {
                "dataBase": partner.name,
                "user": partner.database.user,
                "password": partner.database.password,
                "connectString": placement.local.address + ':' + placement.local.port + '/' + placement.oracle_sid,
            }
        });
        return statSenderData;
    },

    async liquiBeniobms() {
        const allConfigs = await queries.getAllBeniobms();
        const allDbPlacements = await queries.getAllDbPlacements();
        const sqlQuery = fs.readFileSync('./db/sql/getpatch.sql').toString();
        let configs = allConfigs.map( config => {
            let placement = allDbPlacements.filter( obj => {
                return obj.hostname === config.database.host
            });
            placement = placement[0];
            let beniobmsDnsName = config.beniobms.name || config.dns.name;
            let beniobmsDnsSubdomain = config.beniobms.subdomain || config.dns.subdomain;
            let beniobmsDnsDomain = config.dns.domain;
            let beniobmsExt = 'https://' + beniobmsDnsName + '.' + beniobmsDnsSubdomain + '.' + beniobmsDnsDomain + '/';
            return {
                'name' : config.name,
                'dataBase' : config.name,
                'user' : config.database.user,
                'password' : config.database.password,
                'connectString' : placement.local.address + ':' + placement.local.port + '/' + placement.oracle_sid,
                'beniobmsExt': beniobmsExt,
                'sqlQuery' : sqlQuery
            }
        });

        let beniobmsVersions = await functions.parallelProcess(functions.getBeniobmsVersion, configs);
        let currentPatches = await functions.parallelProcess(oracle.sqlRequest, configs);

        let beniobmsData = configs.map( config => {
            let beniobmsVersion = beniobmsVersions.filter( obj => {
                return obj.name === config.name
            });
            let currentPatch = currentPatches.filter( obj => {
                return obj.name === config.name
            });
            return {
                dataBase: config.name,
                id: '' || currentPatch[0].data.ID,
                beniobmsVersion: '' || beniobmsVersion[0].beniobmsVersion,
                beniobmsExt: config.beniobmsExt
            }
        });
        return beniobmsData;
    },

    async liquiProcessing() {
        const allConfigs = await queries.getAll();
        const allDbPlacements = await queries.getAllDbPlacements();
        const allLocations = await queries.getAllLocations();
        const sqlQuery = fs.readFileSync('./db/sql/getpatch.sql').toString();
        let configs = allConfigs.map( config => {
            let bpsExt, bpsInt, mobilebackExt;
            let placement = allDbPlacements.filter( obj => {
                return obj.hostname === config.database.host
            });
            placement = placement[0];
            let location;
            location = allLocations.filter( obj => {
                return obj.location === config.location
            });
            location = location[0];
            if (config.bps) {
                let bpsDnsName = config.bps.name || config.dns.name;
                let bpsDnsSubdomain = config.bps.subdomain || config.dns.subdomain;
                let bpsDnsDomain = config.dns.domain;
                let bpsDns = bpsDnsName + '.' + bpsDnsSubdomain + '.' + bpsDnsDomain;
                bpsExt = 'https://' + bpsDns + '/' + config.bps.context + '/';
                if (location.http_access) {
                    bpsInt = 'http://' + location.http_access.local_address + ':' + location.http_access.local_port + '/' + config.bps.context + '/';
                }
            }
            if (config.mobileback) {
                let mobilebackDnsName = config.mobileback.name || config.dns.name;
                let mobilebackDnsSubdomain = config.mobileback.subdomain || config.dns.subdomain;
                let mobilebackDnsDomain = config.dns.domain;
                let mobilebackDns = mobilebackDnsName + '.' + mobilebackDnsSubdomain + '.' + mobilebackDnsDomain;
                mobilebackExt = 'https://' + mobilebackDns + '/' + config.mobileback.context + '/';
            }
            return {
                'name' : config.name,
                'dataBase' : config.name,
                'user' : config.database.user,
                'password' : config.database.password,
                'connectString' : placement.local.address + ':' + placement.local.port + '/' + placement.oracle_sid,
                'processingExt': bpsExt,
                'processingInt': bpsInt,
                'mobileExt': mobilebackExt,
                'sqlQuery' : sqlQuery
            }
        });

        let bpsVersions = await functions.parallelProcess(functions.getBpsVersion, configs);
        let currentPatches = await functions.parallelProcess(oracle.sqlRequest, configs);

        let processingData = configs.map( config => {
            let bpsVersion = bpsVersions.filter( obj => {
                    return obj.name === config.name
            });
            let currentPatch = currentPatches.filter( obj => {
                    return obj.name === config.name
            });
            return {
                dataBase: config.name,
                id: '' || currentPatch[0].data.ID,
                processingVersion: '' || bpsVersion[0].processingVersion,
                processingExt: config.processingExt,
                processingInt: config.processingInt,
                mobileExt: config.mobileExt
            }
        });
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

    async getAllDnsRecords(location) {
        let allDnsRecords = [];
        let list = await queries.getByLocation(location);
        let locationData = await queries.getLocationData(location);
        let bps = await queries.getDefaults('bps');
        let beniobms = await queries.getDefaults('beniobms');
        let bmscardweb = await queries.getDefaults('bmscardweb');
        let giftcardweb = await queries.getDefaults('giftcardweb');
        for (let x in locationData.working_providers) {
            list.map( record => {
                let state = (x > 0) ? 'add' : 'present';
                let bpsDnsName = record.bps.name || record.dns.name;
                let bpsDnsSubdomain = record.bps.subdomain || record.dns.subdomain;
                allDnsRecords.push({
                    "domain": record.dns.domain,
                    "subdomain": bpsDnsName + '.' + bpsDnsSubdomain,
                    "type": bps.dns.type,
                    "content": locationData.providers[locationData.working_providers[x]].address,
                    "ttl": bps.dns.ttl,
                    "state": state
                });
                if (record.beniobms) {
                    let beniobmsDnsName = record.beniobms.name || record.dns.name;
                    let beniobmsDnsSubdomain = record.beniobms.subdomain || record.dns.subdomain;
                    allDnsRecords.push({
                        "domain": record.dns.domain,
                        "subdomain": beniobmsDnsName + '.' + beniobmsDnsSubdomain,
                        "type": beniobms.dns.type,
                        "content": locationData.providers[locationData.working_providers[x]].address,
                        "ttl": beniobms.dns.ttl,
                        "state": state
                    });
                }
                if (record.giftcardweb) {
                    let giftcardwebDnsName = record.giftcardweb.name || record.dns.name;
                    let giftcardwebDnsSubdomain = record.giftcardweb.subdomain || record.dns.subdomain;
                    allDnsRecords.push({
                        "domain": record.dns.domain,
                        "subdomain": giftcardwebDnsName + '.' + giftcardwebDnsSubdomain,
                        "type": giftcardweb.dns.type,
                        "content": locationData.providers[locationData.working_providers[x]].address,
                        "ttl": giftcardweb.dns.ttl,
                        "state": state
                    });
                }
                if (record.bmscardweb && !record.bmscardweb.location) {
                    allDnsRecords.push({
                        "domain": record.dns.domain,
                        "subdomain": record.dns.name,
                        "type": bmscardweb.dns.type,
                        "content": locationData.providers[locationData.working_providers[x]].address,
                        "ttl": bmscardweb.dns.ttl,
                        "state": state
                    });
                }
            });
        }
        return allDnsRecords;
    },

    async getDnsConfig(name) {
        let partnerDnsRecords = [];
        let partnerConfig = await queries.getOne(name);
        let bps = await queries.getDefaults('bps');
        let beniobms = await queries.getDefaults('beniobms');
        let bmscardweb = await queries.getDefaults('bmscardweb');
        let giftcardweb = await queries.getDefaults('giftcardweb');
        let locationData = await queries.getLocationData(partnerConfig.location);
        for (let x in locationData.working_providers) {
            let state = (x > 0) ? 'add' : 'present';
            let bpsDnsName = partnerConfig.bps.name || partnerConfig.dns.name;
            let bpsDnsSubdomain = partnerConfig.bps.subdomain || partnerConfig.dns.subdomain;
            partnerDnsRecords.push({
                "domain": partnerConfig.dns.domain,
                "subdomain": bpsDnsName + '.' + bpsDnsSubdomain,
                "type": bps.dns.type,
                "content": locationData.providers[locationData.working_providers[x]].address,
                "ttl": bps.dns.ttl,
                "state": state
            });
            if (partnerConfig.beniobms) {
                let beniobmsDnsName = partnerConfig.beniobms.name || partnerConfig.dns.name;
                let beniobmsDnsSubdomain = partnerConfig.beniobms.subdomain || partnerConfig.dns.subdomain;
                partnerDnsRecords.push({
                    "domain": partnerConfig.dns.domain,
                    "subdomain": beniobmsDnsName + '.' + beniobmsDnsSubdomain,
                    "type": beniobms.dns.type,
                    "content": locationData.providers[locationData.working_providers[x]].address,
                    "ttl": beniobms.dns.ttl,
                    "state": state
                });
            }
            if (partnerConfig.giftcardweb) {
                let giftcardwebDnsName = partnerConfig.giftcardweb.name || partnerConfig.dns.name;
                let giftcardwebDnsSubdomain = partnerConfig.giftcardweb.subdomain || partnerConfig.dns.subdomain;
                partnerDnsRecords.push({
                    "domain": partnerConfig.dns.domain,
                    "subdomain": giftcardwebDnsName + '.' + giftcardwebDnsSubdomain,
                    "type": giftcardweb.dns.type,
                    "content": locationData.providers[locationData.working_providers[x]].address,
                    "ttl": giftcardweb.dns.ttl,
                    "state": state
                });
            }
            if (partnerConfig.bmscardweb && !partnerConfig.bmscardweb.location) {
                partnerDnsRecords.push({
                    "domain": partnerConfig.dns.domain,
                    "subdomain": partnerConfig.dns.name,
                    "type": bmscardweb.dns.type,
                    "content": locationData.providers[locationData.working_providers[x]].address,
                    "ttl": bmscardweb.dns.ttl,
                    "state": state
                });
            }
        }
        return partnerDnsRecords;
    },

    async getBmscardwebList() {
        let list = [];
        let bmscardwebList = [];

        // Getting partners configs where defined bmscardweb module
        list = await queries.getAllBmscardweb();

        // Getting list of all partners with bmscardweb module
        let all = list.map( config => {
            return config.name;
        });
        bmscardwebList.push({
            'bmscardweb' : 'all',
            'names' : all
        });

        // Getting all locations and putting the list of bmscardweb in each location
        let locations = list.map( config => {
            return config.bmscardweb.location || config.location;
        });
        locations = Array.from(new Set(locations));
        locations.forEach( location => {
            let filteredList = list.filter( config => {
                let currentLocation = config.bmscardweb.location || config.location;
                return currentLocation === location;
            });
            let namesArr = [];
            filteredList.forEach( config => {
                namesArr = namesArr.concat(config.bmscardweb.name)
            });
            bmscardwebList.push({
                'location' : location,
                'names' : namesArr
            });
        });

        // Getting all placements and putting the list of beniobms in each placement
        let placements = list.map( config => {
            return config.bmscardweb.placement;
        });
        placements = Array.from(new Set(placements));
        placements.forEach( placement => {
            let filteredList = list.filter( config => {
                return config.bmscardweb.placement === placement;
            });
            let namesArr = [];
            filteredList.forEach( config => {
                namesArr = namesArr.concat(config.bmscardweb.name)
            });
            bmscardwebList.push({
                'placement' : placement,
                'names' : namesArr
            });
        });

        // Returning result
        return bmscardwebList;
    },

    async getBmscardwebConfig(name) {
        let parentConfig, childConfig;
        let config = await queries.getOneBmscardweb(name);
        if (!config) {
            return notFoundError;
        } else if (!config.coalition) {
            childConfig = config;
            parentConfig = config;
        } else {
            childConfig = config;
            parentConfig = await queries.getOneBmscardweb(config.coalition.name);
        }
        let webConfig = {};
        let currentLocation = childConfig.bmscardweb.location || parentConfig.location;
        let currentPlacement = childConfig.bmscardweb.placement || parentConfig.placement;
        let webData = await queries.getWebData(name);
        let bmscardweb = await queries.getDefaults('bmscardweb');
        let deployhost = await queries.getDeployHost(currentLocation, currentPlacement);
        let basePorts = await queries.getDefaults('baseports');
        let basePort = basePorts.ports[parentConfig.bmscardweb.placement][parentConfig.type].port;
        webConfig.name = name;
        webConfig.namespace = parentConfig.name;
        webConfig.description = childConfig.description;
        webConfig.colorAccent = webData.color1;
        webConfig.colorPrimary = webData.color2;
        webConfig.bmscardwebUrl = 'https://' + childConfig.bmscardweb.name + '.' + parentConfig.dns.domain;
        webConfig.bmscardwebPort = childConfig.bmscardweb.port || basePort + parentConfig.loyalty_id * 20 + bmscardweb.service_id;
        webConfig.bmscardwebBuild = bmscardweb.build;
        webConfig.bmscardwebDeployhost = deployhost.hostname;
        return webConfig;
    },

    async getOracleData(name) {
        const placement = await queries.getPlacement(name);
        const projects = await queries.getProjectsInPlacement(name);
        if (!projects.length) {
            return notFoundError;
        } else {
            const projectNames = projects.map( project => {
                return project.name;
            });
            return {
                "name": name,
                "oracle_url": placement.address + ':' + placement.oracle_port + '/' + placement.oracle_sid,
                "oracle_sid": placement.oracle_sid,
                "sys_password": placement.sys_password,
                "projects": projectNames
            }
        }
    },

    async getLoyaltyId(name) {
        let loyaltyId = await queries.getLoyaltyId(name);
        return {
            "name" : name,
            "loyalty_id" : loyaltyId.loyalty_id,
            "type" : loyaltyId.type
        }
    },

    async getAllProjectIds() {
        const allProjectsIdData = await queries.getAllProjectsId();
        const allProjectsId = allProjectsIdData.map( config => {
            return {
                "name": config.name,
                "project_id": config.projectID
            }
        });
        return allProjectsId;
    },

    async getProjectId(name) {
        let projectIdData = await queries.getProjectId(name);
        if (!projectIdData) {
            return notFoundError;
        } else {
            return {
                "name": name,
                "description": projectIdData.description,
                "project_id": projectIdData.projectID
            }
        }
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
        let usersSpaceData = await oracle.sqlRequest(initialData, sqlQuery);
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
