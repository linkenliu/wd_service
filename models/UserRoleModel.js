
var sequelize = require('../utils/sequelizeDB');
var Sequelize = require('sequelize');
var UserRoleModel = sequelize.define('UserRole', {
    user_role_id: { type: Sequelize.STRING, primaryKey: true,field:'user_role_id'},
    role_id: { type: Sequelize.STRING, field:'role_id'},
    user_id: { type: Sequelize.STRING, field:'user_id'},
    state: { type: Sequelize.INTEGER, field:'state'},
    create_date: { type: Sequelize.DATE, field:'create_date'}
}, {
    freezeTableName: true,
    tableName: 'user_role',
    timestamps: false
});

module.exports = UserRoleModel;
