const con = require("../../config/db.js");
const Sequelize = require('sequelize');
const Order = require("./Order");
const Products = require("./Products");

const OrderDtls = con.define('OrderDtls', {
	id: {type: Sequelize.BIGINT(11), primaryKey: true, autoIncrement: true},
	ord_id: {type: Sequelize.BIGINT(11)},
	prod_id: {type: Sequelize.BIGINT(11)},
	prod_qty: {type: Sequelize.BIGINT(6)},
	prod_size: {type: Sequelize.STRING(8)},
	prod_price: {type: Sequelize.DECIMAL(6,2)},
}, {
  tableName: 'order_dtls_tbl',
  timestamps: false
});

module.exports = OrderDtls;

Order.hasMany(OrderDtls, {
    foreignKey: 'ord_id',
	as: 'ordId'
});

Products.belongsTo(OrderDtls, {
    foreignKey: 'prod_id',
	as: 'prodId'
});
