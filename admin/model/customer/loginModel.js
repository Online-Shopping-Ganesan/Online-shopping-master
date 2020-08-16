const Customer = require("../../tblMapping/Customer");
const State = require("../../tblMapping/State");
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid');
const common = require('../../common.js');
const { Op } = require("sequelize");
const saltRounds = process.env.CRYPT_SALT;
const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports = {
	customerLoginValidation: function(data, callback) {
		Customer
	    .findOne({ 
	    	attributes: ['id', 'f_name', 'l_name', 'email', 'mobile', 'address_1', 'address_2', 'city', 'state_id', 'pincode', 'pwd'],
	    	where: { email: data.email, active: 1 } 
	    })
	    .then(row => {
	    	if (!row || !bcrypt.compareSync(data.password, row.pwd)) {
	    		 callback({error: true, msg:'Invalid User namd and Password'});
		     } else {
		    	 
		    	 callback({error: false, data: row.get()});
		     }
	    }).catch(err => {
	    	callback({error: true, msg:'Opps something went wrong!'});
	    });
    },
    getCustomerDtls: function(id, callback) {
		Customer
	    .findOne({ 
	    	attributes: ['f_name', 'l_name', 'email', 'mobile', 'address_1', 'address_2', 'city', 'state_id', 'pincode'],
	    	where: { id, active: 1 } 
	    })
	    .then(row => {
	    	 if (!row) {
	    		 callback({error: true, msg:'Invalid access token'});
		     } else {
		    	 
		    	 callback({error: false, data: row.get()});
		     }
	    }).catch(err => {
	    	callback({error: true, msg:'Opps something went wrong!'});
	    });
    },
    getAllStates: function(callback){
    	State
	    .findAll({attributes: ['id', 'name']})
	    .then(rows => {
	    	callback({error: false, data: rows});
	    }).catch(err => {
	    	callback({error: true, data: 'State fetching failed'});
	    });
    },
    customerRegisteration: function(data, id, callback) {
    	const {f_name, l_name, mobile, email, pwd, address_1, address_2, city, pincode, state_id} = data;
    	
    	let updateObj = { 
    			f_name: common.ucwords(f_name),
    			l_name: common.ucwords(l_name),
    			mobile:  mobile,
    			email: email.toLowerCase(),
    			address_1,
    			address_2,
    			city,
    			pincode,
    			state_id: parseInt(state_id),
    			active: 1,
	    };
    	if(pwd){
    		const salt = bcrypt.genSaltSync(parseInt(saltRounds));
        	const hash = bcrypt.hashSync(pwd, salt);
        	updateObj.pwd = hash;
    	}
    	const customerQuery = id > 0 ? Customer.update(updateObj, { where: { id }}) : Customer.create(updateObj);
    	customerQuery
	    .then(row => {
	    	callback({error: false, msg:'Customer registered successfully'})
	    }).catch(err => {
	    	callback({error: true, msg:'Opps something went wrong!'});
	    });
    },
    findCustomerByEmail: function(email, id) {
  	  	email = email.toLowerCase();
  	  	return  id > 0 ? Customer.count({ where: { email, id: {[Op.not]: id } }  }) : Customer.count({ where: { email }  });
    },
    findCustomerByMobile: function(mobile, id) {
  	  	return  id > 0 ? Customer.count({ where: { mobile, id: {[Op.not]: id } }  }) : Customer.count({ where: { mobile }  });
    },
    checkIsValidToken: function(token, callback) {
    	Customer
	    .count({ 
	    	attributes: ['id', 'f_name', 'l_name'],
	    	where: { token, active: 1 } 
	    })
	    .then(count => {
	    	 if(count > 0){
	    		 callback({error: false, msg:''});
	    	 } else {
	    		 callback({error: true, msg:'Invalid Token'});
	    	 }
	     }).catch(err => {
		    	callback({error: true, msg:'Opps something went wrong!'});
		 });
    },
    updateCustomerPwd: function(body, callback) {
    	const {pwd, token} = body;
    	const salt = bcrypt.genSaltSync(parseInt(saltRounds));
    	const hash = bcrypt.hashSync(pwd, salt);
    	
    	Customer.update({pwd: hash, token: ''}, { where: { token }})
	    .then(row => {
	    	callback({error: false, msg:'Password Updated Successfully'});
	     }).catch(err => {
		     callback({error: true, msg:'Password Updation Failed'});
		 });
    },
    checkIsValidEmail: function(email, callback) {
    	Customer
	    .findOne({ 
	    	attributes: ['id', 'f_name', 'l_name'],
	    	where: { email, active: 1 } 
	    })
	    .then(row => {
	    	
	    	 if (!row) {
	    		 callback({error: true, msg:'Email does not exist'});
		     } else {
		    	 const gmailUserName = process.env.GMAIL_USERNAME;
		    	 const gmailPwd = process.env.GMAIL_PASSWORD;
		    	 const baseURL = process.env.BASE_CLIENT_URL;
		    	 
		    	 if(gmailUserName && gmailPwd){
		    		 const customer = row.get();
			    	 const token = uuidv4.v4();
			    	 
			    	 const transporter = nodemailer.createTransport({
			    		  service: 'gmail',
			    		  auth: {
			    			  user: gmailUserName,
				    		  pass: gmailPwd
			    		  }
			    	 });

			    	 const mailOptions = {
			    		  from: gmailUserName,
			    		  to: email,
			    		  subject: 'Onlineshopping: Password Reset',
			    		  html: `Hi ${customer.f_name}  ${customer.l_name}, <br><br>\t\t  Use the below link and reset your password.
			    		  <br>\t\t <a href="${baseURL}store/forgotPassword?token=${token}" target="_blank">Click Here</a>
			    		  <br><br>Thanks,<br/>Online shopping.`
			    	 };

			    	 transporter.sendMail(mailOptions, function(error, info){
			    		  if (error) {
			    			  callback({error: true, msg:'Mail not sent, Please try agian'});
			    		  } else {
			    			  Customer.update({token}, { where: { id: customer.id }})
			    			  callback({error: false, msg:'Mail sent, Please check your email.'});
			    		  }
			    	 });
		    	 }else{
		    		 callback({error: true, msg:'Please configure Gmail user name and password in .env file'});
		    	 }
		    	 
		    	 
		     }
	    }).catch(err => {
	    	callback({error: true, msg:'Opps something went wrong!'});
	    });
    },
    customerAddressUpd: function(data, id, callback) {
    	const {address_1, address_2, city, pincode, state_id} = data;
    	
    	let updateObj = { 
    			address_1,
    			address_2,
    			city,
    			pincode,
    			state_id: parseInt(state_id),
    	};
    	Customer.update(updateObj, { where: { id }})
	    .then(row => {
	    	callback({error: false, msg:'Customer address updated successfully'})
	    }).catch(err => {
	    	callback({error: true, msg:'Opps something went wrong!'});
	    });
    },
    getCustomerList: function(callback) {
    	Customer
	    .findAll({ 
	    	attributes: ['id', 'f_name', 'l_name', 'email', 'mobile','active'],
	    })
	    .then(rows => {
	    	 if (!rows) {
	    		 callback('Customer List fetching issue..');
		     } else {
		    	 callback(null, rows)
		     }
	    }).catch(err => {
	    	callback('Opps something went wrong!');
	    });
    },
    getSingleCustomer: function(id, callback) {
    	const state = State.findAll({attributes: ['id', 'name']});
    	const cusotmer = Customer.findOne({ where: { id }, attributes: ['f_name', 'l_name', 'email', 'mobile', 'address_1', 'address_2', 'city', 'state_id', 'pincode', 'active'] });
    	const promise = Promise.all([state, cusotmer]);
    	
    	promise.then(resp => { console.log(resp);
	    	 if (!resp[1]) {
	    		 callback({error: true, msg:'Invalid Data'});
		     } else {
		    	 callback({error: false, msg:null, body: {customerDtls: resp[1], stateList: resp[0]}})
		     }
	    }).catch(err => {
	    	 callback({error: true, msg:'Opps something went wrong!'});
	    });
    },
}