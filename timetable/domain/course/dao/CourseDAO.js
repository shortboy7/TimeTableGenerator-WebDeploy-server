const pool = require('../../../general/ConnectionPool');

/**
 * TODO : API 명세에 따른 DAO 구현
 * 전공별 가져오기
 * 교과과정별 가져오기
 * 강의명, 강의번호, 교수명으로 가져오기
 *
 * ISSUE : 강의실이 이상하게 저장됨　－＞　ｊｏｉｎ　조건절을　잘못해서　그랬음
 * Alt+= 이게 무슨 키이길래
 */

class CourseDAO{
	selectDefaultSQLPart = ' SELECT course.name courseName, course.course_number courseNumber, professor.name professor, class.class_id classId, curriculum, grade, RatingTab.avgRating rating, credit, theory, practice, day, start_time, end_time, classroom';
	constructor(){
		this.ratingTab = '';
		this.ratingTab += 'WITH RatingTab AS ('
		this.ratingTab += ' SELECT course.course_number courseNumber, p.professor_id pid, AVG(class.rating) avgRating'
		this.ratingTab += ' FROM course JOIN class ON course.course_number = class.course_number'
		this.ratingTab += ' JOIN professor p on class.professor_id = p.professor_id'
		this.ratingTab += ' WHERE class.year < ? OR (class.year = ? AND class.semester < ?)'
		this.ratingTab += ' GROUP BY course.course_number, p.professor_id'
		this.ratingTab += ')'
	}

	findByMajorAndYearAndSemester(major, year, semester){
		let sql = '';
		sql += this.ratingTab;
		sql += this.selectDefaultSQLPart;
		sql += ' FROM course JOIN class ON course.course_number = class.course_number';
		sql += ' JOIN schedule ON class.class_id = schedule.class_id AND class.year = schedule.year AND class.semester = schedule.semester AND class.course_number = schedule.course_number';
		sql += ' JOIN professor ON class.professor_id = professor.professor_id';
		sql += ' JOIN RatingTab ON course.course_number = RatingTab.courseNumber AND class.professor_id = RatingTab.pid'
		sql += ' WHERE course.major = ? AND class.year = ? AND class.semester = ?';

		let params = [year, year, semester, major, year, semester];
		return pool.excuteQueryPromise(sql, params);
	}

	findByYearAndSemester(year, semester){
		let sql = '';
		sql += this.ratingTab;
		sql += this.selectDefaultSQLPart;
		sql += ' FROM course JOIN class ON course.course_number = class.course_number';
		sql += ' JOIN schedule ON class.class_id = schedule.class_id AND class.year = schedule.year AND class.semester = schedule.semester AND class.course_number = schedule.course_number';
		sql += ' JOIN professor ON class.professor_id = professor.professor_id';
		sql += ' JOIN RatingTab ON course.course_number = RatingTab.courseNumber AND class.professor_id = RatingTab.pid'
		sql += ' WHERE class.year = ? AND class.semester = ?';
		let params = [year, year, semester, year, semester];
		return pool.excuteQueryPromise(sql, params);
	}

	findByCurriculum(year, semester, curriculum){
		let sql = '';
		sql += this.ratingTab;
		sql += this.selectDefaultSQLPart;
		sql += ' FROM course JOIN class ON course.course_number = class.course_number';
		sql += ' JOIN schedule ON class.class_id = schedule.class_id AND class.year = schedule.year AND class.semester = schedule.semester AND class.course_number = schedule.course_number';
		sql += ' JOIN professor ON class.professor_id = professor.professor_id';
		sql += ' JOIN RatingTab ON course.course_number = RatingTab.courseNumber AND class.professor_id = RatingTab.pid'
		sql += ' WHERE curriculum = ? AND class.year = ? AND class.semester = ?';
		let params = [year, year, semester, curriculum, year, semester];
		return pool.excuteQueryPromise(sql, params);
	}

	findByCourseInfo(courseName, courseNumber, professor){
		let sql = '';
		sql += this.ratingTab;
		sql += this.selectDefaultSQLPart;
		sql += ' FROM course JOIN class ON course.course_number = class.course_number';
		sql += ' JOIN schedule ON class.class_id = schedule.class_id AND class.year = schedule.year AND class.semester = schedule.semester AND class.course_number = schedule.course_number';
		sql += ' JOIN professor ON class.professor_id = professor.professor_id';
		sql += ' JOIN RatingTab ON course.course_number = RatingTab.courseNumber AND class.professor_id = RatingTab.pid'
		sql += ' WHERE course.course_name = ? AND course.course_number = ? AND professor.name = ?';
		let params = [year, year, semester, courseName, courseNumber, professor];
		return pool.excuteQueryPromise(sql, params);
	}
};

const dao = new CourseDAO();
module.exports = dao;