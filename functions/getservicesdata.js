const getpatch = require('../functions/getpatch.js');
const getprocessingversion = require('../functions/getprocessingversion.js');

async function getservicesdata(initialData) {
    let servicesData = [];
    for (let k = 0; k < initialData.length; k++) {

        let currentPatch = await getpatch(initialData[k])

        let processingVersion = await getprocessingversion(initialData[k])

        servicesData.push({
            "database" : initialData[k].dataBase,
            "id" : currentPatch,
            "processingext" : initialData[k].processingExt,
            "processingint" : initialData[k].processingInt,
            "mobileext" : initialData[k].mobileExt,
            "mobileint" : initialData[k].mobileInt,
            "processingversion" : processingVersion
        })
    }

    return servicesData;

}

module.exports = getservicesdata;
