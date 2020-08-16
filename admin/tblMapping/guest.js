const con = require("../../config/db.js");
const Sequelize = require('sequelize');
const Order = require("./Order");

const Guest = con.define('Guest', {
	id: {type: Sequelize.BIGINT(11), primaryKey: true, autoIncrement: true},
	f_name: {type: Sequelize.STRING(64)},
	l_name: {type: Sequelize.STRING(64)},
	email: {type: Sequelize.STRING(64), validate: {isEmail: true}},
	mobile: {type: Sequelize.STRING(16)}
}, {
  tableName: 'guest_tbl',
  timestamps: false
});

module.exports = Guest;