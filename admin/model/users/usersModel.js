const AdminUser = require("../../tblMapping/adminUser");
const bcrypt = require('bcrypt');
const common = require('../../common.js');
const { Op } = require("sequelize");
const saltRounds = process.env.CRYPT_SALT;

module.exports = {
  getAdminUserList: function(callback) {
    AdminUser
    .findAll({ 
    	attributes: ['id', 'f_name', 'l_name', 'email', 'is_admin', 'active'],
    })
    .then(rows => {
    	 if (!rows) {
    		 callback('Admin User List fetching issue..');
	     } else {
	    	 callback(null, rows)
	     }
    }).catch(err => {
    	callback('Opps something went wrong!');
    });
  },
  findUserByEmail: function(email, id) {
	  email = email.toLowerCase();
	  return  id > 0 ? AdminUser.count({ where: { email, id: {[Op.not]: id } }  }) : AdminUser.count({ where: { email }  });
  },
  findUserName: function(u_name, id) {
	  return  id > 0 ? AdminUser.count({ where: { u_name, id: {[Op.not]: id } }  }) : AdminUser.count({ where: { u_name }  });
  },
  getSingleUser: function(id, callback) {
	  AdminUser
	    .findOne({ 
	    	where: { id } 
      })
      .then(row => {
    	 if (!row) {
    		 callback({error: true, msg:'Invalid Data'});
	     } else {
	    	 callback({error: false, msg:null, body: row})
	     }
      }).catch(err => {
    	 callback({error: true, msg:'Opps something went wrong!'});
      });
  },
  deleteAdminUser: function(id, callback) {
	  AdminUser
	    .destroy({ 
	    	where: { id } 
      })
      .then(rowId => {
    	  if(rowId > 0)
    		  callback({error: false, msg:'Deleted Sucessfully'});
    	  else
    		  callback({error: true, msg:'Deletion Failed'});
      }).catch(err => {
    	  callback({error: true, msg:'Opps something went wrong!'});
      });
  },
  createAdminUser: function(data, callback) {
	 const { f_name, l_name, email, u_name, pwd, is_admin, active } = data;
	 const salt = bcrypt.genSaltSync(parseInt(saltRounds));
	 const hash = bcrypt.hashSync(pwd, salt);
	 
	 AdminUser
     .create({ 
    	f_name: common.ucwords(f_name),
    	l_name: common.ucwords(l_name),
    	email:  email.toLowerCase(),
    	u_name,
     	pwd: hash,
     	is_admin: is_admin == 'on' ? 1: 0,
     	active: active == 'on' ? 1: 0
     })
     .then(() => {
     	callback({error: false, msg:'User created successfully'})
     }).catch(err => {
     	callback({error: true, msg:'User creation failed'});
     });
  },
  updateAdminUser: function(data, callback) {
	 const { id, f_name, l_name, email, u_name, pwd, is_admin, active } = data;
	 
	 let updateObj = { 
    	f_name: common.ucwords(f_name),
    	l_name: common.ucwords(l_name),
    	email:  email.toLowerCase(),
    	u_name,
     	is_admin: is_admin == 'on' ? 1: 0,
     	active: active == 'on' ? 1: 0
	 };
	 if(typeof pwd == 'string' && pwd.trim()){
		 const salt = bcrypt.genSaltSync(parseInt(saltRounds));
		 const hash = bcrypt.hashSync(pwd, salt);
		 updateObj['pwd'] = hash;
	 }
	 
	 AdminUser
     .update(updateObj, { where: { id } })
     .then(() => {
     	callback({error: false, msg:'User updated successfully'})
     }).catch(err => {
     	callback({error: true, msg:'User uptaion failed'});
     });
  },
  
}