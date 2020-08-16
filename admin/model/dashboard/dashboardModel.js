const AdminUser = require("../../tblMapping/adminUser");
const Products = require("../../tblMapping/Products");
const Customers = require("../../tblMapping/Customer");
const Order = require("../../tblMapping/Order");

module.exports = {
	getDashboardCnt: function(callback) {
	const adminUser = AdminUser.count();
	const products = Products.count();
	const customers = Customers.count();
	const order = Order.count();
	
	Promise.all([adminUser, products, customers, order]).then(responses => {
		if (!responses ) {
   		 callback({error: true, msg: 'Dashboard detail fetch issue'});
	     } else {
	    	 callback({error: false, adminUser: responses[0], products: responses[1], customers: responses[2], order: responses[3]});
	     }
	}).catch(function(){
		callback({error: true, msg: 'Opps something went wrong!'});
	});
  },
}