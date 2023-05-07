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
	res.send(result);
});

router.get('/all', async(req, res)=>{
	let semester = Number(req.query.semester);
	let year = Number(req.query.year);
	let result = await courseService.getAllCourse(year, semester);
	res.send(result);
});

module.exports = router;