const express = require('express');

const app = express();

loyalty30 = process.env.LOYALTY_30 || 'Enabled'

const router = require('./router');
app.use(router);

if (loyalty30 === 'Enabled') {
    const loyaltyRouter = require('./router/loyalty30')
    app.use(loyaltyRouter);
}

app.use(express.static('public'));

app.listen(8080, (err) => {
    if (err) console.log(err);
    console.log('Server has been started');
});
