class CourseService{
	constructor(){
		this.courseDao = require('../dao/CourseDAO');
		this.courseTransformer = require('../transformer/CourseTransformer');
	}
	getCourseByMajor(major, year, semester){
		return new Promise((resolve, reject)=>{
			this.courseDao.findByMajorAndYearAndSemester(major, year, semester).then((rows)=>{
				let dtos = this.courseTransformer.rowsToDTO(rows);
				console.log(dtos);
				resolve(dtos);
			})
			.catch((err)=>{
				console.log(err);
				reject(err);
			});
		})
	}
	getAllCourse(year, semester){
		return new Promise((resolve, reject)=>{
			this.courseDao.findByYearAndSemester(year, semester).then((rows)=>{
				let dtos = this.courseTransformer.rowsToDTO(rows);
				resolve(dtos);
			})
			.catch((err)=>{
				console.log(err);
				reject(err);
			});
		});
	}
	getCourseByCurriculum(year, semester, curriculum){
		return new Promise((resolve, reject)=>{
			this.courseDao.findByCurriculum(year, semester, curriculum).then((rows)=>{
				let dtos = this.courseTransformer.rowsToDTO(rows);
				resolve(dtos);
			})
			.catch((err)=>{
				console.log(err);
				reject(err);
			});
		});
	}
	getCourseByInfo(courseName, courseId, professorName) {
		return new Promise((resolve, reject)=>{
			this.courseDao.findByInfo(courseName, courseId, professorName).then((rows)=>{
				let dtos = this.courseTransformer.rowsToDTO(rows);
				resolve(dtos);
			})
			.catch((err)=>{
				console.log(err);
				reject(err);
			});
		});
	}
};
module.exports = new CourseService();