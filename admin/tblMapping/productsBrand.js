const con = require("../../config/db.js");
const Sequelize = require('sequelize');

const ProductsBrand = con.define('ProductsBrand', {
	id: {type: Sequelize.INTEGER(2), primaryKey: true, autoIncrement: true},
	name: {type: Sequelize.STRING(64)},
}, {
  tableName: 'products_brand_tbl',
  timestamps: false
});

module.exports = ProductsBrand;
