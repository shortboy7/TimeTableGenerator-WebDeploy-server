const mysql = require('mysql');
// const db_config = require('../config/db_config.json');
require('dotenv').config({path: '../../env'});

const pool = mysql.createPool({
	host:process.env.DB_HOST,
	user:process.env.DB_USER,
	password:process.env.DB_PASSWORD,
	database:process.env.DB_DATABASE,
	connectionLimit:process.env.DB_CONN_LIMIT
});

// const pool = mysql.createPool({
// 	host:db_config.host,
// 	user:db_config.user,
// 	password:db_config.password,
// 	database:db_config.database,
// 	connectionLimit:db_config.connectionLimit
// });

module.exports = {
	excuteQueryPromise: function(sql, params) {
		return new Promise((resolve, reject) => {
			pool.getConnection((err, connection) => {
				if (err) {
					console.log('connection err', err);
					connection.release();
					reject(err);
				}
				connection.query(sql, params, (err, rows)=>{
					if (err) {
						console.log('query err', err);
						reject(err);
					}
					connection.release();
					resolve(rows);
				});
			});
		});
	}
};
