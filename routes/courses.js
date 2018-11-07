const express = require('express');
const router = express.Router();
const moment = require('moment');
const {
    Department
} = require('../models/department');
const {
    Course,
    validateCourse
} = require('../models/course');

router.get('/getCourse/:deptName', async (req, res) => {
    const course = await Course.find({
        departmentName: req.params.deptName
    }).select({
        courseName: 1,
        _id: 0
    });

    if (course)
        res.send(course);
    else
        res.status(400).send(error.details[0].message);
});

router.get('/', async (req, res) => {

    const dept = await Department.find();
    const course = await Course.find();

    if (dept && course) {
        res.render('courses/index', {
            title: 'Courses',
            breadcrumbs: true,
            search_bar: true,
            dept: dept,
            course: course
        });
    } else if (dept) {
        res.render('courses/index', {
            title: 'Courses',
            breadcrumbs: true,
            search_bar: true,
            dept: dept
        });
    } else {
        req.flash('error_msg', 'No department found');
        res.redirect('/');
    }
});

router.get('/add', async (req, res) => {
    const dept = await Department.find();

    if (dept) {
        res.render('courses/add', {
            title: 'Add New Course',
            breadcrumbs: true,
            dept: dept
        });
    }
});

router.post('/add', async (req, res) => {
    let errors = [];
    const dept = await Department.find();

    const {
        error
    } = validateCourse(req.body);

    if (error) {
        //req.flash('error_msg', error.details[0].message);
        //res.redirect('/courses');

        errors.push({
            text: error.details[0].message
        });
        res.render('courses/add', {
            title: 'Add New Course',
            breadcrumbs: true,
            errors: errors,
            body: req.body,
            dept: dept
        });
    } else {
        let startDate = moment(req.body.startDate).format('MMMM Do YYYY, h:mm:ss a');
        let endDate = moment(req.body.endDate).format('MMMM Do YYYY, h:mm:ss a');

        const course = new Course({
            departmentName: req.body.departmentName,
            courseName: req.body.courseName,
            courseDuration: req.body.courseDuration,
            startDate: startDate,
            endDate: endDate,
            courseFee: req.body.courseFee,
            intake: req.body.intake
        });

        try {
            const result = await course.save();

            if (result) {
                req.flash('success_msg', 'Course saved successfully.');
                res.redirect('/courses');
            }
        } catch (ex) {
            for (field in ex.errors) {
                //req.flash('error_msg', ex.errors[field].message);
                errors.push({
                    text: ex.errors[field].message
                });
            }
            res.render('courses/add', {
                title: 'Add New Course',
                breadcrumbs: true,
                errors: errors,
                body: req.body,
                dept: dept
            });

            //res.redirect('/courses');
        }
    }
});

router.get('/edit', async (req, res) => {
    const dept = await Department.find();
    const course = await Course.findOne({
        _id: req.query.id
    });

    if (course) {
        res.render('courses/edit', {
            title: 'Edit Course',
            breadcrumbs: true,
            dept: dept,
            course: course
        });
    }
});

router.put('/:id', async (req, res) => {
    let startDate = moment(req.body.startDate).format('LL');
    let endDate = moment(req.body.endDate).format('LL');

    const course = await Course.update({
        _id: req.params.id
    }, {
        $set: {
            departmentName: req.body.departmentName,
            courseName: req.body.courseName,
            courseDuration: req.body.courseDuration,
            startDate: startDate,
            endDate: endDate,
            courseFee: req.body.courseFee,
            intake: req.body.intake
        }
    });

    if (course) {
        req.flash('success_msg', 'Course Updated Successfully.');
        res.redirect('/courses');
    } else {
        req.flash('error_msg', 'Error updating documents.');
        res.redirect('/courses');
    }
});

router.delete('/:id', async (req, res) => {
    const result = await Course.remove({
        _id: req.params.id
    });

    if (result) {
        req.flash('success_msg', 'Record deleted successfully.');
        res.send('/courses');
    }
});

// GET Courses AJAX
router.get('/getCourses', (req, res) => {
    res.render('courses/getCourses', {
        title: 'Get Courses By Dept',
        breadcrumbs: true
    });
});

module.exports = router;