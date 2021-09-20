require('../db/mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const loyaltyConn = require('../db/mongodb')

const partnerScheme = new Schema({
    loyalty_id: Number,
    type: String,
    name: String,
    description: String,
    subscription: Boolean,
    stage: String,
    inProd: Boolean,
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
    }
});

const Partner = mongoose.model('Partner', partnerScheme, 'configs');

const configsSchema = new Schema();
const updateScheme = new Schema();

const queries = {

    async getall () {
        let result = [];
        const Total = mongoose.model('allConfigs', configsSchema, 'configs');
        result = await Total.find({ 'type' : { $exists: true } }, function (err, doc) {
            if (err) return console.log(err);
        }).sort({'name': 1}).lean();
        return result;
    },

    async getlastid (type) {
        let result = [];
        const LastId = mongoose.model('getLastId', configsSchema, 'configs');
        result = await LastId.find({ 'type' : type, 'loyalty_id' : { $exists: true } }, function (err, doc) {
            if (err) return console.log(err);
        }).sort({'loyalty_id': -1}).lean();
        if (!result[0]) {
            return 0;
        } else {
            return result[0].loyalty_id;
        }
    },

    async savepartner (name, partner, currentDate) {
        let newpartner = new Partner(partner);
        newpartner.save(function (err) {
            if (err) return console.log(err);
        console.log(currentDate, '- Saved new partner:', name);
        });
    },

    async getnewpartner () {
        let result = [];
        result = await Partner.findOne({ 'stage' : 'new' }, 'name', function (err){
            if(err) return console.log(err);
        }).lean();
        return result;
    },

    async updateStage (name, stage) {
        const stageUpdate = mongoose.model('updateStage', updateScheme, 'configs');
        let result = await stageUpdate.findOneAndUpdate({ 'name': name },
            {'stage': stage},
            {
            strict: false,
            new: true,
            upsert: true
            }).lean();

        return result;
    },

    async getLoyaltyData (name) {
        const loyaltyData = loyaltyConn.model('getLoyaltyData', configsSchema, 'users');
        let result = await loyaltyData.findOne({ 'site': name }, '', function (err){
                if(err) return console.log(err);
            }).lean();

        return result;
    },

}

module.exports = queries;
