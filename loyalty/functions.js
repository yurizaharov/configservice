module.exports = {

    getDefaults: async function () {
        return {
            "dns" : {
                "domain" : "bms.group",
                "subdomain" : "srv"
            },
            "beniobms" : {
                "subdomain": "adb"
            }
        }
    }

}
