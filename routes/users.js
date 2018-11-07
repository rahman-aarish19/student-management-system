const express = require('express');
const router = express.Router();

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

module.exports = router;