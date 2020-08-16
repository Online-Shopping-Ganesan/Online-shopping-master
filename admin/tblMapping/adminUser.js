const con = require("../../config/db.js");
const Sequelize = require('sequelize');

const AdminUser = con.define('AdminUser', {
	id: {type: Sequelize.BIGINT(11), primaryKey: true, autoIncrement: true},
	f_name: {type: Sequelize.STRING(64)},
	l_name: {type: Sequelize.STRING(64)},
	email: {type: Sequelize.STRING(64), unique: true, validate: {isEmail: true}},
	u_name: {type: Sequelize.STRING(32), unique: true},
	pwd: {type: Sequelize.STRING(72)},
	is_admin: {type: Sequelize.INTEGER(1), defaultValue: 0, validate: {isInt: true, isIn: [[0,1]]}},
	active: {type: Sequelize.INTEGER(1), defaultValue: 1, validate: {isInt: true, isIn: [[0,1]]}},
}, {
  tableName: 'admin_user_tbl',
  updatedAt: 'last_update',
  createdAt: 'date_of_creation'
});

module.exports = AdminUser;