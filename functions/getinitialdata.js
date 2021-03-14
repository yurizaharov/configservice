const axios = require('axios');

// Setting variables
initialDataURL = process.env.CONFIGSERVICE_ADDR || 'localhost:8080'

async function getinitialdata() {
    let initialData = [];

    try {
        initialData = await axios.get('http://' + initialDataURL + '/api/configs/liquicheck')
            .then((response) => {
                return response.data;
            });
    } catch (err) {
        console.log(err)
    }

    return initialData;
}

module.exports = getinitialdata;
