const express = require('express');
const {getData} = require('./parser')
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
	let promises = getData();
	Promise.allSettled(promises).then((data) => {
		let result = data[0].value.concat(data[1].value);
		console.log(result);
		let jsonData = JSON.stringify(result);
		console.log(jsonData);
		res.send(jsonData);
	});
});

app.listen(port, () =>{
	console.log(`Server running at localhost:3000`);
})