require('../db/mongodb')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const partnerScheme = new Schema({
    name: String,
    colorPrimary: String,
    colorAccent: String,
    currentDate: String
});

const Partner = mongoose.model('Partner', partnerScheme, 'loyalty');

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

    async newpartner (name, colorPrimary, colorAccent, currentDate) {
        let partner = new Partner({
            name: name,
            colorPrimary: colorPrimary,
            colorAccent: colorAccent,
            currentDate: currentDate
        });
        partner.save(function (err) {
            if (err) return console.log(err);
            console.log(currentDate, '- Saved new partner:', name);
        });
    },

    async getnewpartner () {
        let result = [];
        const Partners = mongoose.model('Partners', partnerScheme, 'loyalty');
        result = await Partners.findOne({}, function (err){
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
