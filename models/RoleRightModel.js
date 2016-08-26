
var sequelize = require('../utils/sequelizeDB');
var Sequelize = require('sequelize');
var RoleRightModel = sequelize.define('RoleRight', {
    role_right_id: { type: Sequelize.STRING, primaryKey: true,field:'role_right_id'},
    role_id: { type: Sequelize.STRING, field:'role_id'},
    right_id: { type: Sequelize.STRING, field:'right_id'},
    state: { type: Sequelize.INTEGER, field:'state'},
    create_date: { type: Sequelize.DATE, field:'create_date'}
}, {
    freezeTableName: true,
    tableName: 'role_right',
    timestamps: false
});

module.exports = RoleRightModel;
