const con = require("../../config/db.js");
const Sequelize = require('sequelize');

const ProductsSub = con.define('ProductsSub', {
	id: {type: Sequelize.BIGINT(11), primaryKey: true, autoIncrement: true},
	prod_id: {type: Sequelize.BIGINT(11)},
	prod_size: {type: Sequelize.STRING(8)},
	prod_avail_qty: {type: Sequelize.BIGINT(12)},
	prod_price: {type: Sequelize.DECIMAL(6,2)},
}, {
  tableName: 'products_sub_tbl',
  timestamps: false
});

module.exports = ProductsSub;