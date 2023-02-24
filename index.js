const express = require('express');
const {getData} = require('./parser')
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
	getData().then((readPromises) =>{
		Promise.allSettled(readPromises).then(data=> {
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
});

app.get('/:major', (req, res) => {
	let major = req.params.major;
	if (major === 'favicon.ico')
	{
		res.send('');
		return ;
	}
	let promises = getData(major +".csv");
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

app.listen(port, () =>{
	console.log(`Server running at localhost:3000`);
})