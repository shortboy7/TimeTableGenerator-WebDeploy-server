const express = require('express');
const {getData} = require('./parser')
const app = express();

app.set('port', 3000);
app.use(express.json());

app.get('/', (req, res) => {
	let promises = getData();
	Promise.allSettled(promises).then((data) => {
		let result = data[0].value.concat(data[1].value);
		let jsonData = JSON.stringify(result);
		res.send(jsonData);
	});
});

app.listen(3000, () =>{
	console.log(`Server running at localhost:3000`);
})