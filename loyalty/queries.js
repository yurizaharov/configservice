require('../db/mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const loyaltyConn = require('../db/mongodb');
const partnerSchema = require('../db/schemes/partner');

const Partner = mongoose.model('Partner', partnerSchema, 'configs');

const configsSchema = new Schema();
const updateScheme = new Schema();

const queries = {

    async getAll () {
        let result = [];
        const Total = mongoose.model('allConfigs', configsSchema, 'configs');
        result = await Total.find({ 'type' : { $exists: true } }, function (err) {
            if (err) return console.log(err);
        }).sort({'name': 1}).lean();
        return result;
    },

    async getLastID(type) {
        let result = [];
        const LastId = mongoose.model('getLastId', configsSchema, 'configs');
        result = await LastId.find({ 'type' : type, 'loyalty_id' : { $exists: true } }, function (err) {
            if (err) return console.log(err);
        }).sort({'loyalty_id': -1}).lean();
        if (!result[0]) {
            return 0;
        } else {
            return result[0].loyalty_id;
        }
    },

    async savePartner (name, partner, currentDate) {
        let newpartner = new Partner(partner);
        newpartner.save(function (err) {
            if (err) return console.log(err);
            console.log(currentDate, '- Saved new partner:', name);
        });
    },

    async getNewPartner () {
        let result = await Partner.findOne({ 'stage' : 'new' }, 'name', function (err){
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
