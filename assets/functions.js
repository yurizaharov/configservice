const axios = require('axios');

const functions = {

    async getBeniobmsVersion (initialData) {
        let beniobmsVersion;
        try {
            const response = await axios.get(initialData.beniobmsExt + 'actuator/info/');
            beniobmsVersion = response.data.app.version;
        } catch (err) {
            console.log(`Error getting beniobms version of ${initialData.name}: ${err.response.status} ${err.response.statusText}`);
        }
        return {
            'name' : initialData.name,
            'beniobmsVersion' : beniobmsVersion
        }
    },

    async getBpsVersion (initialData) {
        let processingVersion;
        try {
            const response = await axios.get(initialData.processingExt + 'bpsApi/ping/');
            processingVersion = response.data.split(' ')[1];
        } catch (err) {
            console.log(`Error getting bps version of ${initialData.name}: ${err.response.status} ${err.response.statusText}`);
        }
        return {
            'name' : initialData.name,
            'processingVersion' : processingVersion
        }
    },

    async parallelProcess (callBack, tasksData) {
        const promises = tasksData.map(callBack);
        return await Promise.all(promises);
    },

}

module.exports = functions;
