const adminMiddleware = {
	checkAuthenticatePages: function(req, res, next){
		req.session && req.session.user ? next() : res.redirect('/admin')
	},
	checkNonAuthenticatePages: function(req, res, next) {
        req.session && req.session.user ? res.redirect('/admin/dashboard') : next();
    },
    checkIsAdminPages: function(req, res, next) {
        req.session && req.session.user && req.session.user.is_admin === 1 ? next() : res.redirect('/admin/logout');
    },
}

module.exports = adminMiddleware;