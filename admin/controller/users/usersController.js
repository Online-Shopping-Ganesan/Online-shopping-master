const usersModel = require("../../model/users/usersModel");

module.exports = {
	getAdminUserList: function(req, res) {
	   usersModel.getAdminUserList((err, rows) => {
		   	if(!err && rows && typeof rows == 'object'){
		    	res.render('users/adminUsersList', {data: rows });
		    } else{
		    	res.render('users/adminUsersList', { error: err });
		    }
		});
    },
    createAdminUser: function(req, res) {
    	usersModel.createAdminUser(req.body, (response) => {
    		if(response.error === false && !req.body.id){
    			response.body = {};
			}
    		res.render('users/createAdminUser', response);
	    });
    },
    editAdminUser: function(req, res) {
	    usersModel.getSingleUser(req.params.id, (response) => {
	   		if(response.error === true){
	   			return res.redirect('/admin/logout');
	   		}
	   		response.body.editProfile = req.body.editProfile;
	   		res.render('users/createAdminUser', response);
	    });
	},
	updateAdminUser: function(req, res) {
    	usersModel.updateAdminUser(req.body, (response) => {
    		response.body = req.body;
    		res.render('users/createAdminUser', response);
	    });
    },
    deleteAdminUser: function(req, res) {
    	const adminUserId = parseInt(req.body.adminUserId);
    	if(Number.isInteger(adminUserId)){
    		usersModel.deleteAdminUser(adminUserId, (response) => {
    			if(response.error === true){
    				res.render('users/adminUsersList', { error: response.msg  });
    		    } else{
    		    	res.redirect('/admin/adminUsersList/');
    		    }
    	    });
    	}else{
    		res.render('users/adminUsersList', { error: 'Opps something went wrong!'  });
    	}
    	
    },
}