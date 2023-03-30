import "../domain/course/entity/CourxseEntity";

const pool = require('../../../general/ConnectionPool');

class CourseDAO{
	findByCourseNumberAndYearAndSemester(courseNumber, year, semester){
		let sql = `SELECT * FROM course WHERE courseNumber = ? AND year = ? AND semester = ?`;
		let params = [courseNumber, year, semester];
		return pool.excuteQueryPromise(sql, params);
	}
	save(course){
		let sql = 'INSERT INTO course (courseNumber, name, credit, theory, practice, schedules, instructor, year, semester) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
		let params = [course.courseNumber, course.name, course.credit, course.theory, course.practice, course.schedules, course.instructor, course.year, course.semester];
		return pool.excuteQueryPromise(sql, params);
	}
};

const dao = new CourseDAO();
module.exports = dao;