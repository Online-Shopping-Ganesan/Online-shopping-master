const express = require('express');
const router = express.Router();
const loginController = require('../controller/login/loginController');
const usersController = require('../controller/users/usersController');
const productsController = require('../controller/products/productsController');
const dashboardController = require('../controller/dashboard/dashboardController');
const customerController = require('../controller/customer/loginController');
const orderController = require('../controller/order/orderController');
const validate = require('../middleware/validate');
const adminMiddleware = require('../middleware/adminMiddleware');

/* Login */
router.get('/', adminMiddleware.checkNonAuthenticatePages,function(req, res) { res.render('index'); });
router.post('/loginValidation', loginController.loginValidation);

/* Dashboard */
router.get('/dashboard', adminMiddleware.checkAuthenticatePages, function(req, res) { dashboardController.getDashboardCnt(req, res) });

/* Admin User */
router.get('/adminUsersList', [adminMiddleware.checkAuthenticatePages, adminMiddleware.checkIsAdminPages], usersController.getAdminUserList);
router.get('/createAdminUser', [adminMiddleware.checkAuthenticatePages, adminMiddleware.checkIsAdminPages],  function(req, res){ res.render('users/createAdminUser', {body:{}})});
router.get('/editAdminUser/:id', [adminMiddleware.checkAuthenticatePages, adminMiddleware.checkIsAdminPages],  function(req, res){ usersController.editAdminUser(req, res) });
router.post('/createAdminUser', [adminMiddleware.checkAuthenticatePages, adminMiddleware.checkIsAdminPages, validate('validateAdminUser')], usersController.createAdminUser);
router.post('/updateAdminUser', [adminMiddleware.checkAuthenticatePages, validate('validateAdminUser')], usersController.updateAdminUser);
router.delete('/deleteAdminUser/', adminMiddleware.checkAuthenticatePages, adminMiddleware.checkIsAdminPages, function(req, res){ usersController.deleteAdminUser(req, res) });

/* Products */
router.get('/productsList', adminMiddleware.checkAuthenticatePages, productsController.getProductsList);
router.get('/editProduct/:id', adminMiddleware.checkAuthenticatePages,  function(req, res){ productsController.editProduct(req, res) });
router.get('/createProducts', adminMiddleware.checkAuthenticatePages,  productsController.createNewProducts );
router.post('/createProducts', adminMiddleware.checkAuthenticatePages, productsController.createOrUpdateProducts);
router.post('/updateProduct', adminMiddleware.checkAuthenticatePages, productsController.createOrUpdateProducts);
router.delete('/deleteProducts/', adminMiddleware.checkAuthenticatePages, function(req, res){ productsController.deleteProducts(req, res) });

/* Customers */
router.get('/customersList', adminMiddleware.checkAuthenticatePages, customerController.getCustomerList);
router.get('/editCustomer/:id', adminMiddleware.checkAuthenticatePages,  function(req, res){ customerController.editCustomer(req, res) });

/* Orders */
router.get('/orderList', adminMiddleware.checkAuthenticatePages, orderController.getOrdersList);
router.get('/editOrder/:ordNo', adminMiddleware.checkAuthenticatePages,  function(req, res){ orderController.editOrder(req, res) });
router.post('/updateOrderStatus', [adminMiddleware.checkAuthenticatePages, validate('validateUpdOrder')], orderController.updateOrderStatus);


/* Profile Edit */
router.get('/editProfile/:id',  function(req, res){ req.body.editProfile = 'true'; usersController.editAdminUser(req, res) });

/* Logout */
router.get('/logout', function(req, res) { req.session.destroy(); res.redirect('/admin'); });
router.get('*',function(req,res){ res.redirect('/admin/logout')});

module.exports = router;