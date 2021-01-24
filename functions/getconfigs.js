const fs = require('fs');
const configFolder = './configs/';

function getconfigs() {
    let accessCreds = [];

    fs.readdirSync(configFolder).forEach(file => {
        let arrayOfParts = file.split(".");
        let dataBase = arrayOfParts[0]
        let rawData = fs.readFileSync(configFolder+'/'+file);
        let Creds = JSON.parse(rawData);
        accessCreds.push( {"dataBase" : dataBase, "user" : Creds.user, "password" : Creds.password, "connectString" : Creds.connectString} )
    });
    return accessCreds;
}

module.exports = getconfigs;
