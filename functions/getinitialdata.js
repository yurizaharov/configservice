const fs = require('fs');
const configFolder = './configs/';

function getinitialdata() {
    let initialData = [];

    fs.readdirSync(configFolder).forEach(file => {
        let arrayOfParts = file.split(".");
        let dataBase = arrayOfParts[0]
        let rawData = fs.readFileSync(configFolder+'/'+file);
        let Data = JSON.parse(rawData);
        initialData.push({
            "dataBase" : dataBase,
            "user" : Data.user,
            "password" : Data.password,
            "connectString" : Data.connectString,
            "processingExt" : Data.processingExt,
            "processingInt" : Data.processingInt,
            "mobileExt" : Data.mobileExt,
            "mobileInt" : Data.mobileInt
        })
    });
    return initialData;
}

module.exports = getinitialdata;
