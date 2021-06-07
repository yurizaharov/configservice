const functions = require('../loyalty/functions')
const queries = require('../loyalty/queries')

module.exports = {

    newpartner: async function (name, colorPrimary, colorAccent) {
        let currentDate = new Date().toLocaleString('ru-RU');
        return await queries.newpartner(name, colorPrimary, colorAccent, currentDate);
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