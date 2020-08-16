const orderModel = require("../../model/order/orderModel");

module.exports = {
	createOrderByCustomer: function(req, res) {
		orderModel.createOrderByCustomer(req, (resp) => {
			res.json(resp);
		});
    },
    getOrders: function(req, res) {
    	orderModel.getOrders(req, (resp) => {
			res.json(resp);
		});
    },
    cancelOrder: function(req, res) {
    	orderModel.cancelOrder(req.body.orderNo, req.id, (resp) => {
			res.json(resp);
		});
    },
    getOrderDetails: function(req, res) {
    	orderModel.getOrderDetails(req, (resp) => {
			res.json(resp);
		});
    },
    getOrdersList: function(req, res) {
    	 orderModel.getOrders(req, (resp) => {
  		   	if(resp.error){
  		   		res.render('orders/ordersList', { error: resp.msg });
  		    } else{
  		    	res.render('orders/ordersList', {data: resp.data });
  		    }
  		});
    },
    editOrder: function(req, res) {console.log("editOrder");
     	 orderModel.getOrderDetails(req, (response) => {
  	   		if(response.error === true){
  	   			return res.redirect('/admin/logout');
  	   		}
  	   		res.render('orders/viewOrder', response);
  	    });
  	},
  	updateOrderStatus: function(req, res) {
  		orderModel.updateOrderStatus(req.body, (response) => {
    		res.render('orders/viewOrder', response);
	    });
    },
}