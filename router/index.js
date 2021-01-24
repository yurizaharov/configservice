const express = require('express');
const router = express.Router();

const getversion = require('../functions/getversion.js');
const getconfigs = require('../functions/getconfigs.js');

router
    .use(function timeLog(req, res, next) {
        if(req.url != "/ping") {
            console.log(Date.now(), '-', req.connection.remoteAddress.split(':')[3], '-', req.url)
        }
        next();
    })

    .get('/ping', function(req, res) {
        res
            .status(200)
            .send('Liquicheck');
    })

    .get('/liqui', async (req, res) => {
        let accessCreds = await getconfigs()
        let currentPatches = await getversion(accessCreds)
        res
            .status(200)
            .send(currentPatches)
    })

module.exports = router;
