const mysql = require('mysql');
const fs = require('fs');

try{
	const jsonfile = fs.readFileSync('202301.json', 'utf8');
	const courses = JSON.parse(jsonfile);
	for (let course of courses) {
		console.log(course);
	}
}catch(err)
{
	console.log(err);
}
