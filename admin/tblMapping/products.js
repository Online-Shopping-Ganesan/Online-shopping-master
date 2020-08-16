const con = require("../../config/db.js");
const AdminUser = require("./AdminUser");
const ProductsCate = require("./ProductsCate");
const ProductsSub = require("./ProductsSub");
const ProductsBrand = require("./ProductsBrand");
const Sequelize = require('sequelize');

const Products = con.define('Products', {
	id: {type: Sequelize.BIGINT(11), primaryKey: true, autoIncrement: true},
	prod_cate_id: {type: Sequelize.INTEGER(2)},
	prod_name: {type: Sequelize.STRING(64)},
	prod_desc: {type: Sequelize.TEXT()},
	prod_url: {type: Sequelize.STRING(86), unique: true},
	prod_meta_keyword: {type: Sequelize.STRING(255), defaultValue: null},
	prod_meta_desc: {type: Sequelize.STRING(255), defaultValue: null},
	prod_img: {type: Sequelize.STRING(255)},
	active: {type: Sequelize.INTEGER(1), defaultValue: 1, validate: {isInt: true, isIn: [[0,1]]}},
	created_by: {type: Sequelize.BIGINT(11)},
	updated_by: {type: Sequelize.BIGINT(11), defaultValue: null},
}, {
  tableName: 'products_tbl',
  updatedAt: 'last_update',
  createdAt: 'date_of_creation'
});

module.exports = Products;

Products.belongsTo(AdminUser, {
    foreignKey: 'created_by',
	as: 'createdBy'
});
Products.belongsTo(AdminUser, {
	foreignKey: 'updated_by',
	as: 'updatedBy'
});
Products.belongsTo(ProductsCate, {
	foreignKey: 'prod_cate_id'
});
Products.hasMany(ProductsSub, {
	foreignKey: 'prod_id'
});

Products.belongsTo(ProductsBrand, {
	foreignKey: 'prod_brand_id'
});
