const express = require('express');
const router = express.Router();

const fs = require('fs');
const configFolder = './configs/';

const getversion = require('../functions/getversion.js');

router
    .use(function timeLog(req, res, next) {
        if(req.url != "/ping") {
            console.log(Date.now(), '-', req.headers['x-real-ip'], '-', req.url)
        }
        next();
    })

    .get('/ping', function(req, res) {
        res.send('Liquicheck');
    })

    .get('/liqui', async (req, res) => {
        let accessCreds = [];
        fs.readdirSync(configFolder).forEach(file => {
            let arrayOfParts = file.split(".");
            let dataBase = arrayOfParts[0]
            let rawData = fs.readFileSync(configFolder+'/'+file);
            let Creds = JSON.parse(rawData);
            accessCreds.push( {"dataBase" : dataBase, "user" : Creds.user, "password" : Creds.password, "connectString" : Creds.connectString} )
            return accessCreds;
            });

        let currentPatches = await getversion(accessCreds)

        res
            .status(200)
            .send(currentPatches)
    })

module.exports = router;
