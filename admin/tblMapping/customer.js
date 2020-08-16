const con = require("../../config/db.js");
const Sequelize = require('sequelize');
const State = require("./State");

const Customers = con.define('Customers', {
	id: {type: Sequelize.BIGINT(11), primaryKey: true, autoIncrement: true},
	f_name: {type: Sequelize.STRING(64)},
	l_name: {type: Sequelize.STRING(64)},
	email: {type: Sequelize.STRING(64), unique: true, validate: {isEmail: true}},
	mobile: {type: Sequelize.STRING(16), unique: true},
	pwd: {type: Sequelize.STRING(64)},
	address_1: {type: Sequelize.STRING(255)},
	address_2: {type:  Sequelize.STRING(255)},
	city: {type:  Sequelize.STRING(64)},
	state_id: {type: Sequelize.BIGINT(2)},
	pincode: {type:  Sequelize.STRING(8)},
	active: {type: Sequelize.INTEGER(1), defaultValue: 1, validate: {isInt: true, isIn: [[0,1]]}},
	token: {type:  Sequelize.STRING(64), defaultValue: null},
}, {
  tableName: 'customers_tbl',
  updatedAt: 'last_update',
  createdAt: 'date_of_creation'
});

module.exports = Customers;

State.belongsTo(Customers, {
    foreignKey: 'state_id',
	as: 'stateId'
});
