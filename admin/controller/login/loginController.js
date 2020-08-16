const loginModel = require("../../model/login/loginModel")

module.exports = {
   loginValidation: function(req, res) {
	   loginModel.loginValidation(req.body, (err, row) => {
		    if(err){
		    	res.render('index', { error: err });
		    }else{
		    	req.session.user = {f_name: row.f_name, l_name: row.l_name, is_admin: row.is_admin, id: row.id};
		    	res.redirect('/admin/dashboard');
		    }
		})
    }
}