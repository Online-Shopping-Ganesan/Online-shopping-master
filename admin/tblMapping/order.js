const con = require("../../config/db.js");
const Sequelize = require('sequelize');
const Customers = require("./Customer");
const OrderStatus = require("./OrderStatus");

const Order = con.define('Order', {
	id: {type: Sequelize.BIGINT(11), primaryKey: true, autoIncrement: true},
	ord_no: {type: Sequelize.STRING(32), unique: true},
	cust_id: {type: Sequelize.BIGINT(11)},
	guest_id: {type: Sequelize.BIGINT(11)},
	ord_tot_amt: {type:  Sequelize.DECIMAL(16,2)},
	ord_status_id: {type: Sequelize.INTEGER(2)},
	ship_address_1: {type: Sequelize.STRING(255)},
	ship_address_2: {type:  Sequelize.STRING(255)},
	ship_city: {type:  Sequelize.STRING(64)},
	ship_state_id: {type: Sequelize.BIGINT(2)},
	ship_pincode: {type:  Sequelize.STRING(8)},
}, {
  tableName: 'order_tbl',
  updatedAt: 'last_update',
  createdAt: 'date_of_creation'
});

module.exports = Order;

OrderStatus.belongsTo(Order, {
    foreignKey: 'cust_id',
	as: 'custId'
});

Customers.belongsTo(Order, {
    foreignKey: 'ord_status_id',
	as: 'ordStatusId'
});