const con = require("../../config/db.js");
const Sequelize = require('sequelize');

const ProductsCate = con.define('ProductsCate', {
	id: {type: Sequelize.INTEGER(2), primaryKey: true, autoIncrement: true},
	name: {type: Sequelize.STRING(64)},
	page_url: {type: Sequelize.STRING(64), unique: true},
	parent_id: {type: Sequelize.INTEGER(2), defaultValue: null},
}, {
  tableName: 'products_cate_tbl',
  timestamps: false
});

module.exports = ProductsCate;