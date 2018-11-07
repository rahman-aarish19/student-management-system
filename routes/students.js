const express = require('express');
const faker = require('faker');
const moment = require('moment');

const router = express.Router();

const {
    StudentId,
    Student,
    validate
} = require('../models/student');

const {
    Department
} = require('../models/department');

// Students Home Route
router.get('/', async (req, res) => {

    const perPage = 10;
    const page = req.query.page || 1;
    const skip = ((perPage * page) - perPage) + 1;
    //const sortParam = req.query.session || "2013-2016";
    const sort = req.query.sort || "asc";

    const student = await Student.find()
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort({
            Session: sort
        });

    //console.log(student.length)

    if (student.length > 0) {
        const pages = await Student.countDocuments();

        res.render('students/index', {
            title: 'Students',
            breadcrumbs: true,
            search_bar: true,
            students: student,
            current: parseInt(page),
            pages: Math.ceil(pages / perPage),
            total: pages,
            perPage: perPage,
            skip: skip,
            to: (student.length + 10)
        });
    } else {
        res.render('students/index', {
            title: 'Students',
            breadcrumbs: true,
            search_bar: true
        });
    }
});


// Student Detail's Route
router.get('/details', async (req, res) => {
    const student = await Student.findOne({
        _id: req.query.id
    });

    if (student) {
        res.render('students/details', {
            title: 'Details',
            breadcrumbs: true,
            student: student
        });
    } else {
        req.flash('error_msg', 'No records found...');
    }
});

// Search Student Route.
router.post('/', async (req, res) => {
    let key = req.body.searchInput;

    const student = await Student.find({
        'StudentId.ClassRollNo': key
    });

    if (student.length > 0) {
        res.render('students/index', {
            title: 'Student',
            breadcrumbs: true,
            search_bar: true,
            students: student
        });
    } else {
        req.flash('error_msg', 'Record not found.');
        res.redirect('/students');
    }
});

// Add Student Form Route
router.get('/add', async (req, res) => {
    const dept = await Department.find();

    if (dept) {
        res.render('students/add', {
            title: 'Add New Student',
            breadcrumbs: true,
            dept: dept
        });
    }
});

// Process Students Form Data And Insert Into Database.
router.post('/add', async (req, res) => {
    const dept = await Department.find();

    //let dateOfAdmission = moment(req.body.DateOfAdmission).format('L');
    //let dateOfBirth = moment(req.body.DateOfBirth).format('L');
    let errors = [];

    const {
        error
    } = validate(req.body);

    if (error) {
        errors.push({
            text: error.details[0].message
        });
        res.render('students/add', {
            title: 'Add Student',
            breadcrumbs: true,
            dept: dept,
            errors: errors,
            body: req.body
        });
    } else {
        const student = new Student({
            StudentName: {
                FirstName: req.body.FirstName,
                LastName: req.body.LastName
            },
            Gender: req.body.Gender,
            Category: req.body.Category,
            DateOfBirth: req.body.DateOfBirth,
            DateOfAdmission: req.body.DateOfAdmission,
            Religion: req.body.Religion,
            FathersName: req.body.FathersName,
            FathersEducationalQualification: req.body.FathersEducationalQualification,
            FathersOccupation: req.body.FathersOccupation,
            MothersName: req.body.MothersName,
            MothersEducationalQualification: req.body.MothersEducationalQualification,
            MothersOccupation: req.body.MothersOccupation,
            Email: req.body.Email,
            PhoneNumber: req.body.PhoneNumber,
            Address: {
                Address_Line_1: req.body.Address,
                City: req.body.City,
                State: req.body.State,
                PostalCode: req.body.PostalCode,
                Country: req.body.Country
            },
            CourseName: req.body.CourseName,
            BranchName: req.body.BranchName,
            Class: req.body.ClassAdmittedTo,
            Section: req.body.Section,
            Session: req.body.Session,
            StudentId: new StudentId({
                ClassRollNo: req.body.ClassRollNo,
                RegistrationNo: req.body.RegistrationNo
            }),
        });

        const result = await Student.findOne({
            'StudentId.ClassRollNo': req.body.ClassRollNo
        });

        if (!result) {
            try {
                const result = await student.save();

                if (result) {
                    req.flash('success_msg', 'Information saved successfully.');
                    res.redirect('/students');
                }
            } catch (ex) {
                for (field in ex.errors) {
                    errors.push({
                        text: ex.errors[field].message
                    });
                    console.log(ex.errors[field]);
                }
                res.render('students/add', {
                    title: 'Add Student',
                    breadcrumbs: true,
                    errors: errors,
                    body: req.body
                });
            }
        } else {
            errors.push({
                text: 'Roll Number Already Exists.'
            });
            res.render('students/add', {
                title: 'Add Student',
                breadcrumbs: true,
                errors: errors,
                body: req.body
            });
        }
    }
});

