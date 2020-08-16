const AdminUser = require("../../tblMapping/adminUser");
const bcrypt = require('bcrypt');

module.exports = {
  loginValidation: function(data, callback) {
	AdminUser
    .findOne({ 
    	attributes: ['id', 'f_name', 'l_name', 'is_admin', 'active', 'pwd'],
    	where: { u_name: data.u_name } 
    })
    .then(row => {
    	 if (!row || !bcrypt.compareSync(data.pwd, row.pwd)) {
    		 callback('Invalid User namd and Password');
	     }else if(row.active != 1){
	    	 callback('User account is Inactive, Please contact admin.');
	     } else {
	    	 callback(null, row.get())
	     }
    }).catch(err => {
    	callback('Opps something went wrong!');
    });
  },
}