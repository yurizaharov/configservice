const queries = require('../functions/queries')

const loyalty = {
    async newpartner (name, colorPrimary, colorAccent) {
        let currentDate = new Date().toLocaleString('ru-RU');
        return await queries.newpartner(name, colorPrimary, colorAccent, currentDate);
    }

}

module.exports = loyalty;
