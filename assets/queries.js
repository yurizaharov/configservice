require('../db/mongodb');
const mongoose = require('mongoose');
const loyaltyConn = require('../db/mongodb');
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

    async getOne (name) {
        const Config = mongoose.model('getOne', configsSchema, 'configs');
        let result = await Config.findOne({'name': name}, function (err) {
            if (err) return console.log(err);
        }).lean();
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
        let result = await Defaults.findOne({ 'purpose' : purpose }, '',function (err){
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

    async getAllDbPlacements() {
        const Placements = mongoose.model('alldbplacements', configsSchema, 'placements');
        let result = await Placements.find({ 'oracle_sid' : { $exists: true } }, function (err) {
            if (err) return console.log(err);
        }).sort({'name': 1}).lean();
        return result;
    },

    async getLoyaltyId(name) {
        const LoyaltyId = mongoose.model('loyalty_id', configsSchema, 'configs');
        let result = await LoyaltyId.findOne({ 'name' : name }, 'loyalty_id type', function (err){
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

    async getWebData(name) {
        const loyaltyData = loyaltyConn.model('getWebData', configsSchema, 'users');
        let result = await loyaltyData.findOne({ 'site': name }, 'color1 color2 name', function (err){
            if(err) return console.log(err);
        }).lean();
        if (!result) {
            return {
                'name' : null,
                'color1' : null,
                "color2" : null
            }
        }
        return result;
    },

    async getBmscardweb() {
        const webList = mongoose.model('webList', configsSchema, 'configs');
        let result = await webList.find( { 'bmscardweb' : { $exists: true } }, 'bmscardweb', function (err){
            if(err) return console.log(err);
        }).lean();
        return result;
    },

    async readInfrastructure(location, placement, role) {
        const infrastructureData = mongoose.model('infrastructure', configsSchema, 'infrastructure');
        let result = await infrastructureData.find( { 'location': location, 'belongs': placement }, function (err){
            if(err) return console.log(err);
        }).lean();
        return result;
    },

    async getDeployHost(location, placement) {
        const Placement = mongoose.model('placement', configsSchema, 'placements');
        let result = await Placement.findOne(
            { 'deployhost' : true, 'location' : location, 'placement' : placement },
            'hostname',
            function (err){
            if(err) return console.log(err);
        }).lean();
        return result;
    },

}

module.exports = queries;
