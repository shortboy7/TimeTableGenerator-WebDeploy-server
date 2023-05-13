const e = require("express");
const pool = require("../general/ConnectionPool.js");
const fs = require('fs');


/**평점은 4년치 */
// score = (raw - 100) / 20;
// 100, 120 : 0. ~ 1
// 121, 140 : 1. ~ 2
// 141, 160 : 2. ~ 3
// 161, 180 : 3. ~ 4
// 181, 200 : 4. ~ 5

/**
 * Semester
 * 1 : 1학기
 * 2 : 여름학기
 * 3 : 2학기
 * 4 : 겨울학기
 */

/**
 * 강좌번호, 학기, 년도 얻고
 * 없으면 create / 있으면 내비둠
 *
 */

// (cId, semester, year) -X {infos}
/** 년도가 달라지면서 주관하는 과목 정보들이 달라질 수 있음 */
/** course_number만 가지고는 결정 불가능, 같은 course_number인데 서로 다른 정보 있을 수 있음
 * 그래서 semester, year 도 같이 있어야 결정 가능
 * 2NF(0)
 * 3NF(0)
 * BCNF(0)
 * 4NF(0)
*/
async function enrollRating(filename)
{
	const jsonfile = fs.readFileSync(filename, 'utf8');
	const ratingFile = JSON.parse(jsonfile);
	let dbCourse = new Map();


	await pool.excuteQueryPromise(`SELECT * FROM course WHERE year = 2023 AND semester = 1`, [])
	.then((rows) => {
		for (let row of rows) {
			dbCourse.set(row['course_number'], {
				id: row['course_id'],
				course_number: row['course_number'],
				name: row['name'],
				credit: row['credit'],
				department: row['department'],
				college: row['college'],
				major: row['major'],
				grade: row['grade'],
				practice: row['practice'],
				theory: row['theory'],
				curriculum: row['curriculum']
			});
		}
	})

	let dbProfessor = new Map();
	await pool.query('SELECT * from professor')
	.then((rows) => {
		dbProfessor.set(rows['name'], {
			name: rows['name'],
			professor_id : rows['professor_id']
		});
	})
	.catch(err => {
		console.log(err);
	});

	for (let id of ratingFile) {
		let [courseNumber, class_id] = id.split('-');
		let
	}
	console.log('done');
}

enrollRating('courseRating.json')