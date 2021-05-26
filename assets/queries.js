require('../db/mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const configsSchema = new Schema();

const keyScheme = new Schema({
    registration_ids: String
});

const queries = {

    async getall (name) {
        let result = [];
        const Total = mongoose.model('', configsSchema, 'configs');
        if (!name) {
            result = await Total.find({}, function (err, doc) {
//            result = await Total.find( { "test" : true }, function (err, doc){
                if (err) return console.log(err);
            }).sort({'name': 1}).lean();
        } else {
            result = await Total.find({'name': name}, function (err, doc) {
                if (err) return console.log(err);
            }).lean();
        }
        return result;
    },

    async getstatsender() {
        let result = [];
        const Stats = mongoose.model('', configsSchema, 'configs');
        result = await Stats.find({ 'subscription' : false, 'inProd' : true }, function (err, doc){
            if(err) return console.log(err);
        }).sort({ 'name' : 1 }).lean();
        return result;
    },

    async getcardsranges() {
        let result = [];
        const Cards = mongoose.model('', configsSchema, 'configs');
        result = await Cards.find({ 'cards' : { $exists: true } }, function (err, doc){
            if(err) return console.log(err);
        }).sort({ 'cards.max' : 1 }).lean();
        return result;
    },

    async keystore(registration_ids) {
        const registrationIds = mongoose.model('registration_ids', keyScheme, 'registration_ids');
        let regId = new registrationIds({
            registration_ids: registration_ids
        });
        regId.save(function (err) {
            if (err) return console.log(err);
        });
    },

    async keyread() {
        let result = [];
        const registrationIds = mongoose.model('registration_ids', keyScheme, 'registration_ids');
        result = await registrationIds.findOne({}, function (err){
            if(err) return console.log(err);
        }).lean();
        return result.registration_ids;
    },

}

module.exports = queries;
