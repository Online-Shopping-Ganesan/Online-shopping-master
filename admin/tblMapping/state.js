const con = require("../../config/db.js");
const Sequelize = require('sequelize');
const Country = require("./Country");

const State = con.define('State', {
	id: {type: Sequelize.INTEGER(2), primaryKey: true, autoIncrement: true},
	cntry_id: {type: Sequelize.INTEGER(2)},
	name: {type: Sequelize.STRING(64)}
}, {
  tableName: 'state_tbl',
  timestamps: false
});

module.exports = State;

Country.hasMany(State, {
	foreignKey: 'cntry_id',
	as: 'cntryId'
});
