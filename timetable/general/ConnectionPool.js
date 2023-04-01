const mysql = require('mysql');
const db_config = require('../../config/db_config.json');

const pool = mysql.createPool({
	host:db_config.host,
	user:db_config.user,
	password:db_config.password,
	database:db_config.database,
	connectionLimit:db_config.connectionLimit
});

module.exports = {
	excuteQueryPromise: function(sql, params) {
		return new Promise((resolve, reject) => {
			pool.getConnection((err, connection) => {
				if (err) {
					console.log(err);
					connection.release();
					reject(err);
				}
				connection.query(sql, params, (err, rows)=>{
					if (err) {
						console.log(err);
						connection.release();
						reject(err);
					}
					connection.release();
					resolve(rows);
				});
			});
		});
	}
};
