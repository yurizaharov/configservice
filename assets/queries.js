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
            result = await Total.find({ 'type' : { $exists: true } }, function (err) {
//            result = await Total.find( { "test" : true }, function (err, doc){
                if (err) return console.log(err);
            }).sort({'name': 1}).lean();
        } else {
            result = await Total.find({'name': name}, function (err) {
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

    async getAllBeniobms() {
        const allBeniobms = mongoose.model('allBeniobms', configsSchema, 'configs');
        let result = await allBeniobms.find(
            { 'beniobms' : { $exists: true} },
            'loyalty_id type name location description database dns beniobms',
            function (err) {
            if (err) return console.log(err);
        }).sort({ 'name': 1 }).lean();
        return result;
    },

    async getOneBeniobms(name) {
        const oneBeniobms = mongoose.model('oneBeniobms', configsSchema, 'configs');
        let result = await oneBeniobms.findOne(
            { 'name': name, 'beniobms' : { $exists: true} },
            'loyalty_id type name location description database dns beniobms',
            function (err) {
            if (err) return console.log(err);
        }).lean();
        return result;
    },

    async getAllBmscardweb() {
        const allBmscardweb = mongoose.model('allBmscardweb', configsSchema, 'configs');
        let result = await allBmscardweb.find(
            { 'bmscardweb' : { $exists: true} },
            'loyalty_id type name location description dns bmscardweb',
            function (err) {
                if (err) return console.log(err);
            }).sort({ 'name': 1 }).lean();
        return result;
    },

    async getOneBmscardweb(name) {
        const oneBmscardweb = mongoose.model('oneBeniobms', configsSchema, 'configs');
        let result = await oneBmscardweb.findOne(
            { 'name': name, 'bmscardweb' : { $exists: true} },
            'loyalty_id type name location description dns bmscardweb',
            function (err) {
                if (err) return console.log(err);
            }).lean();
        return result;
    },

    async getOneGiftcardweb(name) {
        const oneGiftcardweb = mongoose.model('oneGiftcardweb', configsSchema, 'configs');
        let result = await oneGiftcardweb.findOne(
            { 'name': name, 'giftcardweb' : { $exists: true} },
            'loyalty_id type name location description dns giftcardweb',
            function (err) {
                if (err) return console.log(err);
            }).lean();
        return result;
    },

    async getAllMobileback() {
        const allMobileback = mongoose.model('allMobileback', configsSchema, 'configs');
        let result = await allMobileback.find(
            { 'mobileback' : { $exists: true} },
            'loyalty_id type name location description dns mobileback',
            function (err) {
                if (err) return console.log(err);
            }).sort({ 'name': 1 }).lean();
        return result;
    },

    async getOneMobileback(name) {
        const oneMobileback = mongoose.model('oneMobileback', configsSchema, 'configs');
        let result = await oneMobileback.findOne(
            { 'name': name, 'mobileback' : { $exists: true} },
            'loyalty_id type name location description dns mobileback',
            function (err) {
                if (err) return console.log(err);
            }).lean();
        return result;
    },

    async getOneBps(name) {
        const oneBps = mongoose.model('oneBps', configsSchema, 'configs');
        let result = await oneBps.findOne(
            { 'name': name, 'bps' : { $exists: true} },
            'loyalty_id type name location description dns bps cards',
            function (err) {
                if (err) return console.log(err);
            }).lean();
        return result;
    },

    async getByLocation(location) {
        const Partners = mongoose.model('', configsSchema, 'configs');
        let result = await Partners.find(
            { 'location': location },
            'name dns bps beniobms giftcardweb bmscardweb',
            function (err) {
                if (err) return console.log(err);
            }).sort({ 'name': 1 }).lean();
        return result;
    },

    async getLocationData(location) {
      const locationData = mongoose.model('locationData', configsSchema, 'locations');
      let result = await locationData.findOne( { 'location': location }, function (err) {
              if (err) return console.log(err);
          }).lean();
      return result;
    },

    async getStatSender() {
        let result = [];
        const Stats = mongoose.model('', configsSchema, 'configs');
        result = await Stats.find({ 'subscription' : false, 'inProd' : true }, function (err){
            if(err) return console.log(err);
        }).sort({ 'name' : 1 }).lean();
        return result;
    },

    async getcardsranges() {
        let result = [];
        const Cards = mongoose.model('', configsSchema, 'configs');
        result = await Cards.find({ 'cards' : { $exists: true } }, function (err){
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
        let result = await Placement.findOne({ 'hostname' : name }, function (err){
            if(err) return console.log(err);
        }).lean();
        return result;
    },

    async getProjectsInPlacement(host) {
        const Projects = mongoose.model('projects', configsSchema, 'configs');
        let result = await Projects.find({'database.host' : host }, 'name',function (err) {
            if (err) return console.log(err);
        }).sort({'name': 1}).lean();
        return result;
    },

    async getAllDbPlacements() {
        const Placements = mongoose.model('alldbplacements', configsSchema, 'placements');
        let result = await Placements.find({ 'oracle_sid' : { $exists: true } }, function (err) {
            if (err) return console.log(err);
        }).sort({'hostname': 1}).lean();
        return result;
    },

    async getLoyaltyId(name) {
        const LoyaltyId = mongoose.model('loyalty_id', configsSchema, 'configs');
        let result = await LoyaltyId.findOne({ 'name' : name }, 'loyalty_id type', function (err){
            if(err) return console.log(err);
        }).lean();
        return result;
    },

    async getAllProjectsId() {
        const AllProjectsId = mongoose.model('projectID', configsSchema, 'configs');
        let result = await AllProjectsId.find({ 'projectID' : { $exists: true } }, 'name projectID', function (err) {
            if (err) return console.log(err);
        }).sort({'name': 1}).lean();
        return result;
    },

    async getProjectId(name) {
        const ProjectId = mongoose.model('projectID', configsSchema, 'configs');
        let result = await ProjectId.findOne({ 'name': name }, 'projectID', function (err) {
            if (err) return console.log(err);
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
