const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoConn = require('./db/mongodb');

const configsSchema = new Schema();

// loyalty30 Enabled/Disabled
loyalty30 = process.env.LOYALTY_30 || 'Enabled'

let loyaltyConn;

if (loyalty30 === 'Enabled') {
    loyaltyConn = require('../loyalty/db/mongodb');
}

const queries = {

    async getAll () {
        let result = [];
        const Total = mongoConn.model('getAll', configsSchema, 'configs');
        result = await Total.find({
            $or: [
                {'type': 'regular'},
                {'type': 'loyalty30'}
            ]}, function (err) {
//        result = await Total.find( { "test" : true }, function (err, doc){
            if (err) return console.log(err);
        }).sort({'name': 1}).lean();
        return result;
    },

    async getOne (name) {
        const Config = mongoConn.model('getOne', configsSchema, 'configs');
        let result = await Config.findOne({'name': name}, function (err) {
            if (err) return console.log(err);
        }).lean();
        return result;
    },

    async getAllBeniobms() {
        const allBeniobms = mongoConn.model('allBeniobms', configsSchema, 'configs');
        let result = await allBeniobms.find(
            { 'beniobms' : { $exists: true} },
            'loyalty_id type name location description database dns beniobms',
            function (err) {
            if (err) return console.log(err);
        }).sort({ 'name': 1 }).lean();
        return result;
    },

    async getOneBeniobms(name) {
        const oneBeniobms = mongoConn.model('oneBeniobms', configsSchema, 'configs');
        let result = await oneBeniobms.findOne(
            { 'name': name, 'beniobms' : { $exists: true} },
            'loyalty_id type name location description database dns beniobms',
            function (err) {
            if (err) return console.log(err);
        }).lean();
        return result;
    },

    async getAllBmscardweb() {
        const allBmscardweb = mongoConn.model('allBmscardweb', configsSchema, 'configs');
        let result = await allBmscardweb.find(
            { 'bmscardweb' : { $exists: true} },
            'loyalty_id type name location description dns bmscardweb',
            function (err) {
                if (err) return console.log(err);
            }).sort({ 'name': 1 }).lean();
        return result;
    },

    async getOneBmscardweb(name) {
        const oneBmscardweb = mongoConn.model('oneBeniobms', configsSchema, 'configs');
        let result = await oneBmscardweb.findOne(
            { 'name': name, 'bmscardweb' : { $exists: true} },
            'loyalty_id type name location description dns bmscardweb coalition',
            function (err) {
                if (err) return console.log(err);
            }).lean();
        return result;
    },

    async getOneGiftcardweb(name) {
        const oneGiftcardweb = mongoConn.model('oneGiftcardweb', configsSchema, 'configs');
        let result = await oneGiftcardweb.findOne(
            { 'name': name, 'giftcardweb' : { $exists: true} },
            'loyalty_id type name location description dns giftcardweb',
            function (err) {
                if (err) return console.log(err);
            }).lean();
        return result;
    },

    async getAllMobileback() {
        const allMobileback = mongoConn.model('allMobileback', configsSchema, 'configs');
        let result = await allMobileback.find(
            { 'mobileback' : { $exists: true} },
            'loyalty_id type name location description dns mobileback',
            function (err) {
                if (err) return console.log(err);
            }).sort({ 'name': 1 }).lean();
        return result;
    },

    async getOneMobileback(name) {
        const oneMobileback = mongoConn.model('oneMobileback', configsSchema, 'configs');
        let result = await oneMobileback.findOne(
            { 'name': name, 'mobileback' : { $exists: true} },
            'loyalty_id type name location description dns mobileback coalition projectID',
            function (err) {
                if (err) return console.log(err);
            }).lean();
        return result;
    },

    async getOneBps(name) {
        const oneBps = mongoConn.model('oneBps', configsSchema, 'configs');
        let result = await oneBps.findOne(
            { 'name': name, 'bps' : { $exists: true} },
            'loyalty_id type name location description dns bps cards',
            function (err) {
                if (err) return console.log(err);
            }).lean();
        return result;
    },

    async getByLocation(location) {
        const Partners = mongoConn.model('', configsSchema, 'configs');
        let result = await Partners.find(
            { 'location': location },
            'name dns bps beniobms giftcardweb bmscardweb',
            function (err) {
                if (err) return console.log(err);
            }).sort({ 'name': 1 }).lean();
        return result;
    },

    async getAllLocations() {
        const allLocations = mongoConn.model('allLocations', configsSchema, 'locations');
        let result = await allLocations.find( function (err) {
            if (err) return console.log(err);
        }).lean();
        return result;
    },

    async getLocationData(location) {
      const locationData = mongoConn.model('locationData', configsSchema, 'locations');
      let result = await locationData.findOne( { 'location': location }, function (err) {
              if (err) return console.log(err);
          }).lean();
      return result;
    },

    async getStatSender() {
        let result = [];
        const Stats = mongoConn.model('statSender', configsSchema, 'configs');
        result = await Stats.find({ 'subscription' : false, 'inProd' : true }, function (err){
            if(err) return console.log(err);
        }).sort({ 'name' : 1 }).lean();
        return result;
    },

    async getcardsranges() {
        let result = [];
        const Cards = mongoConn.model('', configsSchema, 'configs');
        result = await Cards.find({ 'cards' : { $exists: true } }, function (err){
            if(err) return console.log(err);
        }).sort({ 'cards.max' : 1 }).lean();
        return result;
    },

    async getDefaults(purpose) {
        const Defaults = mongoConn.model('defaults', configsSchema, 'defaults');
        let result = await Defaults.findOne({ 'purpose' : purpose }, '',function (err){
            if(err) return console.log(err);
        }).lean();
        return result;
    },

    async getPlacement(name) {
        const Placement = mongoConn.model('placement', configsSchema, 'placements');
        let result = await Placement.findOne({ 'hostname' : name }, function (err){
            if(err) return console.log(err);
        }).lean();
        return result;
    },

    async getProjectsInPlacement(host) {
        const Projects = mongoConn.model('projects', configsSchema, 'configs');
        let result = await Projects.find({'database.host' : host, 'coalition' : { $exists: false } }, 'name',function (err) {
            if (err) return console.log(err);
        }).sort({'name': 1}).lean();
        return result;
    },

    async getAllDbPlacements() {
        const Placements = mongoConn.model('alldbplacements', configsSchema, 'placements');
        let result = await Placements.find({ 'oracle_sid' : { $exists: true } }, function (err) {
            if (err) return console.log(err);
        }).sort({'hostname': 1}).lean();
        return result;
    },

    async getLoyaltyId(name) {
        const LoyaltyId = mongoConn.model('loyalty_id', configsSchema, 'configs');
        let result = await LoyaltyId.findOne({ 'name' : name }, 'loyalty_id type', function (err){
            if(err) return console.log(err);
        }).lean();
        return result;
    },

    async getAllProjectsId() {
        const AllProjectsId = mongoConn.model('projectID', configsSchema, 'configs');
        let result = await AllProjectsId.find({ 'projectID' : { $exists: true } }, 'name projectID', function (err) {
            if (err) return console.log(err);
        }).sort({'name': 1}).lean();
        return result;
    },

    async getProjectId(name) {
        const ProjectId = mongoConn.model('projectID', configsSchema, 'configs');
        let result = await ProjectId.findOne({ 'name': name }, 'description projectID', function (err) {
            if (err) return console.log(err);
        }).lean();
        return result;
    },

    async getWebData(name) {
        let webData = {
            'name' : name,
            'color1' : null,
            'color2' : null
        };
        if (loyalty30 === 'Enabled') {
            const loyaltyData = loyaltyConn.model('getWebData', configsSchema, 'users');
            let result = await loyaltyData.findOne({'site': name}, 'color1 color2 name', function (err) {
                if (err) return console.log(err);
            }).lean();
            if (!result) {
                console.log(`Data for bmscardweb ${name} was not found in loyalty database`)
            } else {
                webData = result;
            }
        }
        return webData;
    },

    async readInfrastructure(location, placement, role) {
        const infrastructureData = mongoConn.model('infrastructure', configsSchema, 'infrastructure');
        let result = await infrastructureData.find( { 'location': location, 'belongs': placement }, function (err){
            if(err) return console.log(err);
        }).lean();
        return result;
    },

    async getDeployHost(location, placement) {
        const Placement = mongoConn.model('placement', configsSchema, 'placements');
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
