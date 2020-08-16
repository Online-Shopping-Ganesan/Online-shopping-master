const { check, validationResult } = require('express-validator');
const usersModel = require("../model/users/usersModel");
const customerLoginModel = require("../model/customer/loginModel");
const orderModel = require("../model/order/orderModel");

module.exports = function(method){
	switch(method){
		case 'validateAdminUser': 
			return [ 
	            check('f_name').notEmpty().withMessage('First Name is empty').isLength({ min: 2, max:64 }).withMessage('First Name should be min 2 and max 64 chars')
	            .matches(/^[a-zA-Z ]*$/)
	            .withMessage('First Name should allow only alphabets '),
	            check('l_name').notEmpty().withMessage('Last Name is empty').isLength({ min: 2, max:64 }).withMessage('Last Name should be min 2 and max 64 chars')
	            .matches(/^[a-zA-Z ]*$/)
	            .withMessage('Last Name should allow only alphabets '),
	            check('email').isEmail().withMessage('Invalid Email').custom((value, { req }) => {
	            	return usersModel.findUserByEmail(value, req.body.id).then(user => {
            		    if (user) {
            		      return Promise.reject('E-mail already in use');
            		    }
            		})
	            }),
	            check('u_name').notEmpty().withMessage('User Name is empty').isLength({ min: 4, max:32 }).withMessage('User Name should be min 4 and max 32 chars')
	            .matches(/^[a-zA-Z0-9]*$/)
	            .withMessage('User Name should allow only alphanumeric without space')
	            .custom((value, { req }) => {
	            	return usersModel.findUserName(value, req.body.id).then(user => {
            		    if (user) {
            		      return Promise.reject('User Name already in use');
            		    }
            		})
	            }),
	            check('pwd')
	            .if((value, { req }) => (!req.body.id || (req.body.id > 0 && req.body.pwd)))
	            .exists()
	            .withMessage('Password should not be empty')
	            .isLength({ min: 8, max:16 })
	            .withMessage('Password should be min 8 and max 16 chars')
	            .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/)
	            .withMessage('Password should be at least one letter, one number and one special character')
	            .custom((value, { req }) => {
	            	  if (value !== req.body.confirmPwd) {
	            		  throw new Error('Password confirmation does not match password');
            		  }
            		  return true;
	            }),
	            check('is_admin').optional().isString(['on', 'off']).withMessage('Invalid admin data'),
	            check('active').optional().isString(['on', 'off']).withMessage('Invalid active data'),
	            (req, res, next) => {
	            	const errors = validationResult(req);
	                if (!errors.isEmpty()){
	                	 let errMsg = {error: true, msg:'', body: req.body};
	                	 errors.errors.map(err => errMsg.msg += err.msg+"<br />")
	                     return res.status(422).render('users/createAdminUser', errMsg);
	                }
	                next();
	            }
	        ]; 
		break;
		case 'validateProduct': 
			return [ 
	            check('prod_cate_id').notEmpty().withMessage('Category should not be empty').isInt({ gt: 0 }).withMessage('Invalid Category'),
	            check('prod_brand_id').notEmpty().withMessage('Brand should not be empty').isInt({ gt: 0 }).withMessage('Invalid Brand'),
	            check('prod_name').notEmpty().withMessage('Product Name should not be empty').isLength({ min: 2, max:64 }).withMessage('Product Name should be min 2 and max 64 chars')
	            .matches(/^[a-zA-Z0-9 ]*$/)
	            .withMessage('Product Name should allow only alphanumeric'),
	            check('prod_desc').notEmpty().withMessage('Product Description should not be empty').isLength({ min: 50, max:1024 }).withMessage('Product Description should be min 50 and max 1024 chars'),
	            check('prod_meta_keyword').exists().isLength({ max:255 }).withMessage('Meta Keywords should be max 255 chars'),
	            check('prod_meta_desc').exists().isLength({ max:255 }).withMessage('Meta Description should be max 255 chars'),
	            check('prod_size').isIn(['S', 'M', 'L', 'XL', 'XXL']).withMessage('Invalid Size'),
	            check('prod_avail_qty')
	            .custom((arr) => {
	            	if (arr.length == 0 || arr.length > 5 || !Number.isInteger(parseInt(arr[0])) || parseInt(arr[0]) <= 0) {
	            		throw new Error('First row Qty should be numeric without decimal');
          		  	}
	            	return true;
	            }),
	            check('prod_price')
	            .custom((arr) => {
	            	if (arr.length == 0 || arr.length > 5 || isNaN(arr[0]) || parseFloat(arr[0]) <= 0) {
	            		throw new Error('First row Price should be numeric');
          		  	}
	            	return true;
	            }),
	            check('active').optional().isString(['on', 'off']).withMessage('Invalid active data'),
	        ]; 
		break;
		case 'validateProductQueryParam': 
			return [ 
	            check('offset').notEmpty().isInt({ gt: -1 }).withMessage('Invalid offset data'),
	            check('limit').notEmpty().isInt({ lt: 10 }).withMessage('Invalid limit data'),
	            check('sort').notEmpty().isIn(['newest', 'name', 'price']).withMessage('Invalid sort data'),
	            check('order').notEmpty().isIn(['ASC', 'DESC']).withMessage('Invalid order data'),
	            check('category').optional().isLength({ max:32 }).isIn(['men', 'women', 'kids', 'tshirts-polo', 'jean', 'trousers', 'baby-boy', 'baby-girl']).withMessage('Invalid category data'),
	            check('brands').optional().isLength({ max:128 }).withMessage('Invalid brands data'),
	            check('minPrice').optional().isInt({ gt: -1, lt:1000000 }).withMessage('Invalid min price data'),
	            check('maxPrice').optional().isInt({ gt: 5, lt:1000000 }).withMessage('Invalid max price data'),
	            
	        ]; 
		break;
		case 'customerRegisteration': 
			return [ 
	            check('f_name').notEmpty().withMessage('First Name is empty').isLength({ min: 2, max:64 }).withMessage('First Name should be min 2 and max 64 chars')
	            .matches(/^[a-zA-Z ]*$/)
	            .withMessage('First Name should allow only alphabets '),
	            check('l_name').notEmpty().withMessage('Last Name is empty').isLength({ min: 2, max:64 }).withMessage('Last Name should be min 2 and max 64 chars')
	            .matches(/^[a-zA-Z ]*$/)
	            .withMessage('Last Name should allow only alphabets '),
	            check('email').isEmail().withMessage('Invalid Email').custom((value, { req }) => {
	            	return customerLoginModel.findCustomerByEmail(value, req.id).then(user => {
            		    if (user) {
            		      return Promise.reject('E-mail already in use');
            		    }
            		})
	            }),
	            check('mobile').isLength({ min: 10, max:10 }).withMessage('Invalid Mobile').custom((value, { req }) => {
	            	return customerLoginModel.findCustomerByMobile(value, req.id).then(user => {
            		    if (user) {
            		      return Promise.reject('Mobile number already in use');
            		    }
            		})
	            }),
	            check('pwd')
	            .if((value, { req }) => (!req.id || (req.id > 0 && req.body.pwd)))
	            .exists()
	            .withMessage('Password should not be empty')
	            .isLength({ min: 8, max:16 })
	            .withMessage('Password should be min 8 and max 16 chars')
	            .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/)
	            .withMessage('Password should be at least one letter, one number and one special character')
	            .custom((value, { req }) => {
	            	  if (value !== req.body.pwd_confirm) {
	            		  throw new Error('Password confirmation does not match password');
            		  }
            		  return true;
	            }),
	            check('address_1').notEmpty().withMessage('Address 1 is empty').isLength({ min: 2, max:255 }).withMessage('Address 1 should be min 2 and max 255 chars'),
	            check('address_2').notEmpty().withMessage('Address 2 is empty').isLength({ min: 2, max:255 }).withMessage('Address 2 should be min 2 and max 255 chars'),
	            check('city').notEmpty().withMessage('City is empty').isLength({ min: 2, max:64 }).withMessage('City should be min 2 and max 64 chars'),
	            check('pincode').notEmpty().withMessage('Postal Code is empty').isLength({ min: 2, max:6 }).withMessage('Postal Code should be min 2 and max 6 chars'),
	            check('state_id').notEmpty().withMessage('State is empty'),
	            (req, res, next) => {
	            	const errors = validationResult(req);
	                if (!errors.isEmpty()){
	                	 let errMsg = {error: true, msg:''};
	                	 errors.errors.map(err => errMsg.msg += err.msg+", ")
	                     return res.json(errMsg);
	                }
	                next();
	            }
	        ]; 
		break;
		case 'checkIsValidEmail': 
			return [ 
	            check('email').isEmail().withMessage('Invalid Email ID'),
	            (req, res, next) => {
	            	const errors = validationResult(req);
	                if (!errors.isEmpty()){
	                	 let errMsg = {error: true, msg:''};
	                	 errors.errors.map(err => errMsg.msg += err.msg+", ")
	                     return res.json(errMsg);
	                }
	                next();
	            }
	        ]; 
		case 'checkIsValidToken': 
			return [ 
				 check('token')
				 	.notEmpty()
		            .withMessage('Token should not be empty'),
	            (req, res, next) => {
	            	const errors = validationResult(req);
	                if (!errors.isEmpty()){
	                	 let errMsg = {error: true, msg:''};
	                	 errors.errors.map(err => errMsg.msg += err.msg+", ")
	                     return res.json(errMsg);
	                }
	                next();
	            }
	        ]; 
		break;
		case 'updateCustomerPwd': 
			return [ 
				 check('token')
				 	.notEmpty()
		            .withMessage('Token should not be empty'),
		         check('pwd')
				 	.notEmpty()
		            .withMessage('Password should not be empty')
		            .isLength({ min: 8, max:16 })
		            .withMessage('Password should be min 8 and max 16 chars')
		            .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/)
		            .withMessage('Password should be at least one letter, one number and one special character')
		            .custom((value, { req }) => {
		            	  if (value !== req.body.pwd_confirm) {
		            		  throw new Error('Password confirmation does not match password');
	            		  }
	            		  return true;
		            }),
	            (req, res, next) => {
	            	const errors = validationResult(req);
	                if (!errors.isEmpty()){
	                	 let errMsg = {error: true, msg:''};
	                	 errors.errors.map(err => errMsg.msg += err.msg+", ")
	                     return res.json(errMsg);
	                }
	                next();
	            }
	        ];
		break;
		case 'customerAddressUpd': 
			return [ 
	            check('address_1').notEmpty().withMessage('Address 1 is empty').isLength({ min: 2, max:255 }).withMessage('Address 1 should be min 2 and max 255 chars'),
	            check('address_2').notEmpty().withMessage('Address 2 is empty').isLength({ min: 2, max:255 }).withMessage('Address 2 should be min 2 and max 255 chars'),
	            check('city').notEmpty().withMessage('City is empty').isLength({ min: 2, max:64 }).withMessage('City should be min 2 and max 64 chars'),
	            check('pincode').notEmpty().withMessage('Postal Code is empty').isLength({ min: 2, max:6 }).withMessage('Postal Code should be min 2 and max 6 chars'),
	            check('state_id').notEmpty().withMessage('State is empty'),
	            (req, res, next) => {
	            	const errors = validationResult(req);
	                if (!errors.isEmpty()){
	                	 let errMsg = {error: true, msg:''};
	                	 errors.errors.map(err => errMsg.msg += err.msg+", ")
	                     return res.json(errMsg);
	                }
	                next();
	            }
	        ];
		case 'createOrder': 
			return [ 
	            check('data.cartItems').custom((value, { req }) => {
	            	  const data = req.body.data.cartItems;
	            	  let isValid = true;
	            	  if(Object.keys(data).length > 0){
	            		  Object.keys(data).forEach(prodId => {
	            			  prodId = parseInt(prodId);
	            			  if(isValid && typeof prodId == 'number' && prodId > 0){
	            				  Object.keys(data[prodId].productSub).forEach((subProdId) => {
	            					  subProdId = parseInt(subProdId);
	            					  if(isValid && (typeof subProdId != 'number' || subProdId <= 0)){
	            						  isValid = false;
	            					  }
								  });
	            			  } else{
	            				  isValid = false;
	            			  }
	            		  });
	            	  } else {
	            		  isValid = false;
	            	  }
	            	  
	            	  if (!isValid) {
	            		  throw new Error('Invalid cart items, Please try again.');
            		  }
            		  return true;
	            }),
	            (req, res, next) => {
	            	const errors = validationResult(req);
	                if (!errors.isEmpty()){
	                	 let errMsg = {error: true, msg:''};
	                	 errors.errors.map(err => errMsg.msg += err.msg+", ")
	                     return res.json(errMsg);
	                }
	                next();
	            }
	        ];
		break;
		case 'guestDtls': 
			return [ 
	            check('data.guestDtls.f_name').notEmpty().withMessage('First Name is empty').isLength({ min: 2, max:64 }).withMessage('First Name should be min 2 and max 64 chars')
	            .matches(/^[a-zA-Z ]*$/)
	            .withMessage('First Name should allow only alphabets '),
	            check('data.guestDtls.l_name').notEmpty().withMessage('Last Name is empty').isLength({ min: 2, max:64 }).withMessage('Last Name should be min 2 and max 64 chars')
	            .matches(/^[a-zA-Z ]*$/)
	            .withMessage('Last Name should allow only alphabets '),
	            check('data.guestDtls.email').isEmail().withMessage('Invalid Email'),
	            check('data.guestDtls.mobile').isLength({ min: 10, max:10 }).withMessage('Invalid Mobile'),
	            check('data.guestDtls.address_1').notEmpty().withMessage('Address 1 is empty').isLength({ min: 2, max:255 }).withMessage('Address 1 should be min 2 and max 255 chars'),
	            check('data.guestDtls.address_2').notEmpty().withMessage('Address 2 is empty').isLength({ min: 2, max:255 }).withMessage('Address 2 should be min 2 and max 255 chars'),
	            check('data.guestDtls.city').notEmpty().withMessage('City is empty').isLength({ min: 2, max:64 }).withMessage('City should be min 2 and max 64 chars'),
	            check('data.guestDtls.pincode').notEmpty().withMessage('Postal Code is empty').isLength({ min: 2, max:6 }).withMessage('Postal Code should be min 2 and max 6 chars'),
	            check('data.guestDtls.state_id').notEmpty().withMessage('State is empty'),
	            (req, res, next) => {
	            	const errors = validationResult(req);
	                if (!errors.isEmpty()){
	                	 let errMsg = {error: true, msg:''};
	                	 errors.errors.map(err => errMsg.msg += err.msg+", ")
	                     return res.json(errMsg);
	                }
	                next();
	            }
	        ]; 
		break;
		case 'getOrders': 
			return [ 
	            check('lastOrderCnt').notEmpty().withMessage('Invalid order count').isInt({ gte: 0, lte: 10000 }).withMessage('Invalid order count'),
	            (req, res, next) => {
	            	const errors = validationResult(req);
	                if (!errors.isEmpty()){
	                	 let errMsg = {error: true, msg:''};
	                	 errors.errors.map(err => errMsg.msg += err.msg+", ")
	                     return res.json(errMsg);
	                }
	                next();
	            }
	        ]; 
		break;
		case 'validateOrderNo': 
			return [ 
	            check('orderNo').notEmpty().withMessage('Invalid order number').isLength({ min: 16, max:18 }).withMessage('Invalid order number')
	            .custom((value, { req }) => {
	            	return orderModel.findOrederNo(value, req.id).then(order => {
	        		    if (!order) {
	        		      return Promise.reject('Invalid order number');
	        		    }
	        		})
	            }),
	            (req, res, next) => {
	            	const errors = validationResult(req);
	                if (!errors.isEmpty()){
	                	 let errMsg = {error: true, msg:''};
	                	 errors.errors.map(err => errMsg.msg += err.msg+", ")
	                     return res.json(errMsg);
	                }
	                next();
	            }
	        ]; 
		break;
		case 'validateUpdOrder': 
			return [ 
	            check('ord_no').notEmpty().withMessage('Invalid order number').isLength({ min: 16, max:18 }).withMessage('Invalid order number')
	            .custom((value, { req }) => {
	            	return orderModel.findOrederNo(value).then(order => {
	        		    if (!order) {
	        		      return Promise.reject('Invalid order number');
	        		    }
	        		})
	            }),
	            check('ord_status_id').isIn([1,2,3]).withMessage('Invalid order status'),
	            (req, res, next) => {
	            	const errors = validationResult(req);
	                if (!errors.isEmpty()){
	                	 let errMsg = {error: true, msg:''};
	                	 errors.errors.map(err => errMsg.msg += err.msg+", ")
	                     return res.json(errMsg);
	                }
	                next();
	            }
	        ]; 
		break;
		default:
			return [];
		
	}
}