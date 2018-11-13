const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['Accountant', 'Teacher', 'Principal', 'Administrator']
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    privileges: {
        read: {
            type: Boolean,
            default: false
        },
        create: {
            type: Boolean,
            default: false
        },
        update: {
            type: Boolean,
            default: false
        },
        delete: {
            type: Boolean,
            default: false
        }
    },
    created: {
        type: String,
        required: true
    },
    request: {
        type: Boolean,
        default: false
    }
});

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = {
        name: Joi.string().required().label(' Full Name '),
        email: Joi.string().email().required().label(' Email Address '),
        password: Joi.string().required().label(' Password '),
        password2: Joi.string().required().label(' Confirm Password '),
        role: Joi.string().required().label(' User Role '),
        //isAdmin: Joi.boolean().required().label(' isAdmin ')
    }

    return Joi.validate(user, schema);
}

function confirmPassword(passwd, passwd2) {
    if (passwd != passwd2) {
        return true;
    } else {
        return false;
    }
}

exports.User = User;
exports.validateUser = validateUser;
exports.confirmPassword = confirmPassword;