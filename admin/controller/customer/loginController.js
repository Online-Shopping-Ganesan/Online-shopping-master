const loginModel = require("../../model/customer/loginModel");
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
	customerLoginValidation: function(req, res) { 
		loginModel.customerLoginValidation(req.body.data, (resp) => { 
		   if(resp.error === false && resp.data.id > 0){
			   const token = jwt.sign({ id: resp.data.id}, process.env.SECRET_KEY, { expiresIn: '2 days' });
			   const {f_name, l_name, email, mobile, address_1, address_2, city, state_id, pincode} = resp.data;
			   res.json({f_name, l_name, email, mobile, address_1, address_2, city, state_id, pincode, token});
		   }else{
			   res.json(resp);
		   }
		});
    },
    getAllStates: function(req, res) {
		loginModel.getAllStates((resp) => {
			res.json(resp);
		});
    },
    customerRegisteration: function(req, res) {
		loginModel.customerRegisteration(req.body, req.id, (resp) => {
			res.json(resp);
		});
    },
    getCustomerDtls: function(req, res) {
    	loginModel.getCustomerDtls(req.id, (resp) => {
			res.json(resp);
		});
    },
    checkIsValidEmail: function(req, res) {
    	loginModel.checkIsValidEmail(req.body.email, (resp) => {
			res.json(resp);
		});
    },
    checkIsValidToken: function(req, res) {
    	loginModel.checkIsValidToken(req.query.token, (resp) => {
			res.json(resp);
		});
    },
    updateCustomerPwd: function(req, res) {
    	loginModel.updateCustomerPwd(req.body, (resp) => {
			res.json(resp);
		});
    },
    customerAddressUpd: function(req, res) {
    	loginModel.customerAddressUpd(req.body, req.id, (resp) => {
			res.json(resp);
		});
    },
    getCustomerList: function(req, res) {
 	   loginModel.getCustomerList((err, rows) => {
 		   	if(!err && rows && typeof rows == 'object'){
 		    	res.render('customers/customersList', {data: rows });
 		    } else{
 		    	res.render('customers/customersList', { error: err });
 		    }
 		});
     },
     editCustomer: function(req, res) {
    	 loginModel.getSingleCustomer(req.params.id, (response) => {
 	   		if(response.error === true){
 	   			return res.redirect('/admin/logout');
 	   		}
 	   		res.render('customers/viewCustomer', response);
 	    });
 	},
}