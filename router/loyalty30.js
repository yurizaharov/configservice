const express = require('express');
const jsonParser = express.json();
const loyaltyRouter = express.Router();
const loyalty30 = require('../loyalty/methods')

loyaltyRouter
    .use(function timeLog(req, res, next) {
        if(req.url !== "/ping") {
            const currentDate = new Date().toLocaleString('ru-RU');
            console.log (currentDate, '-', req.connection.remoteAddress.split(':')[3], '-', req.url)
        }
        next();
    })

    .post("/api/loyalty/newloyalty30", jsonParser, async function (req, res) {
        if(!req.body || !req.body.name) return res.sendStatus(400);
        let sendResult = await loyalty30.newPartner('loyalty30', req.body.name, req.body.description, req.body.modules);
        console.log(sendResult);
        res
            .status(200)
            .send(sendResult);
    })

    .post("/api/loyalty/newregular", jsonParser, async function (req, res) {
        if(!req.body || !req.body.name) return res.sendStatus(400);
        let sendResult = await loyalty30.newPartner('regular', req.body.name, req.body.description, req.body.modules);
        console.log(sendResult);
        res
            .status(200)
            .send(sendResult);
    })

    .post("/api/loyalty/setstatus", jsonParser, async function (req,res) {
        if(!req.body || !req.body.name || !req.body.action) return res.sendStatus(400);
        let sendResult = await loyalty30.setStatus(req.body.name, req.body.action);
        console.log(sendResult);
        res
            .status(200)
            .send(sendResult);
    })

    .get("/api/loyalty/checknewstatus", async function (req, res) {
        let result = await loyalty30.getNewStatus();
        res
            .status(200)
            .send(result);
    })

    .get("/api/loyalty/checknew", async function (req, res) {
        let result = await loyalty30.getNewPartner();
        res
            .status(200)
            .send(result);
    })

    .get("/api/loyalty/getallnames", async function (req, res) {
        let result = await loyalty30.getAllNames()
        res
            .status(200)
            .send(result);
    })

    .post("/api/loyalty/deployment", jsonParser, async function (req, res) {
        if(!req.body || !req.body.stage || !req.body.name) return res.sendStatus(400);
        let result = await loyalty30.updateStage(req.body.name, req.body.stage);
        res
            .status(200)
            .send(result);
    })

    .get("/api/loyalty/data/:name", async function (req, res) {
        const name = req.params.name;
        let result = await loyalty30.getLoyaltyData(name)
        res
            .status(200)
            .send(result);
    })

module.exports = loyaltyRouter;
