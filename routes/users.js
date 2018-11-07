const express = require('express');
const router = express.Router();

const moment = require('moment');
const bcrypt = require('bcryptjs');

const {
    User,
    validateUser,
    confirmPassword
} = require('../models/user');

router.get('/', (req, res) => {
    res.render('users/index', {
        title: 'Users',
        breadcrumbs: true
    });
});

router.get('/requests', async (req, res) => {
    const requests = await User.find({
        request: false
    });

    if (requests) {
        res.render('users/requests', {
            title: 'Requests',
            breadcrumbs: true,
            requests: requests
        });
    } else {
        res.render('users/requests', {
            title: 'Requests',
            breadcrumbs: true
        });
    }
});

router.put('/requests/:id', async (req, res) => {
    const result = await User.updateOne({
        _id: req.params.id
    }, {
        $set: {
            request: true
        }
    });

    if (result) {
        req.flash('success_msg', 'Registration approved!');
        res.redirect('/users/requests');
    } else {
        req.flash('error_msg', 'Opps! Something went wrong.');
        res.redirect('/users/requests');
    }
});

router.delete('/requests/:id', async (req, res) => {
    const result = await User.deleteOne({
        _id: req.params.id
    });

    if (result) {
        req.flash('success_msg', 'Request deleted successfully!');
        res.send('/users/requests');
    } else {
        req.flash('error_msg', 'Opps! Something went wrong.');
        res.redirect('/users/requests');
    }
});

router.get('/signin', (req, res) => {
    res.render('users/signin', {
        title: 'Please Sign in',
        breadcrumbs: false,
        layout: 'signin'
    });
});

router.get('/signup', (req, res) => {
    res.render('users/signup', {
        title: 'Sign up',
        breadcrumbs: false,
        layout: 'signin'
    })
});

router.post('/signup', async (req, res) => {
    let errors = [];

    const {
        error
    } = validateUser(req.body);

    const isMatch = confirmPassword(req.body.password, req.body.password2);

    if (error) {
        errors.push({
            text: error.details[0].message
        });

        res.render('users/signup', {
            title: 'Sign up',
            breadcrumbs: false,
            layout: 'signin',
            errors: errors,
            body: req.body
        });
    } else if (isMatch) {
        errors.push({
            text: 'Passwords do not match!'
        });

        res.render('users/signup', {
            title: 'Sign up',
            breadcrumbs: false,
            layout: 'signin',
            errors: errors,
            body: req.body
        });
    } else {
        const email = await User.findOne({
            email: req.body.email
        });

        if (email) {
            errors.push({
                text: 'Email address already exists!'
            });

            res.render('users/signup', {
                title: 'Sign up',
                breadcrumbs: false,
                layout: 'signin',
                errors: errors,
                body: req.body
            });
        } else {
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role,
                isAdmin: req.body.isAdmin,
                created: moment(Date.now()).format('LL')
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(user.password, salt, (err, hash) => {
                    if (err) throw err;
                    user.password = hash;
                    user.save().then(user => {
                        req.flash('success_msg', 'Registration successful!');
                        res.redirect('/users/signin');
                    }).catch(err => {
                        console.log(err);
                        return;
                    });
                });
            });
        }

        /*    const result = await user.save();

            if (user) {
                req.flash('success_msg', 'Registration successfull');
                res.redirect('/users/signin');
            } else {
                req.flash('error_msg', 'Opps! Something went wrong...');
                res.redirect('/users/signup');
            }*/
    }
});

module.exports = router;