const mysql = require('mysql2/promise');
// const db_config = require('../config/db_config_local.json');
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
		return pool.query(sql, params);
	}
};
