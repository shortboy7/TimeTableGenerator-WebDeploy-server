const { json } = require('express');
const fs = require('fs');
const dataDir = './data'
let fileNames = [
	'/major/AI_convergence_department.csv',
	'/major/computer_engineering.csv'
]

function csvToJson(fileString) {
	let jsonArray = [];
	const rows = fileString.split("\r\n");
	const header = rows[0].split(",");
	for(let i = 1 ; i < rows.length; i++) {
		let obj = {};
		let j = 0;
		let left = 0, right = 0;
		for (right = 0 ; right < rows[i].length ; right++) {
			if (rows[i][right] == '"') {
				right++;
				left += 1;
				while (rows[i][right] != '"')
					right++;
				obj[header[j++]] = rows[i].substring(left, right);
				left = right + 2;
				right = right + 1;
			}else if (rows[i][right] === ","){
				obj[header[j++]] = rows[i].substring(left, right);
				left = right + 1;
			}
		}
		jsonArray.push(obj);
	}
	return jsonArray;
		// console.log(fileString);
}

function getTime(strs) {
	let obj = {};
	obj['day'] = strs.substring(0, 1);
	time = strs.split("/")[1].split("-");
	obj['begin'] = time[0].replace(':', '');
	obj['end'] = time[1].replace(':', '');
	return obj;
}

function getData()
{
	let promises = [];
	for (let name of fileNames) {
		promises.push(
			new Promise((resolve, reject) => {
				fs.readFile(dataDir+name, 'utf8', (err, data) => {
					if (err) {
						reject(err);
					}else{
							let courses = [];
							raw = csvToJson(data);
							raw.forEach((row) => {
								id = row['CourseId'].split("-");
								times = row['LectureTime'].split(",");
								if (times.length == 1)
									times[1] = times[0];
								rooms = row['LectureRoom'].split(",");
								if (rooms.length == 1)
									rooms[1] = rooms[0];
								// console.log(times, rooms);
								courses.push(
									{
										'Curriculum' : row['Curriculum'],
										'CourseId' : {
											'base' : id[0],
											'id' : id[1]
										},
										'Name' : row['Name'],
										'Professor' : row['Professor'],
										'LectureInfo' :[
											{
												'Time': getTime(times[0]),
												'Room': rooms[0]
											},
											{
												'Time': getTime(times[1]),
												'Room': rooms[1]
											}
										],
										'Credit' : row['Credit']
									}
								);
							}, courses);
							resolve(courses);
						}
					}
				);
			})
		);
	}
	Promise.allSettled(promises).then(data=> {
		let total = data[0].value.concat(data[1].value);

	});
	return promises;
}

module.exports = {
	getData
}
