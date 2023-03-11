const express = require('express');
const logger = require('./common/logger');

const app = express();

loyalty30 = process.env.LOYALTY_30 || 'Enabled'

const metrics = require('./router/metrics');
app.use(metrics);

const router = require('./router');
app.use(router);

if (loyalty30 === 'Enabled') {
    const loyaltyRouter = require('./router/loyalty30')
    app.use(loyaltyRouter);
}

app.use(express.static('public'));

app.listen(8080, (err) => {
    if (err) logger.error(err);
    logger.info('Server has been started');
});
