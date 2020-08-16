const con = require("../../config/db.js");
const Sequelize = require('sequelize');

const Country = con.define('Country', {
	id: {type: Sequelize.INTEGER(2), primaryKey: true, autoIncrement: true},
	name: {type: Sequelize.STRING(64)}
}, {
  tableName: 'country_tbl',
  timestamps: false
});

module.exports = Country;
