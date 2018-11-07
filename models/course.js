const Joi = require('joi');
const mongoose = require('mongoose');
//const mongoosePaginate = require('mongoose-paginate');

const courseSchema = new mongoose.Schema({
    departmentName: {
        type: String,
        required: true
    },
    courseName: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return v && v.length > 3;
            },
            message: 'The length of course name must be greater than 3.'
        }
    },
    courseDuration: {
        type: Number,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    courseFee: {
        type: Number,
        required: true
    },
    intake: {
        type: Number,
        required: true
    }
});

const Course = mongoose.model('Course', courseSchema);

function validateCourse(course) {
    const schema = {
        departmentName: Joi.string().required().label(' Department Name '),
        courseName: Joi.string().required().label('Course Name'),
        courseDuration: Joi.number().required().label('Course Duration'),
        startDate: Joi.date().required().label('Course Start Date'),
        endDate: Joi.date().required().label('Course End Date'),
        courseFee: Joi.number().required().label('Course Fee '),
        intake: Joi.number().required().label('Course Intake ')
    }

    return Joi.validate(course, schema);
}

exports.Course = Course;
exports.validateCourse = validateCourse;