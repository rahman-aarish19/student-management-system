const express = require('express');
const passport = require('passport');
const router = express.Router();

const moment = require('moment');
const bcrypt = require('bcryptjs');

const {
    User,
    validateUser,
    confirmPassword
} = require('../models/user');

const {
    ensureAuthenticated,
    isAdmin,
    isLoggedIn
} = require('../helpers/auth');

// Public Routes.

// GET Signin Route.
router.get('/signin', isLoggedIn, (req, res) => {
    res.render('users/signin', {
        title: 'Please Sign in',
        breadcrumbs: false,
        layout: 'signin'
    });
});

// POST Signin Route.
router.post('/signin', isLoggedIn, (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/signin',
        failureFlash: true
    })(req, res, next);
});

// Signout Route
router.get('/signout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You have successfully signed out of the application.');
    res.redirect('/users/signin');
});

// GET Signup Route.
router.get('/signup', isLoggedIn, (req, res) => {
    res.render('users/signup', {
        title: 'Sign up',
        breadcrumbs: false,
        layout: 'signin'
    })
});

// POST Signup Route.
router.post('/signup', isLoggedIn, async (req, res) => {
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
    }
});



// Protected Routes.

router.get('/', [ensureAuthenticated, isAdmin], (req, res) => {
    res.render('users/index', {
        title: 'Users',
        breadcrumbs: true
    });
});

router.get('/requests', [ensureAuthenticated, isAdmin], async (req, res) => {
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

router.put('/requests/:id', [ensureAuthenticated, isAdmin], async (req, res) => {
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

router.delete('/requests/:id', [ensureAuthenticated, isAdmin], async (req, res) => {
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

router.get('/edit', async (req, res) => {
    const result = await User.findOne({
        _id: req.query.id
    });

    if (result) {
        res.render('users/edit', {
            title: 'Edit User',
            breadcrumbs: true,
            result: result
        });
    }
});

module.exports = router;