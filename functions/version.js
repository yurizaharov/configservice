const axios = require('axios');

module.exports = {

    beniobms: async function (beniobmsExt) {
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
    }

}
