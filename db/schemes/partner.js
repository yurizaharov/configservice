const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const partnerSchema = new Schema({
    loyalty_id: Number,
    type: String,
    name: String,
    location: String,
    description: String,
    subscription: Boolean,
    stage: String,
    inProd: Boolean,
    projectID: String,
    database: {
        user: String,
        password: String,
        host: String
    },
    dns: {
        domain: String,
        subdomain: String,
        name: String
    },
    bps:{
        context: String,
        token: String,
        placement: String
    },
    cards: {
        min: String,
        max: String
    },
    mobileback: {
        context: String,
        token: String,
        placement: String
    },
    beniobms: {
        token: String,
        subdomain: String,
        placement: String
    },
    extrapayment: {
        placement: String
    },
    giftcardweb: {
        subdomain: String,
        placement: String
    },
    bmscardweb: {
        placement: String,
        names: Array
    }
});

module.exports = partnerSchema;