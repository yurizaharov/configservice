const express = require('express');
const metrics = express.Router();

const client = require('prom-client');
const register = new client.Registry();

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register });

metrics
    .get('/metrics', async (req, res) => {
        res
            .setHeader('Content-Type', register.contentType)
            .send(await register.metrics());
    })

module.exports = metrics;