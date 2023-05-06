class CourseService{
	constructor(){
		this.courseDao = require('../dao/CourseDAO');
		this.courseTransformer = require('../transformer/CourseTransformer');
	}
	getCourseByMajor(major, year, semester){
		return new Promise((resolve, reject)=>{
			this.courseDao.findByMajor(major, year, semester).then((rows)=>{
				console.log('In service');
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
};
module.exports = new CourseService();