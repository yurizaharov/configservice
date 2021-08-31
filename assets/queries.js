require('../db/mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const configsSchema = new Schema();


const queries = {

    async getall (name) {
        let result = [];
        const Total = mongoose.model('', configsSchema, 'configs');
        if (!name) {
            result = await Total.find({ 'type' : { $exists: true } }, function (err, doc) {
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

    async getDefaults(purpose) {
        const Defaults = mongoose.model('defaults', configsSchema, 'defaults');
        let result = await Defaults.findOne({ 'purpose' : purpose }, function (err, doc){
            if(err) return console.log(err);
        }).lean();
        return result;
    },

    async getPlacement(name) {
        const Placement = mongoose.model('placement', configsSchema, 'placements');
        let result = await Placement.findOne({ 'name' : name }, function (err){
            if(err) return console.log(err);
        }).lean();
        return result;
    },

    async getProjectsInPlacement(placement) {
        const Projects = mongoose.model('projects', configsSchema, 'configs');
        let result = await Projects.find({'database.placement' : placement }, function (err) {
            if (err) return console.log(err);
        }).sort({'name': 1}).lean();
        return result;
    },

    async getLoyaltyId(name) {
        const LoyaltyId = mongoose.model('loyalty_id', configsSchema, 'configs');
        let result = await LoyaltyId.findOne({ 'name' : name }, 'loyalty_id', function (err){
            if(err) return console.log(err);
        }).lean();
        return result;
    },

    async getBundleIdData(name) {
        const BundleIdData = mongoose.model('bundleid', configsSchema, 'configs');
        let result = await BundleIdData.findOne( { 'mobile.bundleid' : name },'', function (err){
            if(err) return console.log(err);
        }).lean();
        return result;
    },

}

module.exports = queries;
