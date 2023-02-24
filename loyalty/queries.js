const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const loyaltyConn = require('./db/mongodb');
const mongoConn = require('../assets/db/mongodb');
const partnerSchema = require('../db/schemes/partner');

const Partner = mongoConn.model('Partner', partnerSchema, 'configs');

const configsSchema = new Schema();
const updateScheme = new Schema();

const queries = {

    async getAll () {
        const Total = mongoConn.model('allConfigs', configsSchema, 'configs');
        return await Total.find({
            $or: [
                { 'type': 'regular' },
                { 'type': 'loyalty30' }
            ]
        }).sort({ 'name': 1 }).lean();
    },

    async getLastID(type) {
        const LastId = mongoConn.model('getLastId', configsSchema, 'configs');
        let result = await LastId.find({
            'type': type,
            'loyalty_id': { $exists: true }
          }).sort({ 'loyalty_id': -1 }).lean();
        if (!result[0]) {
            return 0;
        } else {
            return result[0].loyalty_id;
        }
    },

    async savePartner (name, partner, currentDate) {
        let newpartner = new Partner(partner);
        newpartner.save();
        console.log(currentDate, '- Saved new partner:', name);
    },

    async getNewPartner () {
        return await Partner.findOne({
            'stage': 'new'
          },
            'name'
        ).lean();
    },

    async getNewStatus () {
        return await Partner.findOne({
            $or: [
                { 'stage': 'to_block' },
                { 'stage': 'to_unblock' }
            ]
          },
            'name'
        ).lean();
    },

    async getStage (name) {
      const Stage = mongoConn.model('getStage', updateScheme, 'configs');
      return await Stage.findOne({
          'name': name
        },
          'stage'
      ).lean();
    },

    async updateStage (name, stage) {
        const stageUpdate = mongoConn.model('updateStage', updateScheme, 'configs');
        return await stageUpdate.findOneAndUpdate(
            { 'name': name },
            { 'stage': stage },
          {
            strict: false,
            new: true,
            upsert: true
          }).lean();
    },

    async getLoyaltyData (name) {
        const loyaltyData = loyaltyConn.model('getLoyaltyData', configsSchema, 'users');
        return await loyaltyData.findOne({
            'site': name
          }).lean();
    },

}

module.exports = queries;
