const Customer = require("../../tblMapping/Customer");
const Guest = require("../../tblMapping/Guest");
const Order = require("../../tblMapping/Order");
const OrderDtls = require("../../tblMapping/OrderDtls");
const Products = require("../../tblMapping/Products");
const ProductsSub = require("../../tblMapping/ProductsSub");
const State = require("../../tblMapping/State");
const OrderStatus = require("../../tblMapping/OrderStatus");
const { Op, literal, QueryTypes } = require("sequelize");
const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports = {
	async createOrderByCustomer(req, callback) {
		let t =  await req.con.transaction(), isErr = false, totalAmt = 0, insufQtyProds = {}, customerDtls, customerId, guestId;
		console.log(req.body.data);
		const cartItems = req.body.data.cartItems;
		const guestDtls = req.body.data.guestDtls;
		
		if(req.id == undefined && typeof guestDtls.f_name == 'string' && guestDtls.f_name.trim().length){
			customerDtls = guestDtls;
			const {f_name, l_name, email, mobile} = guestDtls;
			const guest = await Guest.create({f_name, l_name, email, mobile}, {transaction: t});
			guestId = guest.id;
		} else{
			customerId = req.id;
			const customer = await Customer.findOne({where: {id: customerId, active: 1}, attributes: [ 'f_name', 'l_name', 'email', 'address_1', 'address_2', 'city', 'state_id', 'pincode']})
			customerDtls = customer.get();
		}
		
		
		try {
			
			
			Object.keys(cartItems).forEach((prodId) => {
				let productSub = cartItems[prodId].productSub;
				Object.values(productSub).forEach((row) => {
					totalAmt += (parseInt(row.order_qty) * parseFloat(row.prod_price))
				});
			});
			const orderNo = 'ORD'+(new Date()).getTime();
			let insertObj = {
				ord_no: orderNo,
				ord_tot_amt: totalAmt,
				ord_status_id: 1,
				ship_address_1: customerDtls.address_1,
				ship_address_2: customerDtls.address_2,
				ship_city: customerDtls.city,
				ship_state_id: customerDtls.state_id,
				ship_pincode: customerDtls.pincode
			}
			if(customerId > 0){
				insertObj = {...insertObj, cust_id: customerId};
			} else{
				insertObj = {...insertObj, guest_id: guestId}
			}
			const order = await Order.create(insertObj, {transaction: t});
			const orderId = order.id;
			if(orderId > 0){
				Object.keys(cartItems).forEach((prodId, index) => {
					if(!isErr){
						let productSub = cartItems[prodId].productSub;
						Object.keys(productSub).forEach(async (prodSubId) => {
							 try {
								 let values = productSub[prodSubId];
								 let order_qty = parseInt(values.order_qty);
								 let product =  await ProductsSub.update({'prod_avail_qty': literal(`prod_avail_qty - ${order_qty}`)}, { where: { id: prodSubId, prod_id: prodId, prod_avail_qty: {[Op.gte]: order_qty}}, transaction: t });
								 const [updCnt] = product;
								 if(updCnt > 0){
									 insertObj = {
										ord_id: orderId,
										prod_id: prodId,
										prod_size: values.prod_size,
										prod_qty: order_qty,
										prod_price: parseFloat(values.prod_price),
									 }
									 const orderDtls = await OrderDtls.create(insertObj, {transaction: t});
									 if(!orderDtls.id){
										 isErr = true;
									 }
								 }else{
									 insufQtyProds[prodSubId] = {...values, prod_id: prodId};
								 }
								 
								 if(isErr){
									 await t.rollback();
									 callback({error: true, msg:'Order creation failed'});
								 }
								 if((Object.keys(cartItems).length - 1) == index){
									 if(Object.keys(insufQtyProds).length == 0){
										await t.commit();
										const gmailUserName = process.env.GMAIL_USERNAME;
								    	const gmailPwd = process.env.GMAIL_PASSWORD;
								    	const baseURL = process.env.BASE_CLIENT_URL;
								    	 
								    	 if(gmailUserName && gmailPwd && customerDtls.email){
								    		 const transporter = nodemailer.createTransport({
									    		  service: 'gmail',
									    		  auth: {
									    			  user: gmailUserName,
										    		  pass: gmailPwd
									    		  }
									    	 });

									    	 const mailOptions = {
									    		  from: gmailUserName,
									    		  to: customerDtls.email,
									    		  subject: 'Onlineshopping: Order# - ${orderNo}',
									    		  html: `Hi ${customerDtls.f_name}  ${customerDtls.l_name}, <br><br>\t\t  Your order has been sucessfully created, Please use the below link and check your order details.
									    		  <br>\t\t Order# <a href="${baseURL}store/orderDtls/${orderNo}" target="_blank">${orderNo}</a>
									    		  <br><br>Thanks,<br/>Online shopping.`
									    	 };

									    	 transporter.sendMail(mailOptions);
								    	 }
										 callback({error: false, msg: orderNo})
									 } else{
										 await t.rollback();
										 callback({error: true, msg:'Some products have insufficient quantity', prodDtls: insufQtyProds});
									 }
								 }
							 }catch (error) {
								 await t.rollback();
							     callback({error: true, msg:'Order creation failed'});
							 }
						});
					}
				})
				
				
			} else{
				await t.rollback();
			}
		}catch (error) {
			 await t.rollback();
		     callback({error: true, msg:'Order creation failed'});
		}
	},
	async getOrders(req, callback) {
		try{
			const cust_id = req.id, lastOrderCnt = parseInt(req.query.lastOrderCnt);
			let replacements = {}, queryStr = "Select ";
			
			if(cust_id >= 0){
				queryStr += " (Select count(*) from order_tbl where cust_id = :customer_id) as cnt, ";
			} else {
				queryStr += " guest.id as guest_id, if(cust.id > 0, 'Customer', 'Guest') as customer_type, cust.id as customer_id, if(cust.id > 0, concat(cust.f_name,' ', cust.l_name), concat(guest.f_name,' ', guest.l_name)) as customer_name, "
			}
			
			queryStr += " ord.ord_no, ord.ord_tot_amt, ord.date_of_creation, ord.last_update, ord_status.name as order_status  " +
			"from order_tbl ord Inner Join order_status_tbl ord_status ON ord_status.id = ord.ord_status_id ";
			
			if(cust_id >= 0){
				queryStr += " Inner Join customers_tbl cust ON cust.id = ord.cust_id  where ord.cust_id = :cust_id order by ord.date_of_creation desc limit 3 offset "+lastOrderCnt;
				replacements.cust_id = req.id;
				replacements.customer_id = req.id;
			} else{
				queryStr += " Left Join customers_tbl cust ON cust.id = ord.cust_id  " +
						"Left Join guest_tbl guest ON guest.id = ord.guest_id order by ord.date_of_creation desc";
			}
			
			const rows = await req.con.query(queryStr, { replacements, type: QueryTypes.SELECT });
	    	callback({error: false, data: rows});
		} catch(error){
			callback({error: true, msg:'Order fetch failed'});
		}
	},
	findOrederNo(ord_no, cust_id){
		let whereObj = {ord_no};
		if(cust_id){
			whereObj.cust_id = cust_id;
		}
	    return  Order.count({ where: whereObj  });
	},
	async cancelOrder(ord_no, cust_id, callback){
		try{
			const last_update = new Date().toISOString();
			let ordUpdate = await Order.update({ord_status_id: 3, last_update}, { where: {ord_no, cust_id, ord_status_id: 1}  });
			const [updCnt] = ordUpdate;
			callback({error: false, data: {last_update, updCnt}});
		} catch(error){
			callback({error: true, msg:'Order cancelled failed'});
		}
		
	},
	async getOrderDetails(req, callback){
		try{
			const ord_no = req.query.orderNo || req.params.ordNo;
			const cust_id = req.id || 0;
			let replacements = {};
			let queryStr = "Select ";
			
			if(cust_id == 0){
				queryStr += " cust.f_name, cust.l_name, cust.id as customer_id, guest.id as guest_id, if(cust.id > 0, concat(cust.f_name,'##', cust.l_name,'##', cust.email,'##', cust.mobile), concat(guest.f_name,'##', guest.l_name,'##', guest.email,'##', guest.mobile)) as customer_dtls, "
			}
			queryStr += " ord.ord_no, ord.ord_tot_amt, ord.date_of_creation, ord.last_update, ord.ord_status_id, ord.ship_address_1, ord.ship_address_2, ord.ship_city, ord.ship_pincode, ord_status.name as order_status, state.name as state_name, prod.prod_name, prod.prod_img, prod.prod_url, ord_dtl.prod_qty, ord_dtl.prod_size, ord_dtl.prod_price  " +
			"from order_tbl ord Inner Join order_status_tbl ord_status ON ord_status.id = ord.ord_status_id " +
			" Inner Join state_tbl state ON state.id = ord.ship_state_id " +
			" Inner Join order_dtls_tbl ord_dtl ON ord_dtl.ord_id = ord.id " +
			" Inner Join products_tbl prod ON prod.id = ord_dtl.prod_id ";
			
			if(cust_id == 0){
				queryStr += " LEFT Join customers_tbl cust ON cust.id = ord.cust_id " +
						" Left Join guest_tbl guest ON guest.id = ord.guest_id where ord.ord_no = :ord_no";
				
			} else {
				queryStr += " Inner Join customers_tbl cust ON cust.id = ord.cust_id where ord.cust_id = :cust_id AND ord.ord_no = :ord_no";
				replacements.cust_id = cust_id;
			}
			replacements.ord_no = ord_no;
			
			const rows = await req.con.query(queryStr, { replacements, type: QueryTypes.SELECT });
			
			const orderStatusArr = await OrderStatus.findAll({attributes: ['id', 'name']})
			
			if(Array.isArray(rows) && rows.length > 0){
				const {ord_no, ord_tot_amt, date_of_creation, last_update, ship_address_1, ship_address_2, ship_city, ship_pincode, order_status, state_name, f_name, l_name, customer_dtls} = rows[0];
				
				let orderDtls = {ord_no, ord_tot_amt, date_of_creation, last_update, ship_address_1, ship_address_2, ship_city, ship_pincode, order_status, state_name, prodDtls: []}
				
				if(cust_id == 0){
					let cutomerDtlsArr = customer_dtls.split('##');
					
					orderDtls.f_name = cutomerDtlsArr[0];
					orderDtls.l_name =  cutomerDtlsArr[1];
					orderDtls.email = cutomerDtlsArr[2];
					orderDtls.mobile = cutomerDtlsArr[3];
					orderDtls.orderStatusArr = orderStatusArr;
				}
				rows.forEach(row => {
					const {prod_name, prod_img, prod_url, prod_qty, prod_size, prod_price} = row;
					orderDtls.prodDtls.push({prod_name, prod_img, prod_url, order_qty: prod_qty, prod_size, prod_price});
				});
				orderDtls.clientBaseURL = process.env.BASE_CLIENT_URL;
				callback({error: false, data: orderDtls});
			} else{
				callback({error: true, msg:'Order details fetch failed'});
			}
			
			
		} catch(error){
			callback({error: true, msg:'Order fetch failed '+error});
		}
	},
	async updateOrderStatus(body, callback){
		try{
			let orderDtls = JSON.parse(body.ord_dtls);
			if(body.ord_status_id == 2 || body.ord_status_id == 3){
				const last_update = new Date().toISOString();
				let ordUpdate =  await Order.update({ord_status_id: parseInt(body.ord_status_id), last_update}, { where: {ord_no: body.ord_no, ord_status_id: 1}  });
				const [updCnt] = ordUpdate;
				orderDtls.ord_status_id = (updCnt > 0 ? body.ord_status_id : 3);
				orderDtls.last_update = last_update;
				orderDtls.order_status = (body.ord_status_id == 2 && updCnt > 0 ? 'Delivered' : 'Cancelled');
			}
			callback({error: false, data: orderDtls, msg:'Order status updated sucessfully'});
		} catch(error){console.log(error)
			callback({error: true, msg:'Order cancelled failed', data: {}});
		}
		
	},
}