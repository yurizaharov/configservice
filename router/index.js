const express = require('express');
const router = express.Router();

const getversion = require('../functions/getversion.js');
const getinitialdata = require('../functions/getinitialdata.js');
const getservicesdata = require('../functions/getservicesdata.js');

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
        let initialData = await getinitialdata()
        let currentPatches = await getversion(initialData)
        res
            .status(200)
            .send(currentPatches)
    })

    .get('/info', async (req,res) => {
        let initialData = await getinitialdata()
        let servicesData= await getservicesdata(initialData)
        res
            .status(200)
            .send(servicesData);
    })

module.exports = router;
