const { json } = require('express');
const fs = require('fs');
const dataDir = './data/major/'

let fileNames = [];

function csvToJson(fileString) {
	let jsonArray = [];
	const rows = fileString.split("\n");
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
				obj[header[j]] = rows[i].substring(left, right);
				if (obj[header[j]].length === 0)
					obj[header[j]] = '*';
				j++;
				left = right + 2;
				right = right + 1;
			}else if (rows[i][right] === ","){
				obj[header[j]] = rows[i].substring(left, right);
				if (obj[header[j]].length === 0)
					obj[header[j]] = '*';
				left = right + 1;
				j++;
			}
		}
		jsonArray.push(obj);
	}
	return jsonArray;
		// console.log(fileString);
}

function getTime(strs) {
	if (strs === '*')
		return {
			day : '*',
			begin : 0,
			end:0
		};
	let obj = {};
	obj['day'] = strs.substring(0, 1);
	// console.log(strs.split("/"[1]));
	time = strs.split("/")[1].split("-");
	let [b,e] = [time[0].split(':'), time[1].split(':')];
	obj['begin'] = Number(b[0]) * 60 + Number(b[1]);
	obj['end'] = Number(e[0]) * 60 + Number(e[1]);
	return obj;
}

function readPromise(filename) {
	return new Promise((resolve, reject) => {
		fs.readFile(dataDir+filename+".csv", 'utf8', (err, data) => {
			if (err) {
				console.log(err);
				reject(err);
			}else{
					let courses = [];
					raw = csvToJson(data);
					raw.forEach((row) => {
						let id = row['CourseId'].split("-");
						let times = row['LectureTime'].split(",");
						let rooms = row['LectureRoom'].split(",");
						let info = [];
						if (times.length === 1 && rooms.length === 1) {
							info.push(
								{
									'Time' : getTime(times[0]),
									'Room' : rooms[0]
								}
							);
						}else{
							if (times.length == 1 && rooms.length != 1)
								times[1] = times[0];
							if (rooms.length == 1 && times.length != 1)
								rooms[1] = rooms[0];
							info.push(
								{
									'Time': getTime(times[0]),
									'Room': rooms[0]
								}
							);
							info.push(
								{
									'Time': getTime(times[1]),
									'Room': rooms[1]
								}
							);
						}
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
								'LectureInfo' : info,
								'Credit' : row['Credit']
							}
						);
					}, courses);
					resolve(courses);
				}
			}
		);
	});
}

function getData(major)
{
	let promises = [];
	if (major == undefined) {
		fs.readdir(dataDir, (err, files) => {
			if (err) {
				console.log(err);
				throw new Error(err.message);
			}
			files.forEach(file=>{
				if (file.endsWith('csv'))
					fileNames.push(file);
			})
		});
		for (let name of fileNames) {
			promises.push(readPromise(name));
		}
	}else{
		promises.push(readPromise(major));
	}
	return promises;
}

module.exports = {
	getData
}
