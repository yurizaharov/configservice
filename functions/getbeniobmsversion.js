const axios = require('axios');

async function getprocessingversion(initialData) {
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
    return processingVersion;
}

module.exports = getprocessingversion;
