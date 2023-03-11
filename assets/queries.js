const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoConn = require('./db/mongodb');
const logger = require('../common/logger');
const configsSchema = new Schema();

// loyalty30 Enabled/Disabled
loyalty30 = process.env.LOYALTY_30 || 'Enabled'

let loyaltyConn;

if (loyalty30 === 'Enabled') {
    loyaltyConn = require('../loyalty/db/mongodb');
}

const queries = {

    async getAll () {
        const Total = mongoConn.model('getAll', configsSchema, 'configs');
        return await Total.find({
            $or: [
                {'type': 'regular'},
                {'type': 'loyalty30'}
            ]
        }
//        result = await Total.find( { "test" : true }
       ).sort({ 'name': 1 }).lean();
    },

    async getOne (name) {
        const Config = mongoConn.model('getOne', configsSchema, 'configs');
        return await Config.findOne({
            'name': name
        }).lean();
    },

    async getAllBeniobms() {
        const allBeniobms = mongoConn.model('allBeniobms', configsSchema, 'configs');
        return await allBeniobms.find({
            'beniobms': {$exists: true}
          },
            'loyalty_id type name location description database dns beniobms'
        ).sort({ 'name': 1 }).lean();
    },

    async getOneBeniobms(name) {
        const oneBeniobms = mongoConn.model('oneBeniobms', configsSchema, 'configs');
        return await oneBeniobms.findOne({
            'name': name,
            'beniobms': {$exists: true}
          },
            'loyalty_id type name location description database dns beniobms',
        ).lean();
    },

    async getAllBmscardweb() {
        const allBmscardweb = mongoConn.model('allBmscardweb', configsSchema, 'configs');
        return await allBmscardweb.find({
            'bmscardweb': {$exists: true}
          },
            'loyalty_id type name location description dns bmscardweb'
        ).sort({ 'name': 1 }).lean();
    },

    async getOneBmscardweb(name) {
        const oneBmscardweb = mongoConn.model('oneBeniobms', configsSchema, 'configs');
        return await oneBmscardweb.findOne({
            'name': name,
            'bmscardweb': {$exists: true}
          },
            'loyalty_id type name location description dns bmscardweb coalition'
        ).lean();
    },

    async getOneGiftcardweb(name) {
        const oneGiftcardweb = mongoConn.model('oneGiftcardweb', configsSchema, 'configs');
        return await oneGiftcardweb.findOne({
            'name': name,
            'giftcardweb': {$exists: true}
          },
            'loyalty_id type name location description dns giftcardweb'
        ).lean();
    },

    async getAllMobileback() {
        const allMobileback = mongoConn.model('allMobileback', configsSchema, 'configs');
        return await allMobileback.find({
            'mobileback': {$exists: true}
          },
            'loyalty_id type name location description dns mobileback'
        ).sort({ 'name': 1 }).lean();
    },

    async getOneMobileback(name) {
        const oneMobileback = mongoConn.model('oneMobileback', configsSchema, 'configs');
        return await oneMobileback.findOne({
            'name': name,
            'mobileback': {$exists: true}
          },
            'loyalty_id type name location description dns mobileback coalition projectID'
        ).lean();
    },

    async getOneBps(name) {
        const oneBps = mongoConn.model('oneBps', configsSchema, 'configs');
        return await oneBps.findOne({
            'name': name,
            'bps': {$exists: true}
          },
            'loyalty_id type name location description dns bps cards',
        ).lean();
    },

    async getByLocation(location) {
        const Partners = mongoConn.model('', configsSchema, 'configs');
        return await Partners.find({
            'location': location
          },
            'name dns bps beniobms giftcardweb bmscardweb'
        ).sort({ 'name': 1 }).lean();
    },

    async getAllLocations() {
        const allLocations = mongoConn.model('allLocations', configsSchema, 'locations');
        return await allLocations.find().lean();
    },

    async getLocationData(location) {
      const locationData = mongoConn.model('locationData', configsSchema, 'locations');
      return await locationData.findOne({
          'location': location
      }).lean();
    },

    async getStatSender() {
        const Stats = mongoConn.model('statSender', configsSchema, 'configs');
        return await Stats.find({
            'subscription': false,
            'inProd': true
        }).sort({ 'name': 1 }).lean();
    },

    async getcardsranges() {
        const Cards = mongoConn.model('', configsSchema, 'configs');
        return await Cards.find({
            'cards': {$exists: true}
        }).sort({ 'cards.max': 1 }).lean();
    },

    async getDefaults(purpose) {
        const Defaults = mongoConn.model('defaults', configsSchema, 'defaults');
        return await Defaults.findOne({
            'purpose': purpose
        }).lean();
    },

    async getPlacement(name) {
        const Placement = mongoConn.model('placement', configsSchema, 'placements');
        return await Placement.findOne({
            'hostname': name
        }).lean();
    },

    async getProjectsInPlacement(host) {
        const Projects = mongoConn.model('projects', configsSchema, 'configs');
        return await Projects.find({
            'database.host': host,
            'coalition': {$exists: false}
          },
            'name'
        ).sort({ 'name': 1 }).lean();
    },

    async getAllDbPlacements() {
        const Placements = mongoConn.model('alldbplacements', configsSchema, 'placements');
        return await Placements.find({
            'oracle_sid': {$exists: true}
        }).sort({'hostname': 1}).lean();
    },

    async getLoyaltyId(name) {
        const LoyaltyId = mongoConn.model('loyalty_id', configsSchema, 'configs');
        return await LoyaltyId.findOne({
            'name': name
          },
            'loyalty_id type'
        ).lean();
    },

    async getAllProjectsId() {
        const AllProjectsId = mongoConn.model('projectID', configsSchema, 'configs');
        return await AllProjectsId.find({
            'projectID': {$exists: true}
          },
            'name projectID'
        ).sort({ 'name': 1 }).lean();
    },

    async getProjectId(name) {
        const oneProjectId = mongoConn.model('projectID', configsSchema, 'configs');
        return await oneProjectId.findOne({
            'name': name
          },
            'description projectID'
        ).lean();
    },

    async getWebData(name) {
        let webData = {
            'name' : name,
            'color1' : null,
            'color2' : null
        };
        if (loyalty30 === 'Enabled') {
            const loyaltyData = loyaltyConn.model('getWebData', configsSchema, 'users');
            let result = await loyaltyData.findOne({
                'site': name
              },
                'color1 color2 name'
            ).lean();
            if (!result) {
                logger.warn('Data for bmscardweb %s was not found in loyalty database', name)
            } else {
                webData = result;
            }
        }
        return webData;
    },

    async readInfrastructure(location, placement, role) {
        const infrastructureData = mongoConn.model('infrastructure', configsSchema, 'infrastructure');
        return await infrastructureData.find({
            'location': location,
            'belongs': placement
        }).lean();
    },

    async getDeployHost(location, placement) {
        const DeployHost = mongoConn.model('deployhost', configsSchema, 'placements');
        return await DeployHost.findOne({
            'deployhost': true,
            'location': location,
            'placement': placement
          },
            'hostname'
        ).lean();
    },

}

module.exports = queries;
