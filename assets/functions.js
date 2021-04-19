const axios = require('axios');

const functions = {

    async getbeniobmsversion (beniobmsExt) {
        let beniobmsVersion;
        try {
            beniobmsVersion = await axios.get(beniobmsExt + 'actuator/info/')
                .then((response) => {
                    return response.data.app.version;
                });
        } catch (err) {
            console.log(err)
        }
        return beniobmsVersion;
    },

    async getprocessingversion (processingExt) {
        let processingVersion;
        try {
            processingVersion = await axios.get(processingExt + 'bpsApi/ping/')
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
        return processingVersion;
    }

}

module.exports = functions;
