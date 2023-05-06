class CourseDTO{
	constructor(
		Grades,
		Curriculumn,
		CourseId,
		Name,
		Professor,
		Rating,
		Credit,
		Theory,
		Practice,
		LectureInfo
	){
		this.Grades = Grades;
		this.Curriculumn = Curriculumn;
		this.CourseId = CourseId;
		this.Name = Name;
		this.Professor = Professor;
		this.Rating = Rating;
		this.Credit = Credit;
		this.Theory = Theory;
		this.Practice = Practice;
		this.LectureInfo = LectureInfo;
	}
};

module.exports = CourseDTO;