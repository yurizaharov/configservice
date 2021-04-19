const queries = require('../loyalty/queries')

module.exports = {

    newpartner: async function (name, colorPrimary, colorAccent) {
        let currentDate = new Date().toLocaleString('ru-RU');
        return await queries.newpartner(name, colorPrimary, colorAccent, currentDate);
    },

    getnewpartner: async function () {
        return await queries.getnewpartner();
    }

}