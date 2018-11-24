module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        req.flash('error_msg', 'You must login first');
        res.redirect('/users/signin');
    },
    isAdmin: function (req, res, next) {
        if (req.user.isAdmin == true) {
            return next();
        }

        res.render('errors', {
            title: '403 - Forbidden',
            message: '403 - Forbidden',
            description: 'The request was valid, but the server is refusing action. This happened may be because you might not have the necessary permissions for this resource, or this resource may need an account of some sort.'
        });
    },
    isLoggedIn: function (req, res, next) {
        if (!(req.isAuthenticated())) {
            return next();
        }

        req.flash('error_msg', 'You are already signed in.');
        res.redirect('/dashboard');
    },
    readAccessControl: function (req, res, next) {
        if (req.user.privileges.read == true) {
            return next();
        }

        req.flash('error_msg', 'You do not have the required permissions to perform this action.');
        res.redirect('/dashboard');
    },
    createAccessControl: function (req, res, next) {
        if (req.user.privileges.create == true) {
            return next();
        }

        req.flash('error_msg', 'You do not have the required permissions to perform this action.');
        res.redirect('/dashboard');
    },
    updateAccessControl: function (req, res, next) {
        if (req.user.privileges.update == true) {
            return next();
        }

        req.flash('error_msg', 'You do not have the required permissions to perform this action.');
        res.redirect('/dashboard');
    },
    deleteAccessControl: function (req, res, next) {
        if (req.user.privileges.delete == true) {
            return next();
        }

        req.flash('error_msg', 'You do not have the required permissions to perform this action.');
        res.redirect('/dashboard');
    }
}