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

const {
    ensureAuthenticated,
    isAdmin,
    readAccessControl,
    createAccessControl,
    updateAccessControl,
    deleteAccessControl
} = require('../helpers/auth');

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

router.get('/', [ensureAuthenticated, isAdmin, readAccessControl], async (req, res) => {

    const perPage = 8;
    const page = req.query.page || 1;
    const skip = ((perPage * page) - perPage);

    const dept = await Department.find();
    const course = await Course.find().skip(skip).limit(perPage);

    if (dept && course) {
        const pages = await Course.find().countDocuments();

        res.render('courses/index', {
            title: 'Courses',
            breadcrumbs: true,
            search_bar: true,
            dept: dept,
            course: course,
            current: parseInt(page),
            pages: Math.ceil(pages / perPage)
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

router.get('/add', [ensureAuthenticated, isAdmin, createAccessControl], async (req, res) => {
    const dept = await Department.find();

    if (dept) {
        res.render('courses/add', {
            title: 'Add New Course',
            breadcrumbs: true,
            dept: dept
        });
    }
});

router.post('/add', [ensureAuthenticated, isAdmin, createAccessControl], async (req, res) => {
    let errors = [];
    const dept = await Department.find();

    const {
        error
    } = validateCourse(req.body);

    if (error) {

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
        }
    }
});

router.get('/edit', [ensureAuthenticated, isAdmin, updateAccessControl], async (req, res) => {
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

router.put('/:id', [ensureAuthenticated, isAdmin, updateAccessControl], async (req, res) => {
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

router.delete('/:id', [ensureAuthenticated, isAdmin, deleteAccessControl], async (req, res) => {
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