const oracledb = require('oracledb');

const oracle = {

    async sqlrequest (initialData, sqlQuery) {
        let connection;
        try {
            let binds, options, result;

            connection = await oracledb.getConnection(initialData);

            binds = {};
            options = {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            };

            result = await connection.execute(sqlQuery, binds, options);
            return result.rows[0];

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
        }
    }
}

module.exports = oracle;
