const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load user model
const {
    User
} = require('../models/user');

module.exports = function (passport) {
    passport.use(new LocalStrategy({
        usernameField: 'email'
    }, (email, password, done) => {

        // Match User
        User.findOne({
            email: email
        }).then(user => {
            if (!user) {
                return done(null, false, {
                    message: 'User does not exist\'s'
                });
            }

            if (user.request == false) {
                return done(null, false, {
                    message: 'Your registration request has\'nt been approved yet'
                });
            }

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;

                if (isMatch) {
                    return done(null, user, {
                        message: 'Welcome Back, ' + user.name
                    });
                } else {
                    return done(null, false, {
                        message: 'Incorrect Password'
                    });
                }
            })
        });
    }));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}