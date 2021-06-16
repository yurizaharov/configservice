require('../db/mongodb')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
        connectString: String
    },
    dns: {
        domain: String,
        subdomain: String,
        name: String
    },
    cards: {
        min: String,
        max: String
    }
});

const Partner = mongoose.model('Partner', partnerScheme, 'configs');

const updateScheme = new Schema();
const deleteScheme = new Schema();
const configsSchema = new Schema();

const queries = {

    async getall () {
        let result = [];
        const Total = mongoose.model('allConfigs', configsSchema, 'configs');
        result = await Total.find({}, function (err, doc) {
            if (err) return console.log(err);
        }).sort({'name': 1}).lean();
        return result;
    },

    async getlastid () {
        let result = [];
        const LastId = mongoose.model('getLastId', configsSchema, 'configs');
        result = await LastId.find({ 'loyalty_id' : { $exists: true } }, function (err, doc) {
            if (err) return console.log(err);
        }).sort({'loyalty_id': -1}).lean();
        return result[0].loyalty_id;
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
        result = await Partner.findOne({ 'type' : 'loyalty30', 'stage' : 'new' }, 'name', function (err){
            if(err) return console.log(err);
        }).lean();
        return result;
    },

    deletenewloyalty (name) {
        const deleteNew = mongoose.model('deleteNew', deleteScheme, 'loyalty');
        deleteNew.deleteOne({ 'name' : name }, function (err){
            if(err) return console.log(err);
            console.log('Deleted from new loyalty:', name);
        });
    },

    async dnsstage (dns, name) {
        const dnsUpdate = mongoose.model('dns', updateScheme, 'configs');
        let result = await dnsUpdate.findOneAndUpdate({
            'name': name
        }, dns, {
            strict: false,
            new: true,
            upsert: true
        }).lean();

        return result;
    }

}

module.exports = queries;
