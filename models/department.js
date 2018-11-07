const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    dname: {
        type: String,
        required: true
    }
});

const Department = mongoose.model('Department', departmentSchema);

exports.Department = Department;