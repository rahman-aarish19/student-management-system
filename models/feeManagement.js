const Joi = require('joi');
const mongoose = require('mongoose');

const {
    Course
} = require('../models/course');

let msg = '';
let isValid = true;

const feeSchema = new mongoose.Schema({
    studentRoll: {
        type: String,
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    class: {
        type: String,
            required: true
    },
    section: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    amountPaid: {
        type: Number,
        required: [true, 'Paid amount is required'],
        validate: {
            isAsync: true,
            validator: async function (val) {
                    const course = await Course.findOne({
                        courseName: this.course
                    }).select({
                        courseFee: 1,
                        _id: 0
                    });

                    return (val && val <= course.courseFee);
                },
                message: 'Paid amount cannot be greater than the course fee'
        }
    },
    amountDue: {
        type: Number,
        validate: {
            isAsync: true,
            validator: async function (val) {
                    const course = await Course.findOne({
                        courseName: this.course
                    }).select({
                        courseFee: 1,
                        _id: 0
                    });

                    let pendingAmt = course.courseFee - this.amountPaid;

                    return ((val && (this.amountDue == pendingAmt)) || (this.amountPaid == course.courseFee));
                },
                message: 'Pending amount cannot be greater or less than the remaining course fee'
        }
    },
    dueDate: {
        type: String,
        validate: {
            validator: function (val) {
                if (this.amountDue) {
                    return val
                }
            },
            message: 'Due date is required'
        }
    },
    lateSubmissionFine: {
        type: Number,
        validate: {
            validator: function (val) {
                if (this.dueDate) {
                    return val
                }
            },
            message: 'Late fine amount is required'
        }
    },
    paymentId: {
        type: Number,
        required: true
    }
});

const StudentFee = mongoose.model('StudentFee', feeSchema);

function validateFee(fee) {
    const schema = {
        studentRoll: Joi.string().required().label(' Roll Number '),
        studentName: Joi.string().required().label(' Student Name '),
        studentClass: Joi.string().required().label(' Class '),
        studentSection: Joi.string().required().label(' Section '),
        studentDept: Joi.string().required().label(' Course '),
        studentCourse: Joi.string().required().label(' Course '),
        amountPaid: Joi.number().empty('').label(' Paid Amount '),
        amountDue: Joi.number().empty('').label(' Due Amount '),
        dueDate: Joi.string().empty('').label(' Due Date '),
        lateFine: Joi.number().empty('').label(' Late Fine Amount '),
        paymentId: Joi.number().required().label(' Payment Id ')
    }

    return Joi.validate(fee, schema);
}

exports.StudentFee = StudentFee;
exports.validateFee = validateFee;