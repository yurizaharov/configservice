const express = require('express');
const router = express.Router();
const {getallconfigs} = require('../functions/app.js')
const {getstatsenderconfigs} = require('../functions/app.js')
const {getliquicheckconfigs} = require('../functions/app.js')
const {getmobilebackconfigs} = require('../functions/app.js')
const {getbeniobmsconfigs} = require('../functions/app.js')

const getversion = require('../functions/getversion.js');
const getinitialdata = require('../functions/getinitialdata.js');
const getservicesdata = require('../functions/getservicesdata.js');
//const getbeniobmsdata = require('../functions/getbeniobmsdata.js');

router
    .use(function timeLog(req, res, next) {
        if(req.url !== "/ping") {
            const currentDate = new Date().toLocaleString('ru-RU');
            console.log (currentDate, '-', req.connection.remoteAddress.split(':')[3], '-', req.url)
        }
        next();
    })

    .get('/ping', function(req, res) {
        res
            .status(200)
            .send('ConfigService');
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

    .get('/beniobms', async (req,res) => {
        let initialData = await getinitialdata()
        let beniobmsData= await getbeniobmsdata(initialData)
        res
            .status(200)
            .send(beniobmsData);
    })

    .get('/api/configs/getall', async (req, res) => {
        let result = await getallconfigs()
        res
            .status(200)
            .send(result);
    })

    .get('/api/configs/liquicheck', async (req, res) => {
        let result = await getliquicheckconfigs()
        res
            .status(200)
            .send(result);
    })

    .get('/api/configs/statsender', async (req, res) => {
        let result = await getstatsenderconfigs()
        res
            .status(200)
            .send(result);
    })

    .get('/api/configs/mobileback', async (req, res) => {
        let result = await getmobilebackconfigs()
        res
            .status(200)
            .send(result);
    })

    .get('/api/configs/mobileback/:name', async (req, res) => {
        const name = req.params.name;
        let result = await getmobilebackconfigs(name)
        res
            .status(200)
            .send(result);
    })

    .get('/api/configs/beniobms', async (req, res) => {
        let result = await getbeniobmsconfigs()
        res
            .status(200)
            .send(result);
    })

module.exports = router;
