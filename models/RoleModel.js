
var sequelize = require('../utils/sequelizeDB');
var Sequelize = require('sequelize');
var RoleModel = sequelize.define('Role', {
    role_id: { type: Sequelize.STRING, primaryKey: true,field:'role_id'},
    role_name: { type: Sequelize.STRING, field:'role_name'},
    role_node: { type: Sequelize.STRING, field:'role_node'},
    create_date: { type: Sequelize.DATE, field:'create_date'},
}, {
    freezeTableName: true,
    tableName: 'role',
    timestamps: false
});

module.exports = RoleModel;
