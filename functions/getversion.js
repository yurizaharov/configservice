const oracledb = require('oracledb');
const axios = require('axios');

async function getversion(accessCreds) {
    let currentPatch = [];
    for (let k = 0; k < accessCreds.length; k++) {
        let connection;
        try {
            let sql, binds, options, result, processingVersion;
            connection = await oracledb.getConnection({
                user: accessCreds[k].user,
                password: accessCreds[k].password,
                connectString: accessCreds[k].connectString
            });
            sql = `select * from DATABASECHANGELOG where EXECTYPE='EXECUTED' order by DATEEXECUTED desc`;
            binds = {};
            options = {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            };

            result = await connection.execute(sql, binds, options);

            processingVersion = await axios.get(accessCreds[k].processing)
                .then((response) => {
                    if(!response.data.String) {
                        return response.data.split(' ')[1];
                    } else {
                        return response.data.String.split(' ')[1];
                    }
                });

            currentPatch.push( {"database" : accessCreds[k].dataBase, "id" : result.rows[0].ID, "author" : result.rows[0].AUTHOR, "dateexecuted" : result.rows[0].DATEEXECUTED, "exectype" : result.rows[0].EXECTYPE, "processingversion" : processingVersion}  )
    } catch (err) {
            console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }}
    return(currentPatch)
}

module.exports = getversion;
