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

module.exports = {
	excuteQueryPromise: function(sql, params) {
		console.log(process.env.DB_HOST,
			process.env.DB_USER,
			process.env.DB_PASSWORD,
			process.env.DB_DATABASE,
			process.env.DB_CONN_LIMIT);
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
						reject(err);
					}
					connection.release();
					resolve(rows);
				});
			});
		});
	}
};
