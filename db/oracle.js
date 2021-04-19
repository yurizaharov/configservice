const oracledb = require('oracledb');

const oracle = {

    async getpatch (initialData) {
        let connection;
        try {
            let sql, binds, options, result;

            connection = await oracledb.getConnection({
                user: initialData.user,
                password: initialData.password,
                connectString: initialData.connectString
            });

            sql = `select *
                   from DATABASECHANGELOG
                   where EXECTYPE = 'EXECUTED'
                   order by DATEEXECUTED desc`;
            binds = {};
            options = {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            };

            result = await connection.execute(sql, binds, options);
            return result.rows[0].ID;

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
