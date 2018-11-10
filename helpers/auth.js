module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        res.render('errors', {
            title: '401 - Unauthenticated',
            message: '401 - Unauthenticated',
            description: 'You don\'nt have the necessary credentials to access this resource. To access this resource you need to provide a valid credentials.'
        });
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
        res.redirect('/');
    }
}