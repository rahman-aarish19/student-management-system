const express = require('express');
const router = express.Router();
const moment = require('moment');
const randomString = require('randomstring');

const {
    Department
} = require('../models/department');

const {
    StudentId,
    Student
} = require('../models/student');

const {
    StudentFee,
    validateFee
} = require('../models/feeManagement');

router.get('/', async (req, res) => {
    /*const dept = await Department.find();

    if (dept) {
        res.render('fee-management/index', {
            title: 'Fee Management',
            breadcrumbs: true,
            search_box: true,
            dept: dept
        });
    }*/
    res.render('fee-management/index', {
        title: 'Fee Management',
        breadcrumbs: true
    })
});

router.get('/pay', async (req, res) => {
    const paymentId = randomString.generate({
        length: 16,
        charset: 'numeric'
    });

    res.render('fee-management/pay', {
        title: 'Pay Fee',
        breadcrumbs: true,
        paymentId: paymentId
    });
});

router.post('/pay', async (req, res) => {
    let errors = [];

    const {
        error
    } = validateFee(req.body);

    if (error) {
        errors.push({
            text: error.details[0].message
        });
        res.render('fee-management/pay', {
            title: 'Pay Fee',
            breadcrumbs: true,
            errors: errors,
            body: req.body
        });
    } else {
        const payment = new StudentFee({
            studentRoll: req.body.studentRoll,
            studentName: req.body.studentName,
            class: req.body.studentClass,
            section: req.body.studentSection,
            department: req.body.studentDept,
            course: req.body.studentCourse,
            amountPaid: req.body.amountPaid,
            amountDue: req.body.amountDue || 0,
            dueDate: req.body.dueDate,
            lateSubmissionFine: req.body.lateFine || 0,
            paymentId: req.body.paymentId
        });

        try {
            const result = await payment.save();

            if (result) {
                req.flash('success_msg', 'Payment Successfull.');
                res.redirect('/fee-management');
            }
        } catch (ex) {
            for (i in ex.errors) {
                errors.push({
                    text: ex.errors[i].message
                });
            }

            res.render('fee-management/pay', {
                title: 'Pay Fee',
                breadcrumbs: true,
                errors: errors,
                body: req.body
            });
        }
    }
});

module.exports = router;