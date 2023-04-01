class CourseEntity{
	constructor(courseID, name, credit, theory, practice, schedules, professor, year, semester, grades, tags){
		this.classId = courseID.split('-')[1];
		this.courseNumber = courseID.split('-')[0];
		this.name = name;
		this.credit = credit;
		this.theory = theory;
		this.practice = practice;
		this.professor = professor;
		this.year = year;
		this.semester = semester;
		this.schedules = schedules;
		this.grades = grades;
		this.tags = tags;
	}
	constructor() {
		this.classId = '';
		this.courseNumber = '';
		this.name = '';
		this.credit = 0;
		this.theory = 0;
		this.practice = 0;
		this.professor = '';
		this.year = 0;
		this.semester = 0;
		this.schedules = [];
		this.grades = [];
		this.tags = [];
	}
};