const CourseDTO = require('../DTO/courseDTO.js');

class CourseTransformer{
	 _getPreviousSentence(text, word) {
		const index = text.indexOf(word);

		if (index !== -1) {
			const result = text.substring(0, index);
			return result;
		} else {
			console.log("학년이라는 단어가 없습니다.");
			return text;
		}
	}

	_getTime(day, start_time, end_time) {
		if (day == undefined || day == null || day == "" ||
		start_time == undefined || start_time == null || start_time == "" ||
		end_time == undefined || end_time == null || end_time == "")
			return {
				day : '*',
				begin : 0,
				end:0
			};

		let obj = {};
		obj['day'] = day;
		// console.log(strs.split("/"[1]));
		let [b,e] = [start_time.split(':'), end_time.split(':')];
		obj['begin'] = Number(b[0]) * 60 + Number(b[1]);
		obj['end'] = Number(e[0]) * 60 + Number(e[1]);
		return obj;
	}

	_getLecture(rows) {
		let lectureMap = new Map();
		for (let row of rows){
			let key = row['courseNumber'] + '-' + row['classId'];
			if (lectureMap.has(key)){
				let info = lectureMap.get(key);
				info.push({
					'Time' : this._getTime(row['day'], row['start_time'], row['end_time']),
					'Room' : row['room']
				});
			}else{
				lectureMap.set(key, [{
					'Time' : this._getTime(row['day'], row['start_time'], row['end_time']),
					'Room' : row['room']
				}]);
			}
		}
		return lectureMap;
	}
	_getGrades(grades){
		let n_grades = [];
		if (grades == '전체학년')
			return [1,2,3,4,5,6];
		let pure = this._getPreviousSentence(grades, "학년");
		if (pure === null)
			return null;
		let hyphen = /-/;
		if (hyphen.test(pure)) {
			let [start, end] = pure.split('-');
			for (let i = Number(start); i <= Number(end); i++)
				n_grades.push(i);
		}else {
			let tokens = pure.split(',');
			for (let token of tokens)
				n_grades.push(Number(token));
		}
		return n_grades;
	}

	rowsToDTO(rows){
		let LecutreInfo = this._getLecture(rows);
		let result = [];
		for (let row of rows){
			let Id = {
				'base' : row['courseNumber'],
				'id' : row['classId']
			};
			let Grades = this._getGrades(row['grade']);
			let courseDTO = new CourseDTO(
				Grades,
				row['curriculumn'],
				Id,
				row['name'],
				row['professor'],
				row['rating'],
				row['credit'],
				row['theory'],
				row['practice'],
				LecutreInfo.get(row['courseNumber'] + '-' + row['classId'])
			);
			result.push(courseDTO);
		}
		return result;
	}
};

module.exports = new CourseTransformer();