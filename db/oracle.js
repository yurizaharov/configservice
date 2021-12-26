const oracledb = require('oracledb');

const oracle = {

    async sqlRequest (initialData) {
        let connection;
        try {
            let binds, options, result;

            connection = await oracledb.getConnection(initialData);

            binds = {};
            options = {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            };

            result = await connection.execute(initialData.sqlQuery, binds, options);
            return {
                'name' : initialData.name,
                'data' : result.rows[0]
            };

        } catch (err) {
            console.error(err);
            return {
                'name' : initialData.name,
                'data' : ''
            };
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
