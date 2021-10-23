const axios = require('axios');

const functions = {

    async getbeniobmsversion (initialData) {
        let beniobmsVersion;
        try {
            beniobmsVersion = await axios.get(initialData.beniobmsExt + 'actuator/info/')
                .then((response) => {
                    return response.data.app.version;
                });
        } catch (err) {
            console.log(err)
        }
        return {
            'name' : initialData.name,
            'beniobmsVersion' : beniobmsVersion
        };
    },

    async getprocessingversion (initialData) {
        let processingVersion;
        try {
            processingVersion = await axios.get(initialData.processingExt + 'bpsApi/ping/')
                .then((response) => {
                    if (!response.data.String) {
                        return response.data.split(' ')[1];
                    } else {
                        return response.data.String.split(' ')[1];
                    }
                });
        } catch (err) {
            console.log(err)
        }
        return {
            'name' : initialData.name,
            'processingVersion' : processingVersion
        };
    },

    async parallelProcess (callBack, tasksData) {
        const promises = tasksData.map(callBack);
        return await Promise.all(promises);
    },

}

module.exports = functions;
