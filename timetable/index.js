const express = require('express');
const {getData} = require('./parser');
require('dotenv').config({path: '../.env'});
const app = express();
const port = process.env.PORT || 3000;
const LOCAL_ADDRESS = process.env.LOCAL_ADDRESS || '0.0.0.0';

app.use(express.json());

app.get('/', (req, res) => {
	console.log('root');
	getData().then((readPromises) =>{
		Promise.allSettled(readPromises).then(data=> {
			let map =
			data.reduce((total, item) => {
				if (item.status === 'fulfilled'){
					if (total.length == 0)
						total = item.value;
					else
						total = total.concat(item.value);
					}
				return total;
			}, []);
			map =
			map.reduce((map, course) => {
				const key = course.CourseId.base + '-' + course.CourseId.id;
				if (!map.has(key)) {
					return map.set(key, course);
				}else{
					return map;
				}
			}, new Map());
			let result = [];
			map.forEach((value) => {
				result.push(value);
			});
			let jsonData = JSON.stringify(result);
			res.setHeader("Access-Control-Allow-Origin", "*");
			res.setHeader("Access-Control-Allow-Headers", "Content-Type");
			res.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, DELETE");
			res.send(jsonData);
		});
	});
});

app.get('/:major', (req, res) => {
	let major = req.params.major;
	if (major === 'favicon.ico')
	{
		res.send('');
		return ;
	}
	let promises = getData(major +".csv");
	if (promises.length === 0)
	{
		res.send('');
		return ;
	}
	Promise.allSettled(promises).then(data=> {
		let result =
		data.reduce((total, item) => {
			if (item.status === 'fulfilled'){
				if (total.length == 0)
					total = item.value;
				else
					total = total.concat(item.value);
				}
			return total;
		}, []);
		let jsonData = JSON.stringify(result);
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Headers", "Content-Type");
		res.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, DELETE");
		res.send(jsonData);
	});
});

app.listen(port, LOCAL_ADDRESS,  () =>{
	console.log(`Server running at localhost:${port}`);
})