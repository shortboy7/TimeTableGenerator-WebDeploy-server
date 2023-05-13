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
	selectDefaultSQLPart = 'SELECT course.name courseName, course.course_number courseNumber, professor.name professor, class.class_id classId, curriculum, grade, rating, credit, theory, practice, day, start_time, end_time, classroom';

	findByMajorAndYearAndSemester(major, year, semester){
		let sql = '';
		sql += this.selectDefaultSQLPart;
		sql += ' FROM course JOIN class ON course.course_id = class.course_id';
		sql += ' JOIN schedule ON class.class_id = schedule.class_id AND class.course_id = schedule.course_id';
		sql += ' JOIN professor ON class.professor_id = professor.professor_id';
		sql += ' WHERE course.major = ? AND class.year = ? AND class.semester = ?';
		let params = [major, year, semester];
		return pool.excuteQueryPromise(sql, params);
	}

	findByYearAndSemester(year, semester){
		let sql = '';
		sql += this.selectDefaultSQLPart;
		sql += ' FROM course JOIN class ON course.course_id = class.course_id';
		sql += ' JOIN schedule ON class.class_id = schedule.class_id AND class.course_id = schedule.course_id';
		sql += ' JOIN professor ON class.professor_id = professor.professor_id';
		sql += ' WHERE class.year = ? AND class.semester = ?';
		let params = [year, semester];
		return pool.excuteQueryPromise(sql, params);
	}

	findByCurriculum(year, semester, curriculum){
		let sql = '';
		sql += this.selectDefaultSQLPart;
		sql += ' FROM course JOIN class ON course.course_id = class.course_id';
		sql += ' JOIN schedule ON class.class_id = schedule.class_id AND class.course_id = schedule.course_id';
		sql += ' JOIN professor ON class.professor_id = professor.professor_id';
		sql += ' WHERE curriculum = ? AND class.year = ? AND class.semester = ?';
		let params = [curriculum, year, semester];
		return pool.excuteQueryPromise(sql, params);
	}

	findByCourseInfo(courseName, courseNumber, professor){
		let sql = '';
		sql += this.selectDefaultSQLPart;
		sql += ' FROM course JOIN class ON course.course_id = class.course_id';
		sql += ' JOIN schedule ON class.class_id = schedule.class_id AND class.course_id = schedule.course_id';
		sql += ' JOIN professor ON class.professor_id = professor.professor_id';
		sql += ' WHERE course.course_name = ? AND course.course_number = ? AND professor.name = ?';
		let params = [courseName, courseNumber, professor];
		return pool.excuteQueryPromise(sql, params);
	}
};

const dao = new CourseDAO();
module.exports = dao;