const express = require('express');
const jsonParser = express.json();
const router = express.Router();
const methods = require('../assets/methods')
const logger = require('../common/logger');

router
    .use(function timeLog(req, res, next) {
        if(req.url !== "/ping") {
            logger.info('%s - %s', req.headers['x-real-ip'], req.url);
        }
        next();
    })

    .get('/ping', function(req, res) {
        res
            .status(200)
            .send('ConfigService');
    })

    .get('/liquibeniobms', async (req, res) => {
        let result = await methods.liquiBeniobms();
        res
            .status(200)
            .send(result);
    })

    .get('/liquiprocessing', async (req,res) => {
        let result = await methods.liquiProcessing();
        res
            .status(200)
            .send(result);
    })

    .get('/api/configs/getall', async (req, res) => {
        let result = await methods.getallconfigs()
        res
            .status(200)
            .send(result);
    })

    .get('/api/configs/statsender', async (req, res) => {
        let result = await methods.getStatSenderConfigs()
        res
            .status(200)
            .send(result);
    })

    .get('/api/configs/bps', async (req, res) => {
        let result = await methods.getbpsconfigs()
        res
            .status(200)
            .send(result);
    })

    .get('/api/configs/bps/:name', async (req, res) => {
        const name = req.params.name;
        let result = await methods.getBpsConfig(name)
        res
            .status(200)
            .send(result);
    })

    .get('/api/configs/mobileback', async (req, res) => {
        let result = await methods.getMobilebackList()
        res
            .status(200)
            .send(result);
    })

    .get('/api/configs/mobileback/:name', async (req, res) => {
        const name = req.params.name;
        let result = await methods.getMobilebackConfig(name)
        res
            .status(200)
            .send(result);
    })

    .get('/api/configs/bmscardweb', async (req, res) => {
        let result = await methods.getBmscardwebList()
        res
            .status(200)
            .send(result);
    })

    .get('/api/configs/bmscardweb/:name', async (req, res) => {
        const name = req.params.name;
        let result = await methods.getBmscardwebConfig(name)
        res
            .status(200)
            .send(result);
    })

    .get('/api/configs/beniobms', async (req, res) => {
        let result = await methods.getBeniobmsList()
        res
            .status(200)
            .send(result);
    })

    .get('/api/configs/beniobms/:name', async (req, res) => {
        const name = req.params.name;
        let result = await methods.getBeniobmsConfig(name)
        res
            .status(200)
            .send(result);
    })

    .get('/api/configs/giftcardweb/:name', async (req, res) => {
        const name = req.params.name;
        let result = await methods.getGiftcardwebConfig(name)
        res
            .status(200)
            .send(result);
    })

    .get('/api/configs/extrapayment/:name', async (req, res) => {
        const name = req.params.name;
        let result = await methods.getExtrapaymentConfig(name)
        res
            .status(200)
            .send(result);
    })

    .get('/api/configs/database', async (req, res) => {
        let result = await methods.getdatabaseconfigs()
        res
            .status(200)
            .send(result);
    })

    .get('/api/configs/database/:name', async (req, res) => {
        const name = req.params.name;
        let result = await methods.getDatabaseConfig(name)
        res
            .status(200)
            .send(result);
    })

    .get('/api/configs/cards', async (req, res) => {
        let result = await methods.getcardsranges()
        res
            .status(200)
            .send(result);
    })

    .get('/api/configs/dns/:name', async (req, res) => {
        const name = req.params.name;
        let result = await methods.getDnsConfig(name)
        res
            .status(200)
            .send(result);
    })

    .get('/api/configs/dnsfailover/:location', async (req, res) => {
        const location = req.params.location;
        let result = await methods.getAllDnsRecords(location);
        res
            .status(200)
            .send(result);
    })

    .get('/api/configs/getloyaltyid/:name', async (req, res) => {
        const name = req.params.name;
        let result = await methods.getLoyaltyId(name)
        res
            .status(200)
            .send(result);
    })

    .get('/api/configs/getprojectid', async (req, res) => {
        let result = await methods.getAllProjectIds()
        res
            .status(200)
            .send(result);
    })

    .get('/api/configs/getprojectid/:name', async (req, res) => {
        const name = req.params.name;
        let result = await methods.getProjectId(name)
        res
            .status(200)
            .send(result);
    })

    .get('/api/configs/data/:name', async (req, res) => {
        const name = req.params.name;
        let result = await methods.getOracleData(name)
        res
            .status(200)
            .send(result);
    })

    .get("/api/monitoring/db/usersspace/:name", async function (req, res) {
        const name = req.params.name;
        let result = await methods.usersSpace(name)
        res
            .status(200)
            .send(result);
    })

    .post("/api/configs/infrastructure", jsonParser, async function (req, res) {
        let result = await methods.getInfrastructure(req.body);
        console.log(result)
        res
            .status(200)
            .send(result);
    })
module.exports = router;
