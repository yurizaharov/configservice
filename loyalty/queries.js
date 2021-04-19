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

const queries = {

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
        const Partners = mongoose.model('', partnerScheme, 'loyalty');
        result = await Partners.find({}, function (err, doc){
            if(err) return console.log(err);
        }).lean();
        return result;
    }

}

module.exports = queries;
