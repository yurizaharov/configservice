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
        let result = await methods.liquibeniobms();
        res
            .status(200)
            .send(result);
    })

    .get('/liquiprocessing', async (req,res) => {
        let result = await methods.liquiprocessing();
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
        let result = await methods.getstatsenderconfigs()
        res
            .status(200)
            .send(result);
    })

    .get('/api/configs/mobileback', async (req, res) => {
        let result = await methods.getmobilebackconfigs()
        res
            .status(200)
            .send(result);
    })

    .get('/api/configs/mobileback/:name', async (req, res) => {
        const name = req.params.name;
        let result = await methods.getmobilebackconfigs(name)
        res
            .status(200)
            .send(result);
    })

    .get('/api/configs/beniobms', async (req, res) => {
        let result = await methods.getbeniobmsconfigs()
        res
            .status(200)
            .send(result);
    })

    .get('/api/configs/beniobms/:name', async (req, res) => {
        const name = req.params.name;
        let result = await methods.getbeniobmsconfigs(name)
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
        let result = await methods.getdatabaseconfigs(name)
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

    .post("/api/loyalty/new", jsonParser, async function (req, res) {
        if(!req.body || !req.body.name || !req.body.colorPrimary || !req.body.colorAccent) return res.sendStatus(400);
        let sendResult = await loyalty.newpartner(req.body.name, req.body.colorPrimary, req.body.colorAccent);
        console.log(sendResult)
        const resData = {
            "code": 0,
            "status": "success"
        }
        res
            .status(200)
            .send(resData);
    })

    .get("/api/loyalty/checknew", async function (req, res) {
        let result = await loyalty.getnewpartner()
        res
            .status(200)
            .send(result);
    })

    .get("/api/loyalty/getallnames", async function (req, res) {
        let result = await loyalty.getallnames()
        res
            .status(200)
            .send(result);
    })

    .post("/api/loyalty/deployment", jsonParser, async function (req, res) {
        if(!req.body || !req.body.stage || !req.body.name || !req.body.state) return res.sendStatus(400);
        let result = await loyalty.deployment(req.body.name, req.body.stage);
        res
            .status(200)
            .send(result);
    })

    .post("/api/key/store", jsonParser, async function (req, res) {
        if(!req.body || !req.body.registration_ids) return res.sendStatus(400);
        let result = await methods.keystore(req.body.registration_ids);
        res
            .status(200)
            .send(result);
    })

    .get("/api/key/read", jsonParser, async function (req, res) {
        let result = await methods.keyread();
        res
            .status(200)
            .send(result);
    })

module.exports = router;
