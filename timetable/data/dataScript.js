const pool = require("../general/ConnectionPool.js");
const fs = require('fs');

function findMatches(arr, regex) {
	return arr.filter((str) => regex.test(str));
}


// TODO : object -> db save (90%)
// TODO : 강의 종류 저장 / 캠퍼스 저장

function getTime(course) {
	let times = [];
	if (course['요일/시간'] == '') {
		times.push({
			day : '-1',
			begin : '00:00:00',
			end:'00:00:00'
		});
	}else{
		let schedule = course['요일/시간'].split(',');
		for (let sche of schedule){
			let day = sche.substring(0, 1);
			let nday = -1;
			switch (day) {
				case '월':
					nday = 1;
					break;
				case '화':
					nday = 2;
					break;
				case '수':
					nday = 3;
					break;
				case '목':
					nday = 4;
					break;
				case '금':
					nday = 5;
					break;
				case '토':
					nday = 6;
					break;
				case '일':
					nday = 7;
				break;
			}
			times.push({
				day : nday,
				begin : sche.split('/')[1].split('-')[0]+':00',
				end : sche.split('/')[1].split('-')[1]+':00'
			});
		}
	}
	return times;
}

function getRoom(course, times) {
	let str = course['강의실'];
	if (str == '') {
		return [''];
	}
	let rooms = [];
	let tokens = str.split(',');
	for (let token of tokens) {
		rooms.push(token);
	}
	// 강좌 시간 갯수보다 작으면 첫번째 강의실로 채워넣기
	// Note : 강의시간이 3개이고 강의실이 2개면 3번째 강의실은 첫번째 강의실과 같다. 문제 생길 시 수정필요
	if (rooms.length < times.length) {
		rooms.push(rooms[0]);
	}
	return rooms;
}

// jsonFile (utf - 8) 에서 데이터를 가져오기
function extractObject(filename) {
	let professors = new Map();
	let courses = new Map();
	let classes = new Map();

	const jsonfile = fs.readFileSync(filename, 'utf8');
	const coursesFile = JSON.parse(jsonfile);
	for (let course of coursesFile) {
		let key = course['학수강좌번호'];
		let cNumber = key.split('-')[0];
		let classId = key.split('-')[1];
		/* 요일/시간 파싱하기 Schedule 정보*/
		let times = getTime(course);
		let rooms = getRoom(course, times);
		let belong = course['개설학과/전공'].split(' ');

		let college = course['개설대학'];
		if (college.length == 0)
			college = findMatches(belong, /처$/);
		if (college.length == 0)
			college = findMatches(belong, /단$/);
		if (college.length == 0)
			college = findMatches(belong, /원$/);
		if (college.length == 0)
			college = findMatches(belong, /본부$/);

		let department = findMatches(belong, /학부$/);
		if (department.length == 0)
			department = findMatches(belong, /대$/);
		if (department.length == 0)
			department = findMatches(belong, /팀$/);
		if (department.length == 0)
			department = findMatches(belong, /센터$/);
		if (department.length == 0)
			department = findMatches(belong, /다르마칼리지$/);

		let major = findMatches(belong, /과$/);
		if (major.length == 0 && college == '연계전공')
			major = belong[1];
		if (major.length == 0)
			major = findMatches(belong, /전공$/);
		/* Course 정보 뽑기 */
		courses.set(cNumber, {
			cName: course['교과목명'],
			cNumber: cNumber,
			theory: course['이론'],
			practice: course['실습'],
			credit: course['학점'],
			year: 2023,
			semester: 1,
			curriculm: course['교과과정'],
			college: college,
			department: department,
			major: major,
			grade: course['학년/가진급학년'],
		});
		/* Class 정보 뽑기 */
		let classInfo = {
			classId : classId,
			rating : 0,
			capacity : 0,
			professor : course['교원명'],
			schedules : {
				time : times,
				room : rooms
			},
		};
		// 이미 있으면 push 없으면 새로 생성
		if (!classes.get(cNumber)) classes.set(cNumber, [classInfo]);
		else classes.get(cNumber).push(classInfo);

		/* Professor 정보 뽑기 (교수명을 일단 키값으로) */
		let pName = course['교원명'];
		if (!professors.has(pName)) {
			professors.set(pName, {name:pName, major:''});
		}
		// console.log(course);
	}
	return [professors, courses, classes];
}

function submitProfessorsEntity(professors)
{
	let queryPromises = [];
	let sql = "INSERT professor (name, major) VALUES (?, ?)";
	for (let professor of professors) {
		let values = [professor.name, professor.major];
		queryPromises.push(pool.excuteQueryPromise(sql, values));
	}
	return (Promise.allSettled(queryPromises));
}

function submitCourseEntity(courses)
{
	let queryPromises = [];
	let sql = 'INSERT course (course_number, name, theory, practice, credit, year, semester, curriculum, college, department, major, grade) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
	for (let course of courses) {
		if (course.theory == '') course.theory = 0;
		if (course.practice == '') course.practice = 0;
		if (course.department == '') course.department = null;
		if (course.major == '') course.major = null;
		if (course.grade == '') course.grade = null;
		let values = [course.cNumber, course.cName, course.theory, course.practice, course.credit, course.year, course.semester, course.curriculm, course.college, course.department, course.major, course.grade];
		queryPromises.push(pool.excuteQueryPromise(sql, values));
	}
	return (Promise.allSettled(queryPromises));
}

// Map 형태로 인자를 넣어야함.
async function submitClassEntity(classes)
{
	let queryPromises = [];
	for (let [key, value] of classes) {
		let findCourseSQL = 'SELECT course_id FROM course WHERE course_number = ?';
		let findCourseValues = [key];
		let course_id = await pool.excuteQueryPromise(findCourseSQL, findCourseValues);
		for (let classInfo of value) {
			let findProfessorSQL = 'SELECT professor_id FROM professor WHERE name = ?';
			let findProfessorValues = [classInfo.professor];
			let professor_id = await pool.excuteQueryPromise(findProfessorSQL, findProfessorValues);
			let saveSQL = 'INSERT class (course_id, class_id, rating, capacity, professor_id) VALUES (?, ?, ?, ?, ?)';
			await pool.excuteQueryPromise(saveSQL, [course_id[0].course_id, classInfo.classId, classInfo.rating, classInfo.capacity, professor_id[0].professor_id]);
			let scheduleSQL = 'INSERT schedule (class_id, course_id, start_time, day, end_time, classroom, campus ) VALUES (?, ?, ?, ?, ?, ?, ?)';
			for (let i = 0; i < classInfo.schedules.time.length; i++) {
				let scheduleValues = [classInfo.classId, course_id[0].course_id, classInfo.schedules.time[i].begin, classInfo.schedules.time[i].day, classInfo.schedules.time[i].end, classInfo.schedules.room[i], '서울'];
				queryPromises.push(pool.excuteQueryPromise(scheduleSQL, scheduleValues));
			}
		}
	}
	return (Promise.allSettled(queryPromises));
}

async function main(){
	try{
	let [professors, courses, classes] = extractObject('202301.json');
		let result = await submitProfessorsEntity(professors.values());
		console.log(result.filter((e)=>e.status == 'fulfilled').length);
		result = await submitCourseEntity(courses.values());
		console.log(result.filter((e)=>e.status == 'fulfilled').length);
		result = await submitClassEntity(classes);
		console.log(result.filter((e)=>e.status == 'fulfilled').length);
	}catch(err)
	{
		console.log(err);
	}
}
main();
