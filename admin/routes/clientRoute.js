const express = require('express');
const router = express.Router();
const productsController = require('../controller/products/productsController');
const loginController = require('../controller/customer/loginController');
const orderController = require('../controller/order/orderController');
const validate = require('../middleware/validate');
const verifyToken = require('../middleware/verifyToken');

router.get('/getAllProducts',  productsController.getAllProducts);
router.get('/getAllCategory',  productsController.getAllCategory);
router.get('/getBestSellers',  productsController.getBestSellers);
router.get('/getProductPriceMinAndMax',  productsController.getProductPriceMinAndMax);
router.get('/getProductCount',  productsController.getProductCount);
router.get('/getAllBrands',  productsController.getAllBrands);
router.get('/getSingleProductDtls',  productsController.getSingleProductDtls);
router.get('/getCSRFToken', function(req, res) {productsController.getCSRFToken(req, res)});
router.get('/checkIsValidToken', [validate('checkIsValidToken')], loginController.checkIsValidToken);
router.get('/getAllStates',  loginController.getAllStates);

router.post('/customerLoginValidation', loginController.customerLoginValidation);
router.post('/customerRegisteration', validate('customerRegisteration'), loginController.customerRegisteration);
router.post('/updateCustomerPwd', validate('updateCustomerPwd'), loginController.updateCustomerPwd);
router.post('/checkIsValidEmail', [validate('checkIsValidEmail')], loginController.checkIsValidEmail);
router.post('/getProdUpdatedPrices',  productsController.getProdUpdatedPrices);
router.post('/createOrderByGuest',  [validate('guestDtls'), validate('createOrder')], orderController.createOrderByCustomer);


/* Authenticate Routes */
router.get('/getCustomerDtls', verifyToken, function(req, res) {loginController.getCustomerDtls(req, res)});
router.get('/getOrders', [verifyToken, validate('getOrders')] , orderController.getOrders);
router.get('/getOrderDetails', [verifyToken, validate('validateOrderNo')], orderController.getOrderDetails);

router.post('/cancelOrder', [verifyToken, validate('validateOrderNo')], orderController.cancelOrder);
router.post('/createOrderByCustomer',  [verifyToken, validate('createOrder')], orderController.createOrderByCustomer);
router.post('/customerAddressUpd', [verifyToken, validate('customerAddressUpd')], loginController.customerAddressUpd);
router.post('/customerDtlsUpdate', [verifyToken, validate('customerRegisteration')], loginController.customerRegisteration);



module.exports = router;