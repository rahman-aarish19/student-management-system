const express = require('express');
const router = express.Router();
const {
    Student
} = require('../models/student');

const {
    Department
} = require('../models/department');

const {
    Course
} = require('../models/course');

router.get('/getStudentInfo', async (req, res) => {
    const studentInfo = await Student.findOne({
        'StudentId.ClassRollNo': req.query.studentRollNo
    });

    if (studentInfo) {
        res.send(studentInfo);
    } else {
        res.status(400).send('Resource not found.');
    }
});

router.get('/get-department', async (req, res) => {
    const dept = await Department.find({}).select({
        dname: 1,
        _id: 0
    });

    if (dept) {
        res.send(dept);
    } else {
        res.status(400).send('Resource not found...');
    }
});

router.get('/get-courses', async (req, res) => {
    const courses = await Course.find({
        departmentName: req.query.deptName
    }).select({
        courseName: 1,
        _id: 0
    });

    if (courses) {
        res.send(courses);
    } else {
        res.status(400).send('Resourse not found...');
    }
});

module.exports = router;