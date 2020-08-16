const con = require("../../config/db.js");
const Sequelize = require('sequelize');

const OrderStatus = con.define('OrderStatus', {
	id: {type: Sequelize.INTEGER(2), primaryKey: true, autoIncrement: true},
	name: {type: Sequelize.STRING(64)}
}, {
  tableName: 'order_status_tbl',
  timestamps: false
});

module.exports = OrderStatus;
