const express = require('express');
const faker = require('faker');
const moment = require('moment');
const randomString = require('randomstring');

const router = express.Router();

const {
    StudentId,
    Student,
    validate
} = require('../models/student');

const {
    Department
} = require('../models/department');

const {
    ensureAuthenticated,
    isAdmin,
    isLoggedIn,
    createAccessControl,
    readAccessControl,
    updateAccessControl,
    deleteAccessControl
} = require('../helpers/auth');

// Students Home Route
router.get('/', [ensureAuthenticated, isAdmin, readAccessControl], async (req, res) => {

    const perPage = 7;
    const page = req.query.page || 1;
    const skip = ((perPage * page) - perPage) + 1;
    const sort = req.query.sort || "asc";

    const student = await Student.find()
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort({
            Session: sort
        });

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
router.get('/details', [ensureAuthenticated, isAdmin, readAccessControl], async (req, res) => {
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
router.post('/', [ensureAuthenticated, isAdmin], async (req, res) => {
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
router.get('/add', [ensureAuthenticated, isAdmin, createAccessControl], async (req, res) => {
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
router.post('/add', [ensureAuthenticated, isAdmin, createAccessControl], async (req, res) => {
    const dept = await Department.find();

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
router.get('/edit', [ensureAuthenticated, isAdmin, updateAccessControl], async (req, res) => {
    const student = await Student.findOne({
        _id: req.query.id
    });

    const dept = await Department.find();

    if (student && dept) {
        res.render('students/edit', {
            title: 'Edit Student Details',
            breadcrumbs: true,
            student: student,
            dept: dept
        });
    }
});

// Student Update Route
router.put('/:id', [ensureAuthenticated, isAdmin, updateAccessControl], async (req, res) => {

    const {
        error
    } = validate(req.body);

    if (error) {
        req.flash('error_msg', error.details[0].message);
        res.redirect(`/students/edit?id=${req.params.id}`);
    } else {
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
                CourseName: req.body.CourseName,
                BranchName: req.body.BranchName,
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
    }
});

router.delete('/:id', [ensureAuthenticated, isAdmin, deleteAccessControl], async (req, res) => {
    const result = await Student.remove({
        _id: req.params.id
    });

    if (result) {
        req.flash('success_msg', 'Record deleted successfully.');
        res.send('/students');
    } else {
        res.status(500).send();
    }
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

router.delete('/details/:id', [ensureAuthenticated, isAdmin, deleteAccessControl], async (req, res) => {
    const result = await Student.remove({
        _id: req.params.id
    });

    if (result) {
        req.flash('success_msg', 'Record deleted successfully.');
        res.redirect('/students');
    }
});

// Faker
router.get('/faker', async (req, res) => {
    for (let i = 0; i < 10; i++) {
        const student = new Student({
            StudentName: {
                FirstName: faker.name.firstName(),
                LastName: faker.name.lastName(),
            },
            Gender: 'Male',
            Category: 'General',
            DateOfBirth: moment(faker.date.past()).format('LL'),
            DateOfAdmission: moment(faker.date.recent()).format('LL'),
            Religion: 'Others',
            FathersName: faker.name.findName(),
            FathersEducationalQualification: faker.name.jobArea(),
            FathersOccupation: faker.name.jobTitle(),
            MothersName: faker.name.findName(),
            MothersEducationalQualification: faker.name.jobArea(),
            MothersOccupation: faker.name.jobTitle(),
            Email: faker.internet.email(),
            PhoneNumber: faker.phone.phoneNumber(),
            Address: {
                Address_Line_1: `${faker.address.streetAddress()} , ${faker.address.streetName()}`,
                City: faker.address.city(),
                State: faker.address.state(),
                PostalCode: faker.address.zipCode(),
                Country: faker.address.country()
            },
            CourseName: 'XYZ',
            BranchName: 'XYZ',
            Class: '1st Semester',
            Section: 'A',
            Session: '2013-2016',
            StudentId: new StudentId({
                ClassRollNo: randomString.generate({
                    length: 8,
                    charset: 'numeric'
                }),
                RegistrationNo: randomString.generate({
                    length: 8,
                    charset: 'numeric'
                })
            }),
        });

        const result = await student.save();
    }
});

module.exports = router;