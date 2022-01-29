const express = require('express');
const jsonParser = express.json();
const router = express.Router();
const methods = require('../assets/methods')
const loyalty = require('../loyalty/methods')

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

    .post("/api/loyalty/newloyalty30", jsonParser, async function (req, res) {
        if(!req.body || !req.body.name) return res.sendStatus(400);
        let sendResult = await loyalty.newPartner('loyalty30', req.body.name, req.body.description, req.body.modules);
        console.log(sendResult)
        const resData = {
            "code": 0,
            "status": "success"
        }
        res
            .status(200)
            .send(resData);
    })

    .post("/api/loyalty/newregular", jsonParser, async function (req, res) {
        if(!req.body || !req.body.name) return res.sendStatus(400);
        let sendResult = await loyalty.newPartner('regular', req.body.name, req.body.description, req.body.modules);
        console.log(sendResult)
        const resData = {
            "code": 0,
            "status": "success"
        }
        res
            .status(200)
            .send(resData);
    })

    .post("/api/loyalty/setstatus", jsonParser, async function (req,res) {
        if(!req.body || !req.body.name || !req.body.action) return res.sendStatus(400);
        let sendResult = await loyalty.setStatus(req.body.name, req.body.action);
        console.log(sendResult)
        res
            .status(200)
            .send(sendResult);
    })

    .get("/api/loyalty/checknewstatus", async function (req, res) {
        let result = await loyalty.getNewStatus();
        res
            .status(200)
            .send(result);
    })

    .get("/api/loyalty/checknew", async function (req, res) {
        let result = await loyalty.getNewPartner();
        res
            .status(200)
            .send(result);
    })

    .get("/api/loyalty/getallnames", async function (req, res) {
        let result = await loyalty.getAllNames()
        res
            .status(200)
            .send(result);
    })

    .post("/api/loyalty/deployment", jsonParser, async function (req, res) {
        if(!req.body || !req.body.stage || !req.body.name) return res.sendStatus(400);
        let result = await loyalty.updateStage(req.body.name, req.body.stage);
        res
            .status(200)
            .send(result);
    })

    .get("/api/loyalty/data/:name", async function (req, res) {
        const name = req.params.name;
        let result = await loyalty.getLoyaltyData(name)
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
