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
        connectString: String,
        placement: String
    },
    dns: {
        domain: String,
        subdomain: String,
        name: String
    },
    bps:{
        context: String,
        token: String,
        subdomain: String
    },
    cards: {
        min: String,
        max: String
    },
    mobile: {
        context: String,
        token: String,
        subdomain: String
    },
    beniobms: {
        token: String,
        subdomain: String
    },
    giftcardweb: {
        subdomain: String
    },
    bmscardweb: {
        placement: String,
        names: Array
    }
});

module.exports = partnerSchema;