// Student Edit Form
router.get('/edit', async (req, res) => {
    const student = await Student.findOne({
        _id: req.query.id
    });

    if (student) {
        res.render('students/edit', {
            title: 'Edit Student Details',
            breadcrumbs: true,
            student: student
        });
    }
});

// Student Update Route
router.put('/:id', async (req, res) => {

    const {
        error
    } = validate(req.body);

    if (error) {
        //res.status(400).send(error.details[0].message);
        req.flash('error_msg', error.details[0].message);
        res.redirect(`/students/edit?id=${req.params.id}`);
    }

    const student = await Student.update({
        _id: req.params.id
    }, {
        $set: {
            'StudentName.FirstName': req.body.FirstName,
            'StudentName.LastName': req.body.LastName,
            Gender: req.body.Gender,
            Category: req.body.Category,
            DateOfBirth: req.body.DateOfBirth,
            DateOfAdmission: req.body.DateOfAdmission,
            Religion: req.body.Religion,
            FathersName: req.body.FathersName,
            FathersEducationalQualification: req.body.FathersEducationalQualification,
            FathersOccupation: req.body.FathersOccupation,
            MothersName: req.body.MothersName,
            MothersEducationalQualification: req.body.MothersEducationalQualification,
            MothersOccupation: req.body.MothersOccupation,
            Email: req.body.Email,
            PhoneNumber: req.body.PhoneNumber,
            'Address.Address_Line_1': req.body.Address,
            'Address.City': req.body.City,
            'Address.State': req.body.State,
            'Address.PostalCode': req.body.PostalCode,
            'Address.Country': req.body.Country,
            Class: req.body.ClassAdmittedTo,
            Section: req.body.Section,
            Session: req.body.Session,
            'StudentId.ClassRollNo': req.body.ClassRollNo,
            'StudentId.RegistrationNo': req.body.RegistrationNo
        }
    });

    if (student) {
        req.flash('success_msg', 'Student Details Updated Successfully.');
        res.redirect('/students');
    }
});

router.delete('/:id', async (req, res) => {
    const result = await Student.remove({
        _id: req.params.id
    });

    if (result) {
        req.flash('success_msg', 'Record deleted successfully.');
        res.send('/students');
    } else {
        res.status(500).send();
    }
    /*
        if (result) {
            req.flash('success_msg', 'Record deleted successfully.');
            res.redirect('/students');
        }*/
});

router.delete('/multiple/:id', async (req, res) => {
    let str = req.params.id;

    for (i in str) {
        console.log(i);
    }

    const result = await Student.find({
        _id: {
            $in: []
        }
    });
    console.log(result);
    if (result) {
        req.flash('success_msg', 'Records deleted successfully.');
        res.send('/students');
    } else {
        res.status(500).send();
    }

    //let str = '[' + req.params.id + ']';
    //console.log(str);
});

router.delete('/details/:id', async (req, res) => {
    const result = await Student.remove({
        _id: req.params.id
    });

    if (result) {
        req.flash('success_msg', 'Record deleted successfully.');
        res.redirect('/students');
    }
});

module.exports = router;