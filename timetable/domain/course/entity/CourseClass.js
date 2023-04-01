class CourseClass{
	constructor(courseId, classId, rating, capacity, professor){
		this.courseId = courseId;
		this.classId = classId;
		this.rating = rating;
		this.capacity = capacity;
		this.professor = professor;
	}
	constructor(){
		this.courseId = '';
		this.classId = '';
		this.rating = 0;
		this.capacity = 0;
		this.professor = '';
	}
};