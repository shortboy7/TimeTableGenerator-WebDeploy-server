const express = require('express');
let router = express.Router();
let courseService = require('../service/CourseService');
/**
 * for course
 */
router.get('/major', async(req, res)=>{
	let major = req.query.major;
	let semester = Number(req.query.semester);
	let year = Number(req.query.year);
	let result = await courseService.getCourseByMajor(major, year, semester);
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");
	res.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, DELETE");
	res.send(result);
});

module.exports = router;