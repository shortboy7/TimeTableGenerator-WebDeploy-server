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
function leftpad(num) {
	return Number(num) < 10 ? `0${num}` : `${num}`;
}

async function enrollRating(filename)
{
	const jsonfile = fs.readFileSync(filename, 'utf8');
	const ratingFile = JSON.parse(jsonfile);
	let dbCourse = new Map();


	await pool.excuteQueryPromise(`SELECT * FROM course`, [])
	.then((rows) => {
		for (let row of rows) {
			dbCourse.set(row['course_number'], true);
		}
	})

	let dbProfessor = new Map();
	await pool.excuteQueryPromise('SELECT * from professor', [])
	.then((rows) => {
		for (let row of rows) {
			dbProfessor.set(row['name'], row['professor_id']);
		}
	})
	.catch(err => {
		console.log(err);
	});

	for (let id in ratingFile) {
		let [courseNumber, class_id] = id.split('-');
		let courseID = dbCourse.get(courseNumber);
		if (courseID === undefined) {
			// console.log(courseNumber);
			continue;
		}

		for (let professorName in ratingFile[id]) {
			for (let year in ratingFile[id][professorName]) {
				for (let semester in ratingFile[id][professorName][year]){
					let info = ratingFile[id][professorName][year][semester];
					let score = info["Score"];
					let professorID = dbProfessor.get(professorName);

					// professor가 처음 보는 교수인 경우
					// if (professorID === undefined) {
					// 	console.log(professorName);
					// 	await pool.excuteQueryPromise(`INSERT INTO professor (name) VALUES (?)`, [professorName])
					// 	await pool.excuteQueryPromise(`SELECT professor_id FROM professor WHERE name = ?`, [professorName])
					// 	.then((rows) => {
					// 		professorID = rows[0]['professor_id'];
					// 		dbProfessor.set(professorName, professorID);
					// 		// console.log(professorID);
					// 	});
					// }

					// course가 처음 보는 과목인 경우
					// console.log(courseNumber);

					let semester_r = semester;
					if (semester == '2')
						semester_r = '3';
					let query = `INSERT INTO class (course_number, professor_id, year, semester, class_id, rating) VALUES (?, ?, ?, ?, ?, ?)`;
					let params = [courseNumber, professorID, Number(year), Number(semester_r), leftpad(class_id), score];

					// console.log(params[0] +'-' + params[2] + '-' + params[3] +'-' + params[4]);
					await pool.excuteQueryPromise(query, params)
					.catch(err => {
						process.exit(1);
					})
				}
			}
		// break;
		}
	}
	console.log('done');
}

enrollRating('courseRating.json')