const express = require('express');
// const {getData} = require('./parser');

const app = express();
const port = 3000;
const LOCAL_ADDRESS = '0.0.0.0';
// const cors = require('cors');

const courseRouter = require('./domain/course/controller/CourseController');
const authRouter = require('./domain/user/controller/UserAuthController');

const corsHandler = (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	res.header('Access-Control-Allow-Methods','GET, POST, PUT, DELETE');
	next();
};

app.use(corsHandler);
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/course', courseRouter);
app.use('/auth', authRouter);

app.listen(port, LOCAL_ADDRESS, () =>{
	console.log(`Server running at localhost:${port}`);
})