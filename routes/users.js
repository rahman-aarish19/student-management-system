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
    isLoggedIn,
    readAccessControl,
    createAccessControl,
    updateAccessControl,
    deleteAccessControl
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
        successRedirect: '/dashboard',
        successFlash: true,
        failureRedirect: '/users/signin',
        failureFlash: true
    })(req, res, next);
});

// Signout Route
router.get('/signout', [ensureAuthenticated], (req, res) => {
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

router.get('/', [ensureAuthenticated, isAdmin], async (req, res) => {
    let pendingRequests = 0;
    const perPage = 5;
    const page = req.query.page || 1;
    const skip = ((perPage * page) - perPage);

    const users = await User.find({
        request: true
    }).skip(skip).limit(perPage).select({
        name: 1,
        email: 1,
        role: 1,
        created: 1,
        isAdmin: 1,
        'privileges.read': 1,
        'privileges.create': 1,
        'privileges.update': 1,
        'privileges.delete': 1,
        _id: 1
    });

    if (users) {
        const pages = await User.where({
            'request': true
        }).countDocuments();

        User.find({
            request: false
        }).then(user => {
            if (user) {
                pendingRequests = Object.keys(user).length;
                
                res.render('users/index', {
                    title: 'Users',
                    breadcrumbs: true,
                    users: users,
                    pendingRequests: pendingRequests,
                    current: parseInt(page),
                    pages: Math.ceil(pages / perPage)
                });
            }
        }).catch(err => {
            console.log(err);
        });
    } else {
        res.render('users/index', {
            title: 'Users',
            breadcrumbs: true
        });
    }
});

router.delete('/:id', [ensureAuthenticated, isAdmin, deleteAccessControl], async (req, res) => {
    const result = await User.remove({
        _id: req.params.id
    });

    if (result) {
        req.flash('success_msg', 'Record deleted successfully.');
        res.send('/users');
    }
});

// User Registration Requests.
router.get('/requests', [ensureAuthenticated, isAdmin, readAccessControl], async (req, res) => {
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

router.put('/requests/:id', [ensureAuthenticated, isAdmin, updateAccessControl], async (req, res) => {
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

router.delete('/requests/:id', [ensureAuthenticated, isAdmin, deleteAccessControl], async (req, res) => {
    try {
        const result = await User.remove({
            _id: req.params.id
        });

        if (result) {
            req.flash('success_msg', 'Request deleted successfully!');
            res.send('/users/requests');
        } else {
            req.flash('error_msg', 'Opps! Something went wrong.');
            res.redirect('/users/requests');
        }
    } catch (ex) {
        console.log(ex);
    }
});


// Edit User Account.

router.get('/edit/:id', [ensureAuthenticated, isAdmin, updateAccessControl], async (req, res) => {
    const result = await User.findOne({
        _id: req.params.id
    }).select({
        name: 1,
        email: 1,
        role: 1,
        isAdmin: 1,
        privileges: 1
    });

    if (result) {
        res.send(result);
    } else {
        res.status(400).send('Resource not found...');
    }
});

router.put('/edit/:id', [ensureAuthenticated, isAdmin, updateAccessControl], async (req, res) => {
    const result = await User.update({
        _id: req.params.id
    }, {
        $set: {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
            isAdmin: req.body.isAdmin,
            'privileges.read': req.body.read,
            'privileges.create': req.body.create,
            'privileges.update': req.body.update,
            'privileges.delete': req.body.delete
        }
    });

    if (result) {
        req.flash('success_msg', 'User account updated successfully.');
        res.json('/users');
    } else {
        req.flash('error_msg', 'Error creating user.');
        res.status(500).json('/users');
    }
});

module.exports = router